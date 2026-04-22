// =============================================
//  ¿QUÉ RIMA CON...? — 2º grado primaria
//  9 pares de rimas con emojis
//  Flujo: elegir imagen correcta → escribir oración
// =============================================

// Cada par:
//  clue   = imagen/palabra dada (izquierda)
//  options= 3 opciones (1 correcta + 2 distractoras)
//  correct= índice de la opción correcta (0,1,2)
//  sentence_hint = estructura sugerida para la oración

var PAIRS = [
  {
    clue:    { emoji: '🏠', word: 'casa' },
    options: [
      { emoji: '🌸', word: 'rosa' },
      { emoji: '🥣', word: 'taza' },
      { emoji: '🌿', word: 'pasa' },
    ],
    correct: 1,   // taza rima con casa
    sentence_hint: 'En la ___ hay una ___.'
  },
  {
    clue:    { emoji: '🐭', word: 'ratón' },
    options: [
      { emoji: '🎈', word: 'globo' },
      { emoji: '🧦', word: 'calcetín' },
      { emoji: '🦁', word: 'león' },
    ],
    correct: 2,   // león rima con ratón
    sentence_hint: 'El ___ vio al ___ y rugió.'
  },
  {
    clue:    { emoji: '🌙', word: 'luna' },
    options: [
      { emoji: '🍀', word: 'trébol' },
      { emoji: '🐟', word: 'atún' },
      { emoji: '🌊', word: 'cuna' },
    ],
    correct: 2,   // cuna rima con luna
    sentence_hint: 'La ___ ilumina la ___.'
  },
  {
    clue:    { emoji: '🐸', word: 'sapo' },
    options: [
      { emoji: '🗺️', word: 'mapa' },
      { emoji: '🧤', word: 'guante' },
      { emoji: '🧥', word: 'trapo' },
    ],
    correct: 2,   // trapo rima con sapo
    sentence_hint: 'El ___ se limpió con un ___.'
  },
  {
    clue:    { emoji: '🦆', word: 'pato' },
    options: [
      { emoji: '🐱', word: 'gato' },
      { emoji: '🐘', word: 'elefante' },
      { emoji: '🍎', word: 'manzana' },
    ],
    correct: 0,   // gato rima con pato
    sentence_hint: 'El ___ y el ___ juegan juntos.'
  },
  {
    clue:    { emoji: '🌹', word: 'flor' },
    options: [
      { emoji: '🌿', word: 'hoja' },
      { emoji: '❤️', word: 'amor' },
      { emoji: '🍋', word: 'limón' },
    ],
    correct: 1,   // amor rima con flor
    sentence_hint: 'Con ___ le regaló una ___.'
  },
  {
    clue:    { emoji: '🎲', word: 'dado' },
    options: [
      { emoji: '🌱', word: 'planta' },
      { emoji: '🧊', word: 'hielo' },
      { emoji: '🪖', word: 'soldado' },
    ],
    correct: 2,   // soldado rima con dado
    sentence_hint: 'El ___ tiró el ___.'
  },
  {
    clue:    { emoji: '🐌', word: 'caracol' },
    options: [
      { emoji: '☀️', word: 'sol' },
      { emoji: '🌧️', word: 'lluvia' },
      { emoji: '🌲', word: 'árbol' },
    ],
    correct: 0,   // sol rima con caracol
    sentence_hint: 'El ___ sale con el ___.'
  },
  {
    clue:    { emoji: '🎻', word: 'violín' },
    options: [
      { emoji: '🥁', word: 'tambor' },
      { emoji: '🌹', word: 'jardín' },
      { emoji: '🎸', word: 'guitarra' },
    ],
    correct: 1,   // jardín rima con violín
    sentence_hint: 'Tocó el ___ en el ___.'
  },
];

// Estado
var completed  = new Array(PAIRS.length).fill(false);
var sentences  = new Array(PAIRS.length).fill('');
var currentPair = null;
var score      = 0;

// ---- INIT ----
function init() {
  completed   = new Array(PAIRS.length).fill(false);
  sentences   = new Array(PAIRS.length).fill('');
  score       = 0;
  currentPair = null;

  buildCards();
  updateProgress();
}

