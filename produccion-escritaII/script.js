// =============================================
//  INVENTÁ TU CUENTO — Script interactivo
// =============================================

var selected = { personaje: null, lugar: null, objeto: null };

// ---- SELECCIÓN DE ELEMENTOS ----
document.querySelectorAll('.elem-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var group = btn.getAttribute('data-group');
    var value = btn.getAttribute('data-value');
    var emoji = btn.getAttribute('data-emoji');

    // Deseleccionar anteriores del mismo grupo
    document.querySelectorAll('#sel-' + group + ' .elem-btn').forEach(function(b) {
      b.classList.remove('selected');
    });

    // Seleccionar éste
    btn.classList.add('selected');
    selected[group] = { value: value, emoji: emoji };

    // Actualizar display debajo de cada columna
    updateDisplay(group, value, emoji);

    // Actualizar resumen general
    updateSummary();

    // Actualizar chip dinámico del inicio
    updateDynamicChip();

    // Animación en el ícono de inicio si es personaje
    if (group === 'personaje') {
      var iconInicio = document.getElementById('icon-inicio');
      if (iconInicio) {
        iconInicio.textContent = emoji;
        iconInicio.closest('.part-visual').classList.add('has-selection');
      }
    }

    // Feedback visual en el botón
    btn.style.transform = 'scale(0.93)';
    setTimeout(function() { btn.style.transform = ''; }, 140);
  });
});

function updateDisplay(group, value, emoji) {
  var disp = document.getElementById('disp-' + group);
  if (!disp) return;
  disp.innerHTML = '<span class="disp-chosen"><span>' + emoji + '</span><span>' + value + '</span></span>';
  disp.style.borderColor = getGroupColor(group);
}

function getGroupColor(group) {
  var map = { personaje: '#9c27b0', lugar: '#00897b', objeto: '#e91e63' };
  return map[group] || '#ccc';
}

function updateSummary() {
  var inner = document.getElementById('summary-inner');
  if (!inner) return;
  var p = selected.personaje;
  var l = selected.lugar;
  var o = selected.objeto;

  if (!p && !l && !o) {
    inner.innerHTML = '<span class="summary-placeholder">Elegí un personaje, un lugar y un objeto para empezar 👆</span>';
    return;
  }

  var html = '';
  if (p) html += '<span class="summary-pill sp-personaje">' + p.emoji + ' ' + p.value + '</span>';
  if (p && (l || o)) html += '<span class="summary-plus">+</span>';
  if (l) html += '<span class="summary-pill sp-lugar">' + l.emoji + ' ' + l.value + '</span>';
  if (l && o) html += '<span class="summary-plus">+</span>';
  if (o) html += '<span class="summary-pill sp-objeto">' + o.emoji + ' ' + o.value + '</span>';

  inner.innerHTML = html;
}

function updateDynamicChip() {
  var chip = document.getElementById('chip-auto-inicio');
  if (!chip) return;
  var p = selected.personaje;
  var l = selected.lugar;
  var o = selected.objeto;

  if (p && l && o) {
    var text = 'Había una vez ' + p.value + ' que vivía en ' + l.value + '. Un día encontró ' + o.value + ' y su vida cambió para siempre.';
    chip.setAttribute('data-text', text);
    chip.classList.add('ready');
    chip.removeAttribute('disabled');
  } else {
    chip.setAttribute('data-text', '');
    chip.classList.remove('ready');
  }
}

// ---- CHIPS: insertar sugerencia ----
document.querySelectorAll('.chip').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (btn.classList.contains('chip-dynamic') && !btn.classList.contains('ready')) return;

    var targetId = btn.getAttribute('data-target');
    var text     = btn.getAttribute('data-text');
    if (!text) return;

    var ta    = document.getElementById(targetId);
    if (!ta) return;

    var start   = ta.selectionStart;
    var end     = ta.selectionEnd;
    var current = ta.value;

    if (current.trim() === '') {
      ta.value = text;
    } else {
      ta.value = current.slice(0, start) + text + current.slice(end);
    }

    var newPos = start + text.length;
    ta.setSelectionRange(newPos, newPos);
    ta.focus();
    updateWordCount(ta);

    btn.style.transform = 'scale(0.88)';
    setTimeout(function() { btn.style.transform = ''; }, 150);
  });
});

// ---- CONTADOR DE PALABRAS ----
function countWords(str) {
  var trimmed = str.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}

