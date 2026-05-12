// =============================================
//  SOPA DE LETRAS — 3 niveles — 2° grado
//  Detección por arrastre libre: el juego
//  lee las letras seleccionadas y las compara
//  con las palabras a encontrar.
// =============================================

var HIGHLIGHT_COLORS = [
  '#FF6B6B','#4FC3F7','#81C784','#FFD54F',
  '#BA68C8','#4DB6AC','#F06292','#A5D6A7',
  '#64B5F6','#FFB74D','#A1887F','#CE93D8'
];

var PUZZLES = [
  // ══════════════════════════════
  //  SOPA 1 — ALIMENTOS
  // ══════════════════════════════
  {
    category: '🍽️ Alimentos',
    words: [
      { word: 'LECHE',  emoji: '🥛', hint: 'leche'  },
      { word: 'ACEITE', emoji: '🫒', hint: 'aceite'  },
      { word: 'HUEVOS', emoji: '🥚', hint: 'huevos'  },
      { word: 'JAMON',  emoji: '🍖', hint: 'jamón'   },
      { word: 'PAN',    emoji: '🍞', hint: 'pan'     },
      { word: 'QUESO',  emoji: '🧀', hint: 'queso'   },
    ],
    grid: [
      ['P','J','A','M','O','N','M','O','S'],
      ['A','H','H','C','O','S','E','J','E'],
      ['N','S','U','E','N','V','R','S','C'],
      ['Q','M','E','N','I','E','I','E','O'],
      ['T','D','V','L','L','E','A','S','O'],
      ['H','D','O','I','E','E','E','J','O'],
      ['A','A','S','U','S','U','C','E','U'],
      ['A','E','O','S','Q','S','L','H','M'],
      ['S','A','A','C','E','I','T','E','E'],
    ]
    // JAMON  → fila 0, cols 1-5  (J=0,1  A=0,2  M=0,3  O=0,4  N=0,5)
    // PAN    → col 0, filas 0-2  (P=0,0  A=1,0  N=2,0)
    // LECHE  → diagonal↘ desde 1,2? No → buscar manualmente:
    //   L=4,3 E=5,4? → revisemos: grilla[4]=['T','D','V','L','L','E','A','S','O']
    //   L en (4,3),(4,4); grilla[5]=['H','D','O','I','E','E','E','J','O'] E=(5,4)
    //   No es diagonal limpia. Mejor usar detección automática ↓
  },

  // ══════════════════════════════
  //  SOPA 2 — JUGUETES
  // ══════════════════════════════
  {
    category: '🧸 Juguetes',
    words: [
      { word: 'PELOTA', emoji: '⚽', hint: 'pelota' },
      { word: 'YOYO',   emoji: '🪀', hint: 'yoyo'   },
      { word: 'MUÑECA', emoji: '🪆', hint: 'muñeca' },
      { word: 'PUZZLE', emoji: '🧩', hint: 'puzzle' },
      { word: 'COMETA', emoji: '🪁', hint: 'cometa' },
      { word: 'ROBOT',  emoji: '🤖', hint: 'robot'  },
    ],
    grid: [
      ['A','Z','C','O','M','E','T','A','S'],
      ['U','I','E','P','S','E','A','T','R'],
      ['A','E','M','Y','U','T','L','O','O'],
      ['B','E','U','R','O','Z','U','Y','B'],
      ['R','S','Ñ','L','A','O','Z','R','O'],
      ['Z','A','E','S','L','T','T','L','T'],
      ['N','P','C','Z','T','D','B','E','E'],
      ['T','R','A','P','E','L','T','E','A'],
      ['L','Y','O','Y','O','D','E','A','C'],
    ]
    // COMETA → fila 0 cols 2-7: C,O,M,E,T,A ✓
    // YOYO   → fila 8 cols 1-4: Y,O,Y,O ✓
    // PELOTA → fila 7 cols 2-7: A,P,E,L,T,E → no... 
    //   fila 7 = T,R,A,P,E,L,T,E,A → TRAPEL... 
    //   buscamos PELOTA en cualquier dir → detección automática
    // MUNECA → col 2 filas 0-5: C,E,M,R,N,E → no
    //   col 2 = C,E,M,U,N,E,C,A → MUNECA desde fila 2 a 7? M,U,N,E,C,A ✓ (fila 2-7, col 2)
    // ROBOT  → col 0 filas 3-7: B,R,Z,N,T → no / col 1 filas 3-7: S,A,P,R,Y → no
    //   Detección automática
    // PUZZLE → buscar automáticamente
  },

  // ══════════════════════════════
  //  SOPA 3 — CIUDAD
  // ══════════════════════════════
  {
    category: '🏙️ La ciudad',
    words: [
      { word: 'BANCO',    emoji: '🪑', hint: 'banco'    },
      { word: 'PAPELERA', emoji: '🗑️', hint: 'papelera' },
      { word: 'FUENTE',   emoji: '⛲', hint: 'fuente'   },
      { word: 'SEMÁFORO', emoji: '🚦', hint: 'semáforo' },
      { word: 'FAROLA',   emoji: '🪔', hint: 'farola'   },
      { word: 'BUZÓN',    emoji: '📮', hint: 'buzón'    },
    ],
    grid: [
      ['U','R','P','O','O','E','C','F','O'],
      ['T','P','A','P','E','L','E','R','A'],
      ['A','E','Q','R','U','P','O','B','B'],
      ['F','R','F','F','S','F','G','L','U'],
      ['U','O','A','A','Á','P','N','E','Z'],
      ['E','F','U','M','R','B','A','Z','Ó'],
      ['N','T','E','M','A','O','A','R','N'],
      ['T','S','A','E','T','F','L','R','E'],
      ['E','B','A','N','C','O','F','A','I'],
    ]
    // BANCO    → fila 8 cols 1-5: B,A,N,C,O ✓
    // PAPELERA → fila 1 cols 1-8: P,A,P,E,L,E,R,A ✓
    // FUENTE   → col 0 filas 3-8: F,U,E,N,T,E ✓
    // SEMAFORO → detección automática
    // FAROLA   → detección automática
    // BUZON    → detección automática
  }
];

