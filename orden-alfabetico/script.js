// =============================================
//  ORDENAR ALFABÉTICAMENTE — drag & drop
// =============================================

var WORDS = [
  'casa','sol','perro','elefante','zapatos',
  'vaca','abeja','oso','dulces','ratón',
  'mariposa','gorila'
];

function normalize(s) {
  return s.toLowerCase()
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i')
    .replace(/ó/g,'o').replace(/ú/g,'u').replace(/ü/g,'u');
}

var SORTED = WORDS.slice().sort(function(a,b){
  return normalize(a).localeCompare(normalize(b));
});

// Estado central: slot i → palabra o null
var slots = [];   // slots[i] = word | null
var dragWord     = null;
var dragFromSlot = null; // número de slot o 'bank'

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
function init() {
  slots        = new Array(WORDS.length).fill(null);
  dragWord     = null;
  dragFromSlot = null;

  buildSlots();
  buildBank();
  render();
  document.getElementById('hint-text').textContent = '';
  document.getElementById('celebration').classList.add('hidden');
}

// ─────────────────────────────────────────────
//  CONSTRUIR DOM (una sola vez)
// ─────────────────────────────────────────────
function buildSlots() {
  var container = document.getElementById('number-slots');
  container.innerHTML = '';

  for (var i = 0; i < WORDS.length; i++) {
    (function(idx) {
      var row  = document.createElement('div');
      row.className = 'slot-row';
      row.id = 'row-' + idx;

      var num  = document.createElement('span');
      num.className   = 'slot-num';
      num.textContent = (idx + 1) + '.';

      var slot = document.createElement('div');
      slot.className = 'drop-slot';
      slot.id        = 'slot-' + idx;

      // ── Mouse drop ──
      slot.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slot.classList.add('drag-over');
      });
      slot.addEventListener('dragleave', function() {
        slot.classList.remove('drag-over');
      });
      slot.addEventListener('drop', function(e) {
        e.preventDefault();
        slot.classList.remove('drag-over');
        dropOnSlot(idx);
      });

      row.appendChild(num);
      row.appendChild(slot);
      container.appendChild(row);
    })(i);
  }
}

function buildBank() {
  var bank = document.getElementById('word-list');
  bank.innerHTML = '';

  // drop sobre el banco (devuelve palabra)
  bank.addEventListener('dragover', function(e) { e.preventDefault(); });
  bank.addEventListener('drop',     function(e) { e.preventDefault(); dropOnBank(); });
}

// ─────────────────────────────────────────────
//  RENDER — actualiza el DOM según `slots[]`
// ─────────────────────────────────────────────
function render() {
  // Palabras que ya están en algún slot
  var placed = {};
  for (var i = 0; i < slots.length; i++) {
    if (slots[i]) placed[slots[i]] = i;
  }

  // ── Renderizar cada slot ──
  for (var i = 0; i < WORDS.length; i++) {
    (function(idx) {
      var slot = document.getElementById('slot-' + idx);
      if (!slot) return;

      slot.innerHTML = '';
      slot.classList.remove('occupied', 'drag-over');

      var word = slots[idx];
      if (word) {
        slot.classList.add('occupied');
        var chip = makeChipEl(word, idx); // chip dentro del slot
        slot.appendChild(chip);
      }
    })(i);
  }

  // ── Renderizar banco ──
  var bank = document.getElementById('word-list');
  // conservar solo el listener, limpiar chips anteriores
  Array.from(bank.querySelectorAll('.word-chip')).forEach(function(c){ bank.removeChild(c); });

  var bankWords = WORDS.filter(function(w){ return !(w in placed); });
  // mezclar solo si no hay orden previo (usar orden aleatorio guardado)
  bankWords.forEach(function(word) {
    var chip = makeChipEl(word, 'bank');
    bank.appendChild(chip);
  });

  updateProgress();
}

