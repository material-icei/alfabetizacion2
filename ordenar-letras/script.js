// =============================================
//  ORDENAR LETRAS — 2° grado primaria
//  La letra coloreada es la primera fija.
//  El alumno arrastra o hace clic en las demás.
// =============================================

var CARDS = [
  { word: 'MUÑECA', startLetter: 'M', letters: ['U','Ñ','M','A','E','C'] },
  { word: 'ZAPATO', startLetter: 'Z', letters: ['A','T','P','Z','O','A'] },
  { word: 'ABRAZO', startLetter: 'A', letters: ['B','Z','A','R','A','O'] },
  { word: 'BAILAR', startLetter: 'B', letters: ['A','R','B','I','L','A'] },
  { word: 'MASAJE', startLetter: 'M', letters: ['A','S','J','E','A','M'] },
  { word: 'CUENTO', startLetter: 'C', letters: ['O','N','T','E','C','U'] },
];

var currentCard = 0;
var completed   = new Array(CARDS.length).fill(false);

// Estado de la tarjeta actual
var slotContents  = [];   // slotContents[i] = {letter, tileId} | null
var tiles         = {};   // tileId → {letter, placed}
var tileIdCounter = 0;

// ─────────────────────────────────────────────
function init() {
  buildNav();
  loadCard(currentCard);
}

function buildNav() {
  var nav = document.getElementById('card-nav');
  nav.innerHTML = '';
  CARDS.forEach(function(_, i) {
    var dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.id = 'dot-' + i;
    nav.appendChild(dot);
  });
}

function updateNav() {
  CARDS.forEach(function(_, i) {
    var dot = document.getElementById('dot-' + i);
    dot.className = 'nav-dot' +
      (i === currentCard  ? ' active'    : '') +
      (completed[i]        ? ' done'      : '');
  });
  document.getElementById('card-number').textContent = currentCard + 1;
  document.getElementById('btn-prev').disabled = currentCard === 0;
  document.getElementById('btn-next').textContent =
    currentCard === CARDS.length - 1 ? 'Finalizar 🏁' : 'Siguiente ▶';
}

// ─────────────────────────────────────────────
function loadCard(idx) {
  var card = CARDS[idx];

  // Resetear estado
  tileIdCounter = 0;
  tiles         = {};
  slotContents  = new Array(card.word.length).fill(null);

  // Slots: el slot 0 ya tiene la letra de inicio fija
  slotContents[0] = { letter: card.startLetter, fixed: true };

  hideFeedback();
  renderLetters(card);
  renderSlots(card);
  updateNav();
}

// ─────────────────────────────────────────────
//  LETRAS DISPONIBLES (área superior)
// ─────────────────────────────────────────────
function renderLetters(card) {
  var area = document.getElementById('letters-area');
  area.innerHTML = '';

  // Las letras disponibles son todas EXCEPTO la letra de inicio
  // (la de inicio ya está fija en slot 0)
  var available = card.letters.slice();
  // Quitar UNA instancia de startLetter
  var startIdx = available.indexOf(card.startLetter);
  if (startIdx !== -1) available.splice(startIdx, 1);

  // Mezclar
  available = shuffle(available);

  available.forEach(function(letter) {
    var id   = 'tile-' + (tileIdCounter++);
    tiles[id] = { letter: letter, placed: false };

    var tile = document.createElement('div');
    tile.className    = 'letter-tile';
    tile.id           = id;
    tile.textContent  = letter;
    tile.dataset.tid  = id;

    // Clic para colocar en el primer slot libre
    tile.addEventListener('click', function() { clickTile(id); });

    // Drag
    tile.draggable = true;
    tile.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('tid', id);
      setTimeout(function(){ tile.classList.add('dragging'); }, 0);
    });
    tile.addEventListener('dragend', function() {
      tile.classList.remove('dragging');
    });

    area.appendChild(tile);
  });
}

// ─────────────────────────────────────────────
//  SLOTS (área inferior)
// ─────────────────────────────────────────────
function renderSlots(card) {
  var area = document.getElementById('slots-area');
  area.innerHTML = '';

  for (var i = 0; i < card.word.length; i++) {
    (function(idx) {
      var slot = document.createElement('div');
      slot.className    = 'letter-slot';
      slot.id           = 'slot-' + idx;
      slot.dataset.sidx = idx;

      if (idx === 0) {
        // Slot fijo con la letra de inicio
        slot.textContent = card.startLetter;
        slot.classList.add('fixed');
      } else {
        slot.textContent = '';
        // Drop sobre slot
        slot.addEventListener('dragover', function(e) {
          e.preventDefault();
          slot.classList.add('drag-over');
        });
        slot.addEventListener('dragleave', function() {
          slot.classList.remove('drag-over');
        });
        slot.addEventListener('drop', function(e) {
          e.preventDefault();
          slot.classList.remove('drag-over');
          var tid = e.dataTransfer.getData('tid');
          if (tid) dropTileOnSlot(tid, idx);
        });
        // Clic en slot ocupado para devolver letra
        slot.addEventListener('click', function() {
          if (slotContents[idx]) returnTile(idx);
        });
      }

      area.appendChild(slot);
    })(i);
  }
}