// ── Estado ──
var currentPuzzle = 0;
var foundWords    = [];
var selecting     = false;
var startCell     = null;
var currentCells  = [];
var colorIdx      = 0;
var cellEls       = [];

// ── Pre-calcular posiciones de palabras en cada grilla ──
// Busca la palabra en todas las direcciones y devuelve las celdas
var DIRECTIONS = [
  [0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]
];

function findWordInGrid(grid, word) {
  var rows = grid.length, cols = grid[0].length;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      for (var d = 0; d < DIRECTIONS.length; d++) {
        var dr = DIRECTIONS[d][0], dc = DIRECTIONS[d][1];
        var cells = [];
        var match = true;
        for (var i = 0; i < word.length; i++) {
          var nr = r + i*dr, nc = c + i*dc;
          if (nr<0||nr>=rows||nc<0||nc>=cols||grid[nr][nc]!==word[i]) { match=false; break; }
          cells.push({r:nr,c:nc});
        }
        if (match) return cells;
      }
    }
  }
  return null;
}

// ── INIT ──
function init() {
  foundWords = [];
  colorIdx   = 0;
  cellEls    = [];
  // Quitar listeners viejos
  document.removeEventListener('mouseup',  endSelect);
  document.removeEventListener('touchend', endSelect);
  renderPuzzle(PUZZLES[currentPuzzle]);
  updateDots();
}

function renderPuzzle(puzzle) {
  document.getElementById('category-badge').textContent = puzzle.category;
  updateProgress(0, puzzle.words.length);

  // Lista de palabras
  var wl = document.getElementById('word-list');
  wl.innerHTML = '';
  puzzle.words.forEach(function(w) {
    var div = document.createElement('div');
    div.className = 'word-chip';
    div.id = 'chip-' + w.word;
    div.innerHTML =
      '<span class="chip-emoji">' + w.emoji + '</span>' +
      '<span class="chip-text">' + w.hint + '</span>';
    wl.appendChild(div);
  });

  // Grilla
  var gc = document.getElementById('grid-container');
  gc.innerHTML = '';
  cellEls = [];

  var table = document.createElement('table');
  table.className = 'letter-table';

  puzzle.grid.forEach(function(row, r) {
    var tr = document.createElement('tr');
    var rowEls = [];
    row.forEach(function(letter, c) {
      var td = document.createElement('td');
      td.className   = 'cell';
      td.textContent = letter;
      td.dataset.r   = r;
      td.dataset.c   = c;

      td.addEventListener('mousedown', function(e){ e.preventDefault(); startSelect(r,c); });
      td.addEventListener('mouseenter', function(){ if(selecting) moveSelect(r,c); });
      td.addEventListener('touchstart', function(e){ e.preventDefault(); startSelect(r,c); },{passive:false});
      td.addEventListener('touchmove', function(e){
        e.preventDefault();
        var t  = e.touches[0];
        var el = document.elementFromPoint(t.clientX, t.clientY);
        if (el && el.dataset && el.dataset.r !== undefined)
          moveSelect(+el.dataset.r, +el.dataset.c);
      },{passive:false});

      tr.appendChild(td);
      rowEls.push(td);
    });
    table.appendChild(tr);
    cellEls.push(rowEls);
  });

  document.addEventListener('mouseup',  endSelect);
  document.addEventListener('touchend', endSelect);

  gc.appendChild(table);
}