// ─────────────────────────────────────────────
//  CREAR CHIP (draggable)
// ─────────────────────────────────────────────
function makeChipEl(word, source) {
  // source = 'bank' | slotIndex(number)
  var chip = document.createElement('div');
  chip.className    = 'word-chip';
  chip.textContent  = word;
  chip.draggable    = true;

  // ── Mouse ──
  chip.addEventListener('dragstart', function(e) {
    dragWord     = word;
    dragFromSlot = source;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word); // Firefox requiere esto
    setTimeout(function(){ chip.classList.add('dragging'); }, 0);
  });
  chip.addEventListener('dragend', function() {
    chip.classList.remove('dragging');
    document.querySelectorAll('.drop-slot').forEach(function(s){
      s.classList.remove('drag-over');
    });
    dragWord     = null;
    dragFromSlot = null;
  });

  // ── Touch ──
  var touchClone = null;

  chip.addEventListener('touchstart', function(e) {
    dragWord     = word;
    dragFromSlot = source;

    var t = e.touches[0];
    var rect = chip.getBoundingClientRect();

    // Crear clon flotante
    touchClone = chip.cloneNode(true);
    touchClone.style.cssText =
      'position:fixed;z-index:9999;pointer-events:none;opacity:0.85;' +
      'width:' + rect.width + 'px;left:' + (t.clientX - rect.width/2) + 'px;' +
      'top:' + (t.clientY - rect.height/2) + 'px;';
    document.body.appendChild(touchClone);
  }, {passive:true});

  chip.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var t = e.touches[0];
    if (touchClone) {
      touchClone.style.left = (t.clientX - touchClone.offsetWidth/2)  + 'px';
      touchClone.style.top  = (t.clientY - touchClone.offsetHeight/2) + 'px';
    }
    // Resaltar slot bajo el dedo
    document.querySelectorAll('.drop-slot').forEach(function(s){ s.classList.remove('drag-over'); });
    var el = document.elementFromPoint(t.clientX, t.clientY);
    if (el) {
      var slotEl = el.closest ? el.closest('.drop-slot') : null;
      if (slotEl) slotEl.classList.add('drag-over');
    }
  }, {passive:false});

  chip.addEventListener('touchend', function(e) {
    if (touchClone) { document.body.removeChild(touchClone); touchClone = null; }
    document.querySelectorAll('.drop-slot').forEach(function(s){ s.classList.remove('drag-over'); });

    var t  = e.changedTouches[0];
    var el = document.elementFromPoint(t.clientX, t.clientY);
    var target = el ? (el.closest ? el.closest('.drop-slot') : null) : null;

    if (target) {
      dropOnSlot(+target.id.replace('slot-', ''));
    } else {
      // cayó fuera de un slot → devolver al banco
      if (typeof dragFromSlot === 'number') {
        slots[dragFromSlot] = null;
        render();
        clearFeedback();
      }
    }
    dragWord     = null;
    dragFromSlot = null;
  }, {passive:true});

  return chip;
}

// ─────────────────────────────────────────────
//  LÓGICA DE DROP
// ─────────────────────────────────────────────
function dropOnSlot(targetIdx) {
  if (dragWord === null) return;

  var displaced = slots[targetIdx]; // palabra que había en ese slot (puede ser null)

  // Liberar slot origen si venía de un slot
  if (typeof dragFromSlot === 'number') {
    slots[dragFromSlot] = null;
  }

  // Colocar la palabra arrastrada
  slots[targetIdx] = dragWord;

  // Si había otra palabra, va al banco (slots[] la deja en null → render la muestra en banco)
  // (ya la liberamos implícitamente al no asignarla a ningún slot)

  // Si la palabra desplazada venía del banco también, nada extra que hacer.
  // Si la palabra desplazada estaba en otro slot (intercambio), ponerla en el origen
  if (displaced && displaced !== dragWord) {
    if (typeof dragFromSlot === 'number') {
      // intercambio de slots
      slots[dragFromSlot] = displaced;
    }
    // si vino del banco, displaced simplemente vuelve al banco (queda sin slot)
  }

  clearFeedback();
  render();
  autoCheck();
}

function dropOnBank() {
  if (dragWord === null) return;
  if (typeof dragFromSlot === 'number') {
    slots[dragFromSlot] = null;
    clearFeedback();
    render();
    updateProgress();
  }
  dragWord     = null;
  dragFromSlot = null;
}

// ─────────────────────────────────────────────
//  VERIFICACIÓN
// ─────────────────────────────────────────────
function autoCheck() {
  var allPlaced = slots.every(function(s){ return s !== null; });
  if (allPlaced) checkAll();
}

function checkAll() {
  var allPlaced = slots.every(function(s){ return s !== null; });
  if (!allPlaced) {
    showHint('⚠️ Colocá todas las palabras antes de verificar.', '#c0392b');
    return;
  }

  var correct = 0;
  for (var i = 0; i < WORDS.length; i++) {
    var slotEl = document.getElementById('slot-' + i);
    var rowEl  = document.getElementById('row-'  + i);
    slotEl.classList.remove('correct','wrong');
    if (rowEl) rowEl.classList.remove('correct','wrong');

    if (slots[i] === SORTED[i]) {
      slotEl.classList.add('correct');
      if (rowEl) rowEl.classList.add('correct');
      correct++;
    } else {
      slotEl.classList.add('wrong');
      if (rowEl) rowEl.classList.add('wrong');
    }
  }

  if (correct === WORDS.length) {
    document.getElementById('hint-text').textContent = '';
    setTimeout(function(){ document.getElementById('celebration').classList.remove('hidden'); }, 500);
  } else {
    showHint('✨ ' + correct + ' de ' + WORDS.length + ' correctas. Seguí intentando.', '#e67e22');
  }
}

function clearFeedback() {
  document.querySelectorAll('.drop-slot').forEach(function(s){ s.classList.remove('correct','wrong'); });
  document.querySelectorAll('.slot-row').forEach(function(r){ r.classList.remove('correct','wrong'); });
  document.getElementById('hint-text').textContent = '';
}

function showHint(msg, color) {
  var el = document.getElementById('hint-text');
  el.textContent   = msg;
  el.style.color   = color;
}

// ─────────────────────────────────────────────
//  PROGRESO
// ─────────────────────────────────────────────
function updateProgress() {
  var placed = slots.filter(function(s){ return s !== null; }).length;
  document.getElementById('progress-fill').style.width  = (placed/WORDS.length*100) + '%';
  document.getElementById('progress-label').textContent = placed + ' / ' + WORDS.length;
}

// ─────────────────────────────────────────────
//  RESET
// ─────────────────────────────────────────────
function resetAll() {
  document.getElementById('celebration').classList.add('hidden');
  init();
}

init();
