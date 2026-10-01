/* ══════════════════════════════════════════════════════════════════
   19 · SETIEMBRE — el mes en curso

   Todo lo demás en esta torre sale del libro mayor de costos, que termina
   en agosto 2026. Setiembre es otra cosa y por eso vive aparte: viene del
   consolidado de SHGN, va por MODELO y no por equipo, está cortado al día
   6 y sólo cubre Shougang.

   A cambio trae lo único que el libro mayor no tiene: la tarifa proyectada
   contra la real —el "se cumplió"—, la disponibilidad mecánica y el usaje.
   Ninguna de las tres existe para los otros dieciséis meses; donde se
   ofrecen, se dice.
   ══════════════════════════════════════════════════════════════════ */
var SEP = (typeof SETIEMBRE !== 'undefined') ? SETIEMBRE : null;
var sepTipo = 'TODOS', sepOrden = 'desv';

function sepModelos(){
  if(!SEP) return [];
  return SEP.modelos.filter(function(m){
    return sepTipo === 'TODOS' || m.tipo === sepTipo;
  });
}
function sepConTarifa(){
  return sepModelos().filter(function(m){ return m.tProy.tot > 0 && m.hr > 0; });
}
function pc(x){ return (x * 100).toFixed(1) + '%'; }
/* Medio punto porcentual de holgura: el 777F se pasa por cuatro centimos
   sobre una tarifa de 75.5 y marcarlo en rojo seria ruido, no informacion. */
function sepCumple(m){
  return (m.tReal.tot - m.tProy.tot) <= m.tProy.tot * 0.005;
}

/* ---------- ¿este modelo tiene información de setiembre? ----------
   Lo usa la hoja Equipo para decir si hay algo que mostrar o no. */
function sepDeModelo(mod){
  if(!SEP || !mod) return null;
  var m = null, n = String(mod).trim().toUpperCase();
  SEP.modelos.forEach(function(x){
    if(!m && String(x.mod).trim().toUpperCase() === n) m = x;
  });
  return m;
}

/* ¿este modelo de setiembre existe tambien en el libro mayor? Solo
   entonces tiene sentido mandar a la hoja Flota filtrada por el. */
function sepHayModelo(mod){
  if(!mod || typeof TODOS === 'undefined') return false;
  var n = String(mod).trim().toUpperCase();
  for(var i = 0; i < TODOS.length; i++){
    if(String(TODOS[i].mod || '').trim().toUpperCase() === n) return true;
  }
  return false;
}

function pintarSetiembre(){
  if(!$('s-total') || !SEP) return;
  var t = SEP.total;

  txt('s-costo', 'US$ ' + fmt(Math.round(t.costo)));
  txt('s-venta', 'US$ ' + fmt(Math.round(t.venta)));
  txt('s-horas', fmt(Math.round(t.hr)) + ' h');
  txt('s-horasProf', 'de ' + fmt(Math.round(t.hrProf)) + ' h proyectadas');
  txt('s-treal', 'US$ ' + t.tReal.toFixed(2) + '/h');
  txt('s-tproy', 'contra US$ ' + t.tProy.toFixed(2) + '/h proyectada');
  txt('s-dm', pc(SEP.dm));
  txt('s-use', pc(SEP.use));
  txt('s-total', SEP.rotulo + ' · CORTE ' + SEP.corte.toUpperCase()
      + ' · SEDE ' + SEP.sede + ' · ' + SEP.nModelos + ' MODELOS · ' + t.nEq + ' EQUIPOS');

  var ct = sepConTarifa();
  var ok = ct.filter(sepCumple);
  txt('s-cumple', ok.length + ' de ' + ct.length);
  var caja = $('s-cumple');
  /* se conserva 'gt', que es lo que le da el tamano de cifra grande */
  if(caja) caja.className = 'gt ' + (ct.length && ok.length * 2 >= ct.length ? 'bien' : 'alza');

  /* ---------- cumplimiento de tarifa ---------- */
  var arr = ct.slice().sort(function(a, b){
    if(sepOrden === 'desv') return (b.tReal.tot - b.tProy.tot) - (a.tReal.tot - a.tProy.tot);
    if(sepOrden === 'horas') return b.hr - a.hr;
    return b.costo.tot - a.costo.tot;
  });
  var tb = $('s-tabla');
  if(tb){
    tb.innerHTML = arr.map(function(m){
      var d = m.tReal.tot - m.tProy.tot;
      var rel = m.tProy.tot ? d / m.tProy.tot * 100 : 0;
      var cum = sepCumple(m);
      /* del modelo que se pasa de tarifa a los equipos de ese modelo, que
         es la pregunta siguiente. Solo si el modelo existe en el libro:
         setiembre trae modelos que el libro mayor puede no tener. */
      var hay = sepHayModelo(m.mod);
      return '<tr' + (hay ? ' data-mod="' + esc(m.mod) + '" tabindex="0" class="ir"' : '') + '>'
        + '<td class="id">' + esc(m.mod) + '</td>'
        + '<td>' + esc(m.fam) + '</td>'
        + '<td><span class="pmc ' + (m.tipo === 'PROPIO' ? 'PM01' : 'PM02') + '">'
          + esc(m.tipo) + '</span></td>'
        + '<td class="nn">' + fmt(Math.round(m.hr)) + '</td>'
        + '<td class="nn fuerte">' + m.tReal.tot.toFixed(1) + '</td>'
        + '<td class="nn">' + m.tProy.tot.toFixed(1) + '</td>'
        + '<td class="nn ' + (cum ? 'baja' : 'sube') + '">'
          + (d >= 0 ? '+' : '') + d.toFixed(1) + '</td>'
        + '<td class="nn ' + (cum ? 'baja' : 'sube') + '">'
          + (rel >= 0 ? '+' : '') + rel.toFixed(0) + '%</td>'
        + '<td>' + (cum ? '<span class="cump si">EN TARIFA</span>'
                        : '<span class="cump no">SE PASA</span>') + '</td></tr>';
    }).join('') || '<tr><td colspan="9" style="padding:26px;text-align:center">'
        + 'Ningún modelo de ese tipo tiene tarifa proyectada y horas en setiembre.</td></tr>';
    Array.prototype.forEach.call(tb.querySelectorAll('tr[data-mod]'), function(tr){
      var ir = function(){
        ponerFiltroEq('mod', tr.getAttribute('data-mod'));
        irA('v-flota');
      };
      tr.addEventListener('click', ir);
      tr.addEventListener('keydown', function(ev){
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); ir(); }
      });
    });
  }
  txt('s-nTabla', arr.length + (arr.length === 1 ? ' modelo' : ' modelos')
      + ' con tarifa proyectada y horas en el mes · SE CUENTA EN TARIFA HASTA MEDIO PUNTO'
      + ' PORCENTUAL POR ENCIMA');

  /* ---------- disponibilidad y usaje ---------- */
  var dm = sepModelos().filter(function(m){ return m.dm > 0; })
                       .sort(function(a, b){ return b.hr - a.hr; }).slice(0, 14);
  var td = $('s-dmTabla');
  if(td){
    td.innerHTML = dm.map(function(m){
      return '<tr>'
        + '<td class="id">' + esc(m.mod) + '</td>'
        + '<td>' + esc(m.fam) + '</td>'
        + '<td class="nn">' + m.nEq + '</td>'
        + '<td class="nn">' + fmt(Math.round(m.hr)) + '</td>'
        + '<td class="nn fuerte">' + pc(m.dm) + '</td>'
        + '<td><span class="barraPc"><i style="width:' + (m.dm * 100).toFixed(0) + '%"></i></span></td>'
        + '<td class="nn fuerte">' + pc(m.use) + '</td>'
        + '<td><span class="barraPc use"><i style="width:' + (m.use * 100).toFixed(0) + '%"></i></span></td>'
        + '</tr>';
    }).join('') || '<tr><td colspan="8" style="padding:26px;text-align:center">Sin datos.</td></tr>';
  }
  txt('s-nDm', SEP.nConDM + ' modelos con disponibilidad medida');
}