// ── Selección ──
function startSelect(r, c) {
  selecting    = true;
  startCell    = {r:r, c:c};
  currentCells = [{r:r, c:c}];
  highlightCurrent();
}

function moveSelect(r, c) {
  if (!selecting || !startCell) return;
  var dr = r - startCell.r;
  var dc = c - startCell.c;
  var len = Math.max(Math.abs(dr), Math.abs(dc));

  var stepR = 0, stepC = 0;
  if (len === 0) { currentCells = [{r:startCell.r, c:startCell.c}]; highlightCurrent(); return; }

  if      (dr === 0)                          { stepC = dc>0?1:-1; }
  else if (dc === 0)                          { stepR = dr>0?1:-1; }
  else if (Math.abs(dr) === Math.abs(dc))     { stepR = dr>0?1:-1; stepC = dc>0?1:-1; }
  else return; // ángulo no válido

  var rows = PUZZLES[currentPuzzle].grid.length;
  var cols = PUZZLES[currentPuzzle].grid[0].length;
  var cells = [];
  for (var i = 0; i <= len; i++) {
    var nr = startCell.r + i*stepR;
    var nc = startCell.c + i*stepC;
    if (nr>=0 && nr<rows && nc>=0 && nc<cols) cells.push({r:nr,c:nc});
  }
  currentCells = cells;
  highlightCurrent();
}

function endSelect() {
  if (!selecting) return;
  selecting = false;
  checkWord();
  clearHighlight();
  currentCells = [];
  startCell    = null;
}

function highlightCurrent() {
  clearHighlight();
  currentCells.forEach(function(pos) {
    if (cellEls[pos.r] && cellEls[pos.r][pos.c])
      cellEls[pos.r][pos.c].classList.add('selecting');
  });
}

function clearHighlight() {
  document.querySelectorAll('.cell.selecting').forEach(function(el) {
    el.classList.remove('selecting');
  });
}

// ── Verificar palabra ──
function checkWord() {
  var puzzle   = PUZZLES[currentPuzzle];
  var selected = currentCells.map(function(p){ return puzzle.grid[p.r][p.c]; }).join('');
  var reversed = selected.split('').reverse().join('');

  puzzle.words.forEach(function(w) {
    if (foundWords.indexOf(w.word) !== -1) return;
    if (selected === w.word || reversed === w.word) {
      foundWords.push(w.word);
      var color = HIGHLIGHT_COLORS[colorIdx % HIGHLIGHT_COLORS.length];
      colorIdx++;

      currentCells.forEach(function(pos) {
        var td = cellEls[pos.r][pos.c];
        if (!td) return;
        td.style.background = color;
        td.style.color      = '#fff';
        td.style.borderColor = color;
        td.classList.add('found');
      });

      var chip = document.getElementById('chip-' + w.word);
      if (chip) {
        chip.classList.add('found');
        chip.style.setProperty('--chip-color', color);
      }

      updateProgress(foundWords.length, puzzle.words.length);

      if (foundWords.length === puzzle.words.length) {
        setTimeout(showLevelModal, 600);
      }
    }
  });
}

// ── Progreso ──
function updateProgress(found, total) {
  var pct = (found/total)*100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = found + ' / ' + total;
}

function updateDots() {
  for (var i = 0; i < 3; i++) {
    var dot = document.getElementById('dot-' + i);
    dot.className = 'puzzle-dot' +
      (i === currentPuzzle ? ' active' : '') +
      (i < currentPuzzle   ? ' done'   : '');
  }
}

// ── Modales ──
function showLevelModal() {
  if (currentPuzzle === PUZZLES.length - 1) {
    document.getElementById('modal-final').classList.remove('hidden');
  } else {
    var p = PUZZLES[currentPuzzle];
    document.getElementById('modal-title').textContent = '¡Sopa ' + (currentPuzzle+1) + ' completada!';
    document.getElementById('modal-msg').textContent   = 'Encontraste todas las palabras de ' + p.category;
    document.getElementById('modal-level').classList.remove('hidden');
  }
}

function nextPuzzle() {
  document.getElementById('modal-level').classList.add('hidden');
  currentPuzzle++;
  init();
}

function restartAll() {
  document.getElementById('modal-final').classList.add('hidden');
  currentPuzzle = 0;
  init();
}

init();
