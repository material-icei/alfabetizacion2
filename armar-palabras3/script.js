// =============================================
//  ARMÁ PALABRAS DE 3 SÍLABAS — 20 palabras
// =============================================

var WORDS = [
  { a: 'pa',  b: 'lo',  c: 'ma',  word: 'paloma',   emoji: '🕊️',  hint: 'paloma'   },
  { a: 'za',  b: 'pa',  c: 'to',  word: 'zapato',   emoji: '👟',  hint: 'zapato'   },
  { a: 'pai',  b: 'sa',  c: 'je',  word: 'paisaje',   emoji: '🏜️',  hint: 'paisaje'   },
  { a: 'to',  b: 'ma',  c: 'te',  word: 'tomate',   emoji: '🍅',  hint: 'tomate'   },
  { a: 're',  b: 'ga',  c: 'lo',  word: 'regalo',   emoji: '🎁',  hint: 'regalo'   },
  { a: 'pe',  b: 'pi',  c: 'no',  word: 'pepino',   emoji: '🥒',  hint: 'pepino'   },
  { a: 'co',  b: 'ro',  c: 'na',  word: 'corona',   emoji: '👑',  hint: 'corona'   },
  { a: 'bo',  b: 'te',  c: 'lla', word: 'botella',  emoji: '🍾',  hint: 'botella'  },
  { a: 'mar',  b: 'cia',  c: 'no',  word: 'marciano',   emoji: '👽',  hint: 'marciano'   },
  { a: 'ca',  b: 'ba',  c: 'llo', word: 'caballo',  emoji: '🐴',  hint: 'caballo'  },
  { a: 'ga',  b: 'lle',  c: 'ta',  word: 'galleta',   emoji: '🍪',  hint: 'galleta'   },
  { a: 'ba',  b: 'na',  c: 'na',  word: 'banana',   emoji: '🍌',  hint: 'banana'   },
  { a: 'cá',  b: 'ma',  c: 'ra',  word: 'cámara',   emoji: '📷',  hint: 'cámara'   },
  { a: 'sa',  b: 'xo',  c: 'fón',  word: 'saxofón',   emoji: '🎷',  hint: 'saxofón'   },
  { a: 'mu',  b: 'ñe',  c: 'ca',  word: 'muñeca',   emoji: '🪆',  hint: 'muñeca'   },
  { a: 'pi',  b: 'za',  c: 'rra', word: 'pizarra',  emoji: '📋',  hint: 'pizarra'  },
  { a: 'sa',  b: 'li',  c: 'da',  word: 'salida',   emoji: '🚪',  hint: 'salida'   },
  { a: 'fo',  b: 'ga',  c: 'ta',  word: 'fogata',   emoji: '🔥',  hint: 'fogata'    },
  { a: 'a',  b: 'plau',  c: 'so',  word: 'aplauso',   emoji: '👏',  hint: 'aplauso'   },
];

var selectedA   = null;
var selectedB   = null;
var selectedC   = null;
var selectedImg = null;
var solved      = [];
var score       = 0;

var orderA = [], orderB = [], orderC = [], orderImg = [];

function init() {
  selectedA = selectedB = selectedC = selectedImg = null;
  solved = [];
  score  = 0;

  var indices = WORDS.map(function(_, i) { return i; });
  orderA   = shuffle(indices.slice());
  orderB   = shuffle(indices.slice());
  orderC   = shuffle(indices.slice());
  orderImg = shuffle(indices.slice());

  buildColumns();
  updateScore();
}

function buildColumns() {
  var colA   = document.getElementById('col-a');
  var colB   = document.getElementById('col-b');
  var colC   = document.getElementById('col-c');
  var colImg = document.getElementById('col-images');

  clearExcept(colA,   '.col-header');
  clearExcept(colB,   '.col-header');
  clearExcept(colC,   '.col-header');
  clearExcept(colImg, '.col-header');

  orderA.forEach(function(i) { colA.appendChild(makeBtn(WORDS[i].a, 'a', i)); });
  orderB.forEach(function(i) { colB.appendChild(makeBtn(WORDS[i].b, 'b', i)); });
  orderC.forEach(function(i) { colC.appendChild(makeBtn(WORDS[i].c, 'c', i)); });

  orderImg.forEach(function(i) {
    var w    = WORDS[i];
    var slot = document.createElement('div');
    slot.className = 'img-slot';
    slot.id        = 'img-' + i;
    slot.innerHTML =
      '<span class="slot-emoji">' + w.emoji + '</span>' +
      '<span class="slot-word hidden">' + w.word + '</span>' +
      '<span class="img-tooltip">' + w.hint + '</span>';
    slot.addEventListener('click', function() { onImgClick(i); });
    colImg.appendChild(slot);
  });
}