// ─────────────────────────────────────────────
//  LÓGICA
// ─────────────────────────────────────────────
function clickTile(tid) {
  if (tiles[tid].placed) return;
  // Buscar primer slot libre (desde idx 1)
  for (var i = 1; i < slotContents.length; i++) {
    if (!slotContents[i]) {
      placeTileInSlot(tid, i);
      return;
    }
  }
}

function dropTileOnSlot(tid, slotIdx) {
  if (slotIdx === 0) return; // slot fijo
  // Si el slot ya tiene algo, devolver esa tile al área
  if (slotContents[slotIdx]) {
    returnTile(slotIdx);
  }
  placeTileInSlot(tid, slotIdx);
}

function placeTileInSlot(tid, slotIdx) {
  var tile = tiles[tid];
  if (!tile || tile.placed) return;

  tile.placed = true;

  // Ocultar tile del área
  var tileEl = document.getElementById(tid);
  if (tileEl) tileEl.classList.add('placed-out');

  // Mostrar en slot
  slotContents[slotIdx] = { letter: tile.letter, tid: tid };
  var slotEl = document.getElementById('slot-' + slotIdx);
  if (slotEl) {
    slotEl.textContent = tile.letter;
    slotEl.classList.add('filled');
    slotEl.classList.remove('correct', 'wrong');
  }

  hideFeedback();
}

function returnTile(slotIdx) {
  var content = slotContents[slotIdx];
  if (!content || content.fixed) return;

  var tid = content.tid;
  slotContents[slotIdx] = null;

  // Restaurar tile en área
  var tileEl = document.getElementById(tid);
  if (tileEl) tileEl.classList.remove('placed-out');
  if (tiles[tid]) tiles[tid].placed = false;

  // Limpiar slot
  var slotEl = document.getElementById('slot-' + slotIdx);
  if (slotEl) {
    slotEl.textContent = '';
    slotEl.classList.remove('filled', 'correct', 'wrong');
  }

  hideFeedback();
}

function clearSlots() {
  var card = CARDS[currentCard];
  for (var i = 1; i < card.word.length; i++) {
    if (slotContents[i]) returnTile(i);
  }
  hideFeedback();
}

// ─────────────────────────────────────────────
//  VERIFICAR
// ─────────────────────────────────────────────
function verify() {
  var card    = CARDS[currentCard];
  var allFull = true;

  for (var i = 1; i < card.word.length; i++) {
    if (!slotContents[i]) { allFull = false; break; }
  }

  if (!allFull) {
    showFeedback('⚠️ Completá todos los espacios primero.', 'warn');
    return;
  }

  // Construir palabra formada
  var formed = card.startLetter;
  for (var i = 1; i < card.word.length; i++) {
    formed += slotContents[i].letter;
  }

  var correct = formed === card.word;

  // Colorear slots
  for (var i = 1; i < card.word.length; i++) {
    var slotEl = document.getElementById('slot-' + i);
    if (!slotEl) continue;
    slotEl.classList.remove('correct','wrong');
    if (slotContents[i].letter === card.word[i]) {
      slotEl.classList.add('correct');
    } else {
      slotEl.classList.add('wrong');
    }
  }

  if (correct) {
    completed[currentCard] = true;
    updateNav();
    showFeedback('🎉 ¡Muy bien! La palabra es <strong>' + card.word + '</strong>', 'ok');
    showToast();

    // ¿Ganó todo?
    if (completed.every(function(c){ return c; })) {
      setTimeout(function(){ document.getElementById('modal-final').classList.remove('hidden'); }, 1200);
    }
  } else {
    showFeedback('❌ Revisá las letras e intentá de nuevo.', 'err');
  }
}

// ─────────────────────────────────────────────
//  NAVEGACIÓN
// ─────────────────────────────────────────────
function nextCard() {
  if (currentCard === CARDS.length - 1) {
    // Finalizar
    if (completed.every(function(c){ return c; })) {
      document.getElementById('modal-final').classList.remove('hidden');
    } else {
      showFeedback('⚠️ Aún tenés palabras sin completar correctamente.', 'warn');
    }
    return;
  }
  currentCard++;
  loadCard(currentCard);
}

function prevCard() {
  if (currentCard === 0) return;
  currentCard--;
  loadCard(currentCard);
}

function restart() {
  document.getElementById('modal-final').classList.add('hidden');
  completed   = new Array(CARDS.length).fill(false);
  currentCard = 0;
  loadCard(0);
}

// ─────────────────────────────────────────────
//  FEEDBACK / TOAST
// ─────────────────────────────────────────────
function showFeedback(msg, type) {
  var el = document.getElementById('feedback');
  el.innerHTML   = msg;
  el.className   = 'feedback ' + type;
}

function hideFeedback() {
  var el = document.getElementById('feedback');
  el.className = 'feedback hidden';
  el.innerHTML = '';
}

function showToast() {
  var toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  setTimeout(function(){ toast.classList.add('hidden'); }, 1800);
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1));
    var t = a[i]; a[i]=a[j]; a[j]=t;
  }
  return a;
}

init();