function construirSetiembre(){
  var el = $('s-filtros');
  if(!el || el.getAttribute('data-listo')) return;
  el.setAttribute('data-listo', '1');
  el.innerHTML =
      '<label class="fl">FLOTA<select id="sTipo">'
    + '<option value="TODOS">TODOS</option>'
    + '<option value="PROPIO">PROPIO</option>'
    + '<option value="ALQUILADO">ALQUILADO</option></select></label>'
    + '<label class="fl">ORDENAR POR<select id="sOrden">'
    + '<option value="desv">DESVIACIÓN DE TARIFA</option>'
    + '<option value="horas">HORAS DEL MES</option>'
    + '<option value="costo">COSTO DEL MES</option></select></label>';
  esc_('sTipo', 'change', function(){ sepTipo = this.value; pintarSetiembre(); });
  esc_('sOrden', 'change', function(){ sepOrden = this.value; pintarSetiembre(); });
}

function abrirSetiembre(){
  construirSetiembre();
  pintarSetiembre();
}

/* ---------- el bloque que se enseña en la hoja Equipo ---------- */
function pintarSepEquipo(e){
  var caja = $('q-sep');
  if(!caja) return;
  var m = sepDeModelo(e && e.mod);
  if(!m || (!m.dm && !m.tProy.tot)){
    caja.innerHTML = '<div class="sinDato">'
      + '<b>Sin información de tarifa proyectada, DM ni usaje para este equipo.</b>'
      + ' Esos tres datos sólo existen en el consolidado de <b>setiembre 2026</b>, que va por '
      + 'modelo y sólo cubre Shougang'
      + (e && e.mod ? '; el modelo <b>' + esc(e.mod) + '</b> no aparece ahí' : '')
      + '. Los diecisiete meses del libro mayor no los traen.</div>';
    return;
  }
  var d = m.tProy.tot ? m.tReal.tot - m.tProy.tot : null;
  caja.innerHTML =
      '<div class="sepCifras">'
    + '<div><div class="l">DISPONIBILIDAD MECÁNICA</div><div class="v">'
      + (m.dm ? pc(m.dm) : '—') + '</div></div>'
    + '<div><div class="l">USAJE</div><div class="v">' + (m.use ? pc(m.use) : '—') + '</div></div>'
    + '<div><div class="l">TARIFA REAL DEL MES</div><div class="v">'
      + (m.tReal.tot ? 'US$ ' + m.tReal.tot.toFixed(1) : '—') + '</div></div>'
    + '<div><div class="l">TARIFA PROYECTADA</div><div class="v">'
      + (m.tProy.tot ? 'US$ ' + m.tProy.tot.toFixed(1) : '—') + '</div></div>'
    + (d === null ? '' :
       '<div><div class="l">DESVIACIÓN</div><div class="v ' + (d <= 0 ? 'bien' : 'alza') + '">'
       + (d >= 0 ? '+' : '') + d.toFixed(1) + '</div></div>')
    + '</div>'
    + '<p class="nota" style="margin-top:12px">SETIEMBRE 2026 · CORTE AL 6 · POR MODELO '
    + esc(m.mod) + ' (' + m.nEq + ' equipos) · NO ES DEL LIBRO MAYOR</p>';
}