function updateWordCount(ta) {
  var map = { 'ta-inicio': 'wc-inicio', 'ta-conflicto': 'wc-conflicto', 'ta-desenlace': 'wc-desenlace' };
  var spanId = map[ta.id];
  if (spanId) document.getElementById(spanId).textContent = countWords(ta.value);
}

['ta-inicio', 'ta-conflicto', 'ta-desenlace'].forEach(function(id) {
  var ta = document.getElementById(id);
  if (ta) ta.addEventListener('input', function() { updateWordCount(ta); });
});

// ---- VER MI CUENTO (modal) ----
function showPreview() {
  var inicio    = document.getElementById('ta-inicio').value.trim();
  var conflicto = document.getElementById('ta-conflicto').value.trim();
  var desenlace = document.getElementById('ta-desenlace').value.trim();
  var empty     = !inicio && !conflicto && !desenlace;

  document.getElementById('mp-inicio-text').textContent    = inicio    || '(sin texto)';
  document.getElementById('mp-conflicto-text').textContent = conflicto || '(sin texto)';
  document.getElementById('mp-desenlace-text').textContent = desenlace || '(sin texto)';

  // Mostrar elementos elegidos en modal
  var elDiv = document.getElementById('modal-elementos');
  elDiv.innerHTML = '';
  var p = selected.personaje, l = selected.lugar, o = selected.objeto;
  if (p) elDiv.innerHTML += '<span class="summary-pill sp-personaje">' + p.emoji + ' ' + p.value + '</span>';
  if (l) elDiv.innerHTML += '<span class="summary-pill sp-lugar">' + l.emoji + ' ' + l.value + '</span>';
  if (o) elDiv.innerHTML += '<span class="summary-pill sp-objeto">' + o.emoji + ' ' + o.value + '</span>';

  document.getElementById('modal-empty').classList.toggle('hidden', !empty);
  document.querySelector('.modal-content').style.display = empty ? 'none' : '';

  var allFilled = inicio && conflicto && desenlace;
  document.getElementById('congrats').classList.toggle('hidden', !allFilled);

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal(event) {
  if (!event || event.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}

document.querySelector('.modal-close').addEventListener('click', function() {
  document.getElementById('modal-overlay').classList.add('hidden');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('modal-overlay').classList.add('hidden');
});

// ---- BORRAR TODO ----
function clearAll() {
  var confirmed = confirm('¿Seguro que querés borrar todo el cuento? Esta acción no se puede deshacer.');
  if (!confirmed) return;
  ['ta-inicio', 'ta-conflicto', 'ta-desenlace'].forEach(function(id) {
    var ta = document.getElementById(id);
    if (ta) { ta.value = ''; updateWordCount(ta); }
  });
}

// ---- ENVIAR A GOOGLE SHEETS ----
function enviarCuento() {
  var nombre    = document.getElementById('nombre').value.trim();
  var curso     = document.getElementById('curso').value.trim();
  var titulo    = document.getElementById('titulo').value.trim();
  var inicio    = document.getElementById('ta-inicio').value.trim();
  var conflicto = document.getElementById('ta-conflicto').value.trim();
  var desenlace = document.getElementById('ta-desenlace').value.trim();

  if (!nombre || !curso || !titulo || !inicio || !conflicto || !desenlace) {
    alert('¡Completá todos los campos antes de enviar! 📝');
    return;
  }

  var data = {
    fecha:      new Date().toLocaleString('es-AR'),
    nombre:     nombre,
    curso:      curso,
    titulo:     titulo,
    personaje:  selected.personaje ? selected.personaje.value : '—',
    lugar:      selected.lugar     ? selected.lugar.value     : '—',
    objeto:     selected.objeto    ? selected.objeto.value    : '—',
    inicio:     inicio,
    conflicto:  conflicto,
    desenlace:  desenlace
  };

  // ⚠️ Reemplazá esta URL por la de tu Google Apps Script:
  var url = "https://script.google.com/macros/s/AKfycbxFmWs5eM228jRKaTr2_JVz5tH1oRAP24OMG1XdnwG-yp1P0FazeiNNamgbkRiTOP-0/exec";

  fetch(url, {
    method:  "POST",
    mode:    "no-cors",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data)
  })
  .then(function() {
    alert('¡Cuento enviado! 🎉 ¡Muy buen trabajo, ' + nombre + '!');
    clearAll();
    document.getElementById('nombre').value  = '';
    document.getElementById('curso').value   = '';
    document.getElementById('titulo').value  = '';
  })
  .catch(function(error) {
    alert('Error al enviar 😢 Intentá de nuevo.');
    console.error(error);
  });
}
