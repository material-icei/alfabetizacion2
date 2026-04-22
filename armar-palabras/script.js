// =============================================
//  ARMÁ PALABRAS CON SÍLABAS — Juego
//  Lógica: selección de 1ª sílaba + 2ª sílaba + imagen
//  Cada columna se mezcla de forma independiente
// =============================================

var WORDS = [
  { a: 'ma', b: 'no', word: 'mano',  emoji: '✋', hint: 'mano' },
  { a: 'pa', b: 'to', word: 'pato',  emoji: '🦆', hint: 'pato' },
  { a: 'lu', b: 'na', word: 'luna',  emoji: '🌙', hint: 'luna' },
  { a: 'da', b: 'do', word: 'dado',  emoji: '🎲', hint: 'dado' },
  { a: 'ni', b: 'ño', word: 'niño',  emoji: '👦', hint: 'niño' },
  { a: 'fo', b: 'ca', word: 'foca',  emoji: '🦭', hint: 'foca' },
  { a: 'sa', b: 'po', word: 'sapo',  emoji: '🐸', hint: 'sapo' },
  { a: 'so', b: 'pa', word: 'sopa',  emoji: '🍲', hint: 'sopa' },
  { a: 'pe', b: 'ra', word: 'pera',  emoji: '🍐', hint: 'pera' },
];

// Estado del juego
var selectedA   = null;   // índice de palabra para sílaba A seleccionada
var selectedB   = null;   // índice de palabra para sílaba B seleccionada
var selectedImg = null;   // índice de palabra para imagen seleccionada
var solved      = [];     // índices de palabras ya resueltas
var score       = 0;

// Órdenes de presentación por columna (mezclados independientemente)
var orderA   = [];
var orderB   = [];
var orderImg = [];

// ---- INICIALIZAR ----
function init() {
  selectedA   = null;
  selectedB   = null;
  selectedImg = null;
  solved      = [];
  score       = 0;

  var indices = WORDS.map(function(_, i) { return i; });
  orderA   = shuffle(indices.slice());
  orderB   = shuffle(indices.slice());
  orderImg = shuffle(indices.slice());

  buildColumns();
  updateScore();
}

function buildColumns() {
  var colA      = document.getElementById('col-a');
  var colB      = document.getElementById('col-b');
  var colCenter = document.getElementById('word-slots');
  var colImages = document.getElementById('col-images');

  clearExcept(colA,      '.col-header');
  clearExcept(colB,      '.col-header');
  clearExcept(colCenter, null);
  clearExcept(colImages, '.col-header');

  // Columna A — orden independiente
  orderA.forEach(function(i) {
    var btn = makeBtn(WORDS[i].a, 'a', i);
    colA.appendChild(btn);
  });

  // Columna B — orden independiente
  orderB.forEach(function(i) {
    var btn = makeBtn(WORDS[i].b, 'b', i);
    colB.appendChild(btn);
  });

  // Columna Palabra — orden fijo (se muestra al acertar)
  WORDS.forEach(function(w, i) {
    var slot = document.createElement('div');
    slot.className = 'word-slot';
    slot.id = 'slot-' + i;
    slot.innerHTML = '<span class="word-text hidden"></span><span class="check-icon">✓</span>';
    colCenter.appendChild(slot);
  });

  // Columna Imagen — orden independiente
  orderImg.forEach(function(i) {
    var w = WORDS[i];
    var imgSlot = document.createElement('div');
    imgSlot.className = 'img-slot';
    imgSlot.id = 'img-' + i;
    imgSlot.setAttribute('data-word', w.word);
    imgSlot.innerHTML = w.emoji + '<span class="img-tooltip">' + w.hint + '</span>';
    imgSlot.addEventListener('click', function() { onImageClick(i); });
    colImages.appendChild(imgSlot);
  });
}

function makeBtn(sil, col, idx) {
  var btn = document.createElement('button');
  btn.className   = 'silaba-btn';
  btn.id          = 'sil-' + col + '-' + idx;
  btn.textContent = sil;
  btn.setAttribute('data-col', col);
  btn.setAttribute('data-idx', idx);
  btn.addEventListener('click', function() { onSilabaClick(col, idx); });
  return btn;
}

function clearExcept(parent, keepSelector) {
  Array.from(parent.children).forEach(function(child) {
    if (!keepSelector || !child.matches(keepSelector)) {
      parent.removeChild(child);
    }
  });
}