function makeBtn(sil, col, idx) {
  var btn = document.createElement('button');
  btn.className   = 'silaba-btn';
  btn.id          = 'sil-' + col + '-' + idx;
  btn.textContent = sil;
  btn.addEventListener('click', function() { onSilabaClick(col, idx); });
  return btn;
}

function clearExcept(parent, keepSelector) {
  Array.from(parent.children).forEach(function(child) {
    if (!keepSelector || !child.matches(keepSelector)) parent.removeChild(child);
  });
}

function onSilabaClick(col, idx) {
  if (solved.indexOf(idx) !== -1) return;

  var prev = col === 'a' ? selectedA : col === 'b' ? selectedB : selectedC;

  if (prev !== null) {
    var prevEl = document.getElementById('sil-' + col + '-' + prev);
    if (prevEl) prevEl.classList.remove('selected');
  }

  var newVal = (prev === idx) ? null : idx;
  if      (col === 'a') selectedA = newVal;
  else if (col === 'b') selectedB = newVal;
  else                  selectedC = newVal;

  var btn = document.getElementById('sil-' + col + '-' + idx);
  if (btn) btn.classList.toggle('selected', newVal === idx);

  tryCheck();
}

function onImgClick(idx) {
  if (solved.indexOf(idx) !== -1) return;

  if (selectedImg !== null) {
    var prev = document.getElementById('img-' + selectedImg);
    if (prev) prev.classList.remove('selected');
  }
  selectedImg = (selectedImg === idx) ? null : idx;
  var el = document.getElementById('img-' + idx);
  if (el) el.classList.toggle('selected', selectedImg === idx);

  tryCheck();
}

function tryCheck() {
  if (selectedA === null || selectedB === null || selectedC === null || selectedImg === null) return;

  if (selectedA === selectedB && selectedB === selectedC && selectedC === selectedImg) {
    markSolved(selectedA);
  } else {
    shakeWrong();
    setTimeout(clearSelections, 500);
  }
}

function shakeWrong() {
  [
    document.getElementById('sil-a-' + selectedA),
    document.getElementById('sil-b-' + selectedB),
    document.getElementById('sil-c-' + selectedC),
    document.getElementById('img-'   + selectedImg),
  ].forEach(function(el) {
    if (!el) return;
    el.classList.add('wrong');
    setTimeout(function() { el.classList.remove('wrong'); }, 450);
  });
}

function markSolved(idx) {
  solved.push(idx);
  score++;

  [
    document.getElementById('sil-a-' + idx),
    document.getElementById('sil-b-' + idx),
    document.getElementById('sil-c-' + idx),
  ].forEach(function(el) {
    if (!el) return;
    el.classList.add('fade-out');
    setTimeout(function() {
      el.style.visibility    = 'hidden';
      el.style.pointerEvents = 'none';
    }, 350);
  });

  var imgEl = document.getElementById('img-' + idx);
  if (imgEl) {
    imgEl.classList.remove('selected');
    imgEl.classList.add('solved');
    var emojiEl = imgEl.querySelector('.slot-emoji');
    var wordEl  = imgEl.querySelector('.slot-word');
    if (emojiEl) emojiEl.classList.add('hidden');
    if (wordEl)  wordEl.classList.remove('hidden');
  }

  selectedA = selectedB = selectedC = selectedImg = null;
  updateScore();

  if (score === WORDS.length) {
    setTimeout(function() {
      document.getElementById('celebration').classList.remove('hidden');
    }, 600);
  }
}

function clearSelections() {
  ['a','b','c'].forEach(function(col) {
    var idx = col === 'a' ? selectedA : col === 'b' ? selectedB : selectedC;
    if (idx !== null) {
      var el = document.getElementById('sil-' + col + '-' + idx);
      if (el) el.classList.remove('selected');
    }
  });
  if (selectedImg !== null) {
    var el = document.getElementById('img-' + selectedImg);
    if (el) el.classList.remove('selected');
  }
  selectedA = selectedB = selectedC = selectedImg = null;
}

function updateScore() {
  document.getElementById('score-text').textContent = score + ' / ' + WORDS.length + ' palabras';
}

function resetAll() {
  document.getElementById('celebration').classList.add('hidden');
  init();
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

init();
