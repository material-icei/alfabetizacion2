// =============================================
//  ¡DECÍ 3 COSAS! — Rosco interactivo 2º grado
// =============================================

var CATEGORIES = [
  { icon: '🌊', text: 'Llevamos a la playa' },
  { icon: '🎒', text: 'Usamos en el colegio' },
  { icon: '💪', text: 'Se pueden romper' },
  { icon: '🧹', text: 'Sirven para limpiar' },
  { icon: '🔴', text: 'Son de color rojo' },
  { icon: '🟡', text: 'Son de color amarillo' },
  { icon: '🔵', text: 'Son de color azul' },
  { icon: '🟢', text: 'Son de color verde' },
  { icon: '💰', text: 'Compramos con poco dinero' },
  { icon: '🎵', text: 'Usamos para hacer música' },
  { icon: '🧥', text: 'Usamos en invierno' },
  { icon: '👙', text: 'Usamos en verano' },
  { icon: '🏠', text: 'Tenemos siempre en casa' },
  { icon: '🍎', text: 'Son frutas' },
  { icon: '🥦', text: 'Son verduras' },
  { icon: '🚗', text: 'Tienen ruedas' },
  { icon: '🥄', text: 'Se comen con cuchara' },
  { icon: '🍴', text: 'Se comen con tenedor' },
  { icon: '🚫', text: 'No debemos hacer' },
  { icon: '🧸', text: 'Son blandas' },
  { icon: '🍬', text: 'Son dulces' },
  { icon: '🐦', text: 'Tienen plumas' },
  { icon: '🧂', text: 'Son saladas' },
  { icon: '🧊', text: 'Se guardan en la heladera' },
  { icon: '🪨', text: 'Son duras' },
  { icon: '💡', text: 'Pueden hacer luz' },
  { icon: '⭐', text: 'Se ven en el cielo' },
  { icon: '🚿', text: 'Están en el baño' },
  { icon: '🍳', text: 'Están en la cocina' },
  { icon: '✂️', text: 'Sirven para cortar' },
  { icon: '🐘', text: 'Son grandes' },
  { icon: '🛏️', text: 'Están en la habitación' },
  { icon: '🐜', text: 'Son pequeñas' },
  { icon: '⚽', text: 'Son deportes' },
  { icon: '❤️', text: 'Son emociones o sentimientos' },
  { icon: '🔌', text: 'Se enchufan para funcionar' },
];

var WHEEL_COLORS = [
  '#FF6B6B','#FF8E53','#FFC75F','#F9F871',
  '#42E695','#3BB2B8','#4FC3F7','#7986CB',
  '#BA68C8','#F06292','#4DB6AC','#81C784',
  '#FFB74D','#64B5F6','#E57373','#AED581',
  '#4DD0E1','#9575CD','#F48FB1','#A5D6A7',
];

// Estado
var usedIndices = [];
var gameHistory     = [];
var totalScore  = 0;
var currentIdx  = null;
var isSpinning  = false;
var spinAngle   = 0;
var canvas, ctx, numSectors;

// ---- INIT al cargar ----
window.addEventListener('load', function () {
  resetState();
  canvas     = document.getElementById('wheel-canvas');
  ctx        = canvas.getContext('2d');
  numSectors = CATEGORIES.length;
  drawWheel(0);
  showAnswerPlaceholder();
});

function resetState() {
  usedIndices = [];
  gameHistory     = [];
  totalScore  = 0;
  currentIdx  = null;
  isSpinning  = false;
  spinAngle   = 0;
  document.getElementById('score-display').textContent = '0';
  resetTable();
}

// ---- RUEDA ----
function drawWheel(angle) {
  var W  = canvas.width;
  var H  = canvas.height;
  var cx = W / 2, cy = H / 2;
  var r  = W / 2 - 6;
  var arc = (2 * Math.PI) / numSectors;

  ctx.clearRect(0, 0, W, H);

  for (var i = 0; i < numSectors; i++) {
    var startA = angle + i * arc;
    var endA   = startA + arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startA, endA);
    ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startA + arc / 2);
    ctx.textAlign = 'right';
    ctx.font = '18px serif';
    ctx.fillText(CATEGORIES[i].icon, r - 14, 6);
    ctx.restore();
  }

  // Centro
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur  = 10;
  ctx.fill();
  ctx.shadowBlur  = 0;
}

function spinWheel() {
  if (isSpinning) return;
  if (usedIndices.length === CATEGORIES.length) {
    alert('¡Usaste todas las categorías! Podés finalizar el juego.');
    return;
  }

  isSpinning = true;
  document.getElementById('spin-label').textContent = '...';
  showAnswerPlaceholder();

  var available = [];
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (usedIndices.indexOf(i) === -1) available.push(i);
  }
  var targetIdx = available[Math.floor(Math.random() * available.length)];

  var arc        = (2 * Math.PI) / numSectors;
  var totalSpins = (5 + Math.random() * 5) * 2 * Math.PI;
  var targetAngle = -Math.PI / 2 - (targetIdx * arc + arc / 2);
  targetAngle = ((targetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  var startAngle = spinAngle;
  var endAngle   = startAngle + totalSpins +
    (targetAngle - ((startAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)));
  if (endAngle <= startAngle) endAngle += 2 * Math.PI;

  var duration  = 3500;
  var startTime = null;

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function animate(ts) {
    if (!startTime) startTime = ts;
    var elapsed  = ts - startTime;
    var progress = Math.min(elapsed / duration, 1);
    spinAngle = startAngle + (endAngle - startAngle) * easeOut(progress);
    drawWheel(spinAngle);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      currentIdx = targetIdx;
      usedIndices.push(targetIdx);
      document.getElementById('spin-label').textContent = 'GIRAR';
      showCategory(targetIdx);
    }
  }
  requestAnimationFrame(animate);
}