// ---- CLICKS ----
function onSilabaClick(col, idx) {
  if (solved.indexOf(idx) !== -1) return;

  if (col === 'a') {
    if (selectedA !== null) {
      var prev = document.getElementById('sil-a-' + selectedA);
      if (prev) prev.classList.remove('selected');
    }
    selectedA = (selectedA === idx) ? null : idx;
    var btnA = document.getElementById('sil-a-' + idx);
    if (btnA) btnA.classList.toggle('selected', selectedA === idx);

  } else {
    if (selectedB !== null) {
      var prevB = document.getElementById('sil-b-' + selectedB);
      if (prevB) prevB.classList.remove('selected');
    }
    selectedB = (selectedB === idx) ? null : idx;
    var btnB = document.getElementById('sil-b-' + idx);
    if (btnB) btnB.classList.toggle('selected', selectedB === idx);
  }

  tryCheck();
}

function onImageClick(idx) {
  if (solved.indexOf(idx) !== -1) return;

  if (selectedImg !== null) {
    var prev = document.getElementById('img-' + selectedImg);
    if (prev) prev.classList.remove('selected');
  }
  selectedImg = (selectedImg === idx) ? null : idx;
  var imgEl = document.getElementById('img-' + idx);
  if (imgEl) imgEl.classList.toggle('selected', selectedImg === idx);

  tryCheck();
}

// ---- VERIFICAR ----
function tryCheck() {
  if (selectedA === null || selectedB === null || selectedImg === null) return;

  // Los tres deben apuntar al mismo índice de palabra
  if (selectedA === selectedB && selectedB === selectedImg) {
    markSolved(selectedA);
  } else {
    // Sacudida en los slots de las sílabas incorrectas
    shakeWrong();
    setTimeout(clearSelections, 500);
  }
}

function shakeWrong() {
  // Marcar visualmente los botones con error
  var btnA = selectedA !== null ? document.getElementById('sil-a-' + selectedA) : null;
  var btnB = selectedB !== null ? document.getElementById('sil-b-' + selectedB) : null;
  var imgEl = selectedImg !== null ? document.getElementById('img-' + selectedImg) : null;

  [btnA, btnB, imgEl].forEach(function(el) {
    if (!el) return;
    el.classList.add('wrong');
    setTimeout(function() { el.classList.remove('wrong'); }, 450);
  });
}

function markSolved(idx) {
  solved.push(idx);
  score++;

  var w    = WORDS[idx];
  var btnA = document.getElementById('sil-a-' + idx);
  var btnB = document.getElementById('sil-b-' + idx);
  var imgEl = document.getElementById('img-' + idx);
  var slot = document.getElementById('slot-' + idx);

  // Ocultar sílabas e imagen con animación
  [btnA, btnB, imgEl].forEach(function(el) {
    if (!el) return;
    el.classList.add('fade-out');
    setTimeout(function() {
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
    }, 350);
  });

  // Mostrar palabra en columna central
  if (slot) {
    var textEl = slot.querySelector('.word-text');
    if (textEl) {
      textEl.textContent = w.a + w.b;
      textEl.classList.remove('hidden');
    }
    slot.classList.add('correct-word');
  }

  selectedA   = null;
  selectedB   = null;
  selectedImg = null;

  updateScore();

  if (score === WORDS.length) {
    setTimeout(function() {
      document.getElementById('celebration').classList.remove('hidden');
    }, 600);
  }
}

function clearSelections() {
  if (selectedA !== null) {
    var bA = document.getElementById('sil-a-' + selectedA);
    if (bA) bA.classList.remove('selected');
  }
  if (selectedB !== null) {
    var bB = document.getElementById('sil-b-' + selectedB);
    if (bB) bB.classList.remove('selected');
  }
  if (selectedImg !== null) {
    var iEl = document.getElementById('img-' + selectedImg);
    if (iEl) iEl.classList.remove('selected');
  }
  selectedA   = null;
  selectedB   = null;
  selectedImg = null;
}

// ---- SCORE ----
function updateScore() {
  document.getElementById('score-text').textContent = score + ' / ' + WORDS.length + ' palabras';
}

// ---- RESET ----
function resetAll() {
  document.getElementById('celebration').classList.add('hidden');
  init();
}

// ---- HELPERS ----
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// ---- ARRANCAR ----
init();