function buildCards() {
  var container = document.getElementById('cards-container');
  container.innerHTML = '';

  PAIRS.forEach(function(pair, pIdx) {
    // Barajar las opciones manteniendo referencia al correcto
    var shuffled = shuffleOptions(pair.options, pair.correct);

    var card = document.createElement('div');
    card.className = 'rhyme-card';
    card.id = 'card-' + pIdx;

    card.innerHTML =
      '<div class="card-inner">' +
        // IZQUIERDA: imagen dada
        '<div class="clue-side">' +
          '<div class="clue-tag">¿Qué rima con...?</div>' +
          '<div class="clue-emoji">' + pair.clue.emoji + '</div>' +
          '<div class="clue-word">' + pair.clue.word + '</div>' +
        '</div>' +

        // SEPARADOR
        '<div class="card-divider"><span>🎵</span></div>' +

        // DERECHA: opciones
        '<div class="options-side" id="opts-' + pIdx + '">' +
          shuffled.map(function(opt, oIdx) {
            return '<button class="opt-btn" id="opt-' + pIdx + '-' + oIdx + '" ' +
              'onclick="onOptionClick(' + pIdx + ',' + oIdx + ',' + opt.isCorrect + ')">' +
              '<span class="opt-emoji">' + opt.emoji + '</span>' +
              '<span class="opt-word">' + opt.word + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +

        // ORACIÓN (aparece después de completar)
        '<div class="sentence-display hidden" id="sentence-' + pIdx + '">' +
          '<span class="sentence-icon">✏️</span>' +
          '<span class="sentence-text" id="sentence-text-' + pIdx + '"></span>' +
        '</div>' +
      '</div>';

    // Guardar referencia al orden barajado
    card.dataset.shuffled = JSON.stringify(shuffled);
    container.appendChild(card);
  });
}

// Baraja opciones y marca cuál es correcta
function shuffleOptions(options, correctIdx) {
  var arr = options.map(function(opt, i) {
    return { emoji: opt.emoji, word: opt.word, isCorrect: (i === correctIdx) };
  });
  // Fisher-Yates
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// ---- CLICK EN OPCIÓN ----
function onOptionClick(pIdx, oIdx, isCorrect) {
  if (completed[pIdx]) return;

  var btn = document.getElementById('opt-' + pIdx + '-' + oIdx);

  if (isCorrect) {
    // Marcar correcta
    btn.classList.add('opt-correct');
    // Deshabilitar todas las opciones de esta tarjeta
    var allBtns = document.querySelectorAll('#opts-' + pIdx + ' .opt-btn');
    allBtns.forEach(function(b) { b.disabled = true; });

    // Guardar par activo y abrir modal de escritura
    var card = document.getElementById('card-' + pIdx);
    var shuffled = JSON.parse(card.dataset.shuffled);
    currentPair = { pIdx: pIdx, rhymeWord: shuffled[oIdx].word, clueWord: PAIRS[pIdx].clue.word };

    setTimeout(function() { openModal(pIdx, shuffled[oIdx]); }, 400);

  } else {
    // Error: shake + marcar roja brevemente
    btn.classList.add('opt-wrong');
    setTimeout(function() { btn.classList.remove('opt-wrong'); }, 500);
  }
}

// ---- MODAL ----
function openModal(pIdx, correctOpt) {
  var pair = PAIRS[pIdx];
  document.getElementById('modal-pair-emoji').textContent = pair.clue.emoji + ' — ' + correctOpt.emoji;
  document.getElementById('modal-title').textContent = '¡' + pair.clue.word + ' rima con ' + correctOpt.word + '! ✨';
  document.getElementById('modal-words').innerHTML =
    '<span class="modal-word clue-color">' + pair.clue.emoji + ' ' + pair.clue.word + '</span>' +
    '<span class="rhyme-connector">🎵</span>' +
    '<span class="modal-word rhyme-color">' + correctOpt.emoji + ' ' + correctOpt.word + '</span>';

  var input = document.getElementById('sentence-input');
  input.value = '';
  input.placeholder = pair.sentence_hint;

  document.getElementById('modal').classList.remove('hidden');
  setTimeout(function() { input.focus(); }, 100);
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function confirmSentence() {
  var input = document.getElementById('sentence-input');
  var text  = input.value.trim();

  if (text.length < 3) {
    input.classList.add('input-error');
    setTimeout(function() { input.classList.remove('input-error'); }, 500);
    input.placeholder = '¡Escribí al menos una oración corta!';
    return;
  }

  var pIdx = currentPair.pIdx;
  sentences[pIdx]  = text;
  completed[pIdx]  = true;
  score++;

  // Mostrar oración en la tarjeta
  var sentEl = document.getElementById('sentence-' + pIdx);
  var sentTxt = document.getElementById('sentence-text-' + pIdx);
  sentTxt.textContent = '"' + text + '"';
  sentEl.classList.remove('hidden');

  // Marcar tarjeta como completa
  var card = document.getElementById('card-' + pIdx);
  card.classList.add('card-done');

  closeModal();
  updateProgress();

  if (score === PAIRS.length) {
    setTimeout(showCelebration, 600);
  }
}

// ---- PROGRESO ----
function updateProgress() {
  var fill  = document.getElementById('progress-fill');
  var label = document.getElementById('progress-label');
  var pct   = (score / PAIRS.length) * 100;
  fill.style.width  = pct + '%';
  label.textContent = score + ' / ' + PAIRS.length;
}

// ---- CELEBRACIÓN ----
function showCelebration() {
  // Construir resumen de oraciones
  var summary = document.getElementById('summary');
  summary.innerHTML = sentences.map(function(s, i) {
    return '<div class="summary-item">' +
      '<span>' + PAIRS[i].clue.emoji + ' + ' +
      (function(){
        // recuperar la palabra correcta
        var correct = PAIRS[i].options[PAIRS[i].correct];
        return correct.emoji;
      })() +
      '</span>' +
      '<p>"' + s + '"</p>' +
    '</div>';
  }).join('');

  document.getElementById('celebration').classList.remove('hidden');
}

// ---- RESET ----
function resetAll() {
  document.getElementById('celebration').classList.add('hidden');
  closeModal();
  init();
}

init();