// ---- PANEL CATEGORÍA ----
function showCategory(idx) {
  var cat = CATEGORIES[idx];
  document.getElementById('cat-icon').textContent = cat.icon;
  document.getElementById('cat-text').textContent = cat.text;
  document.getElementById('placeholder-msg').classList.add('hidden');
  document.getElementById('category-display').classList.remove('hidden');
  document.getElementById('answers-area').classList.remove('hidden');
  ['ans-1','ans-2','ans-3'].forEach(function(id) {
    var el = document.getElementById(id);
    el.value = '';
    el.classList.remove('filled');
  });
  setTimeout(function() { document.getElementById('ans-1').focus(); }, 150);
}

function showAnswerPlaceholder() {
  document.getElementById('category-display').classList.add('hidden');
  document.getElementById('answers-area').classList.add('hidden');
  document.getElementById('placeholder-msg').classList.remove('hidden');
}

// ---- LISTO: agregar fila a la tabla ----
function submitAnswers() {
  if (currentIdx === null) return;

  var a1 = document.getElementById('ans-1').value.trim();
  var a2 = document.getElementById('ans-2').value.trim();
  var a3 = document.getElementById('ans-3').value.trim();

  // Al menos una respuesta requerida
  if (!a1 && !a2 && !a3) {
    document.getElementById('ans-1').focus();
    document.getElementById('ans-1').classList.add('input-shake');
    setTimeout(function() {
      document.getElementById('ans-1').classList.remove('input-shake');
    }, 400);
    return;
  }

  var pts = [a1, a2, a3].filter(Boolean).length;
  totalScore += pts;
  document.getElementById('score-display').textContent = totalScore;

  var cat   = CATEGORIES[currentIdx];
  var entry = {
    category: cat.icon + ' ' + cat.text,
    a1: a1, a2: a2, a3: a3,
    points: pts
  };
  gameHistory.push(entry);
  appendTableRow(entry);

  currentIdx = null;
  showAnswerPlaceholder();
}

// ---- TABLA ----
function resetTable() {
  var tbody = document.getElementById('table-body');
  if (tbody) {
    tbody.innerHTML =
      '<tr class="table-empty-row" id="table-empty-row">' +
      '<td colspan="5">Girá la rueda para empezar ✨</td></tr>';
  }
  var hc = document.getElementById('history-count');
  if (hc) hc.textContent = '0 categorías';
}

function appendTableRow(entry) {
  // Quitar fila de placeholder
  var emptyRow = document.getElementById('table-empty-row');
  if (emptyRow) emptyRow.remove();

  var tbody  = document.getElementById('table-body');
  var rowNum = gameHistory.length;

  var tr = document.createElement('tr');
  tr.className = rowNum % 2 === 0 ? 'row-even' : 'row-odd';

  var cells = [
    rowNum,
    entry.category,
    entry.a1 || '<span class="cell-empty">—</span>',
    entry.a2 || '<span class="cell-empty">—</span>',
    entry.a3 || '<span class="cell-empty">—</span>',
  ];

  cells.forEach(function(val, ci) {
    var td = document.createElement('td');
    td.innerHTML = val;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);

  // Scroll suave a la nueva fila
  tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Contador
  document.getElementById('history-count').textContent =
    rowNum + ' categoría' + (rowNum !== 1 ? 's' : '');
}

// ---- FINALIZAR ----
function finishGame() {
  if (gameHistory.length === 0) {
    alert('¡Girá la rueda al menos una vez antes de finalizar!');
    return;
  }

  document.getElementById('result-score').textContent = totalScore;
  document.getElementById('result-sub').textContent =
    'Completaste ' + gameHistory.length + ' categoría' + (gameHistory.length !== 1 ? 's' : '') + '.';

  buildResultTable();
  showScreen('screen-result');
}

function buildResultTable() {
  var tbody = document.getElementById('result-table-body');
  tbody.innerHTML = '';
  gameHistory.forEach(function(entry, i) {
    var tr = document.createElement('tr');
    tr.className = (i + 1) % 2 === 0 ? 'row-even' : 'row-odd';
    var cells = [
      i + 1,
      entry.category,
      entry.a1 || '<span class="cell-empty">—</span>',
      entry.a2 || '<span class="cell-empty">—</span>',
      entry.a3 || '<span class="cell-empty">—</span>',
    ];
    cells.forEach(function(val) {
      var td = document.createElement('td');
      td.innerHTML = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// ---- REINICIAR ----
function playAgain() {
  showScreen('screen-game');
  resetState();
  spinAngle  = 0;
  drawWheel(0);
  showAnswerPlaceholder();
}

// ---- PANTALLAS ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  var el = document.getElementById(id);
  el.classList.remove('hidden');
  setTimeout(function() { el.classList.add('active'); }, 10);
  if (id === 'screen-result') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// ---- ENTER avanza entre inputs ----
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var active = document.activeElement;
  if (active && active.classList.contains('answer-input')) {
    var ids = ['ans-1','ans-2','ans-3'];
    var idx = ids.indexOf(active.id);
    if (idx < ids.length - 1) {
      document.getElementById(ids[idx + 1]).focus();
    } else {
      submitAnswers();
    }
  }
});
