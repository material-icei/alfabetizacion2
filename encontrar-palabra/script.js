// =============================================
//  LEO Y MARCO LAS PALABRAS — 2º grado
//  Solo emojis, sin URLs externas
// =============================================

var WORDS = [
  { word: 'pato',    emoji: '🦆' },
  { word: 'sapo',    emoji: '🐸' },
  { word: 'pera',    emoji: '🍐' },
  { word: 'luna',    emoji: '🌙' },
  { word: 'helicóptero',    emoji: '🚁' },
  { word: 'mano',    emoji: '✋' },
  { word: 'casa',    emoji: '🏠' },
  { word: 'caracol', emoji: '🐌' },
  { word: 'cubo',    emoji: '📦' },
  { word: 'dado',    emoji: '🎲' },
  { word: 'bicicleta',  emoji: '🚲' },
  { word: 'vaca',    emoji: '🐄' },
  { word: 'nueve',   emoji: '9️⃣' },
  { word: 'ave',     emoji: '🐦' },
  { word: 'violín',  emoji: '🎻' },
];

var COLORS = [
  '#e53935','#d81b60','#8e24aa','#3949ab','#1e88e5',
  '#00897b','#43a047','#fb8c00','#6d4c41','#546e7a',
  '#c0ca33','#039be5','#f4511e','#00acc1','#7cb342'
];

var selectedWord = null;
var selectedImg  = null;
var solved       = [];
var score        = 0;
var wordOrder    = [];
var imgOrder     = [];

function init() {
  selectedWord = null;
  selectedImg  = null;
  solved       = [];
  score        = 0;

  var indices = WORDS.map(function(_, i) { return i; });
  wordOrder = shuffle(indices.slice());
  imgOrder  = shuffle(indices.slice());

  buildImages();
  buildWords();
  updateScore();
}

function buildImages() {
  var grid = document.getElementById('images-grid');
  grid.innerHTML = '';

  imgOrder.forEach(function(i) {
    var card = document.createElement('div');
    card.className = 'img-card';
    card.id = 'img-' + i;
    card.innerHTML = '<span class="emoji">' + WORDS[i].emoji + '</span>';
    card.addEventListener('click', function() { onImgClick(i); });
    grid.appendChild(card);
  });
}

function buildWords() {
  var grid = document.getElementById('words-grid');
  grid.innerHTML = '';

  wordOrder.forEach(function(i) {
    var btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.id        = 'word-' + i;
    btn.innerHTML = '<span class="check-mark">&#9744;</span>' + WORDS[i].word;
    btn.addEventListener('click', function() { onWordClick(i); });
    grid.appendChild(btn);
  });
}

function onWordClick(idx) {
  if (solved.indexOf(idx) !== -1) return;

  if (selectedWord !== null) {
    var prev = document.getElementById('word-' + selectedWord);
    if (prev) prev.classList.remove('selected');
  }

  selectedWord = (selectedWord === idx) ? null : idx;
  var btn = document.getElementById('word-' + idx);
  if (btn) btn.classList.toggle('selected', selectedWord === idx);

  if (selectedWord !== null && selectedImg !== null) checkMatch();
}

function onImgClick(idx) {
  if (solved.indexOf(idx) !== -1) return;

  if (selectedImg !== null) {
    var prev = document.getElementById('img-' + selectedImg);
    if (prev) prev.classList.remove('selected');
  }

  selectedImg = (selectedImg === idx) ? null : idx;
  var card = document.getElementById('img-' + idx);
  if (card) card.classList.toggle('selected', selectedImg === idx);

  if (selectedWord !== null && selectedImg !== null) checkMatch();
}

function checkMatch() {
  var wi = selectedWord;
  var ii = selectedImg;

  if (wi === ii) {
    markSolved(wi);
  } else {
    var wBtn  = document.getElementById('word-' + wi);
    var iCard = document.getElementById('img-' + ii);
    [wBtn, iCard].forEach(function(el) {
      if (!el) return;
      el.classList.add('wrong');
      setTimeout(function() { el.classList.remove('wrong'); }, 500);
    });
    setTimeout(clearSelections, 500);
  }
}

function markSolved(idx) {
  solved.push(idx);
  score++;

  var color = COLORS[idx % COLORS.length];
  var wBtn  = document.getElementById('word-' + idx);
  var iCard = document.getElementById('img-' + idx);

  if (wBtn) {
    wBtn.classList.remove('selected');
    wBtn.classList.add('solved');
    wBtn.style.background  = color;
    wBtn.style.color       = '#fff';
    wBtn.style.borderColor = color;
    var chk = wBtn.querySelector('.check-mark');
    if (chk) chk.innerHTML = '&#9746;';
  }

  if (iCard) {
    iCard.classList.remove('selected');
    iCard.classList.add('solved');
    iCard.style.borderColor = color;
    iCard.style.boxShadow   = '0 0 0 4px ' + color + '55, 0 6px 20px ' + color + '44';
    iCard.style.background  = color + '18';

    var label = document.createElement('div');
    label.className    = 'img-label';
    label.textContent  = WORDS[idx].word;
    label.style.background = color;
    iCard.appendChild(label);
  }

  selectedWord = null;
  selectedImg  = null;
  updateScore();

  if (score === WORDS.length) {
    setTimeout(function() {
      document.getElementById('celebration').classList.remove('hidden');
    }, 600);
  }
}

function clearSelections() {
  if (selectedWord !== null) {
    var w = document.getElementById('word-' + selectedWord);
    if (w) w.classList.remove('selected');
  }
  if (selectedImg !== null) {
    var im = document.getElementById('img-' + selectedImg);
    if (im) im.classList.remove('selected');
  }
  selectedWord = null;
  selectedImg  = null;
}

function updateScore() {
  document.getElementById('score-text').textContent = score + ' / ' + WORDS.length + ' encontradas';
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
