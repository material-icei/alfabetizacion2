// =============================================
//  LEO Y EMPAREJO — imagen arriba / oración abajo
//  Clic en imagen → clic en oración (o al revés)
// =============================================

var ITEMS = [
  { id: 'papa', img: 'img_papa.png', sentence: 'Mi papá tiene una pelota.'   },
  { id: 'mapa', img: 'img_mapa.png', sentence: 'Pepe pisa el mapa.'          },
  { id: 'sapo', img: 'img_sapo.png', sentence: 'El sapo nada en el lago.'    },
  { id: 'pino', img: 'img_pino.png', sentence: 'El pino tiene un nido.'      },
  { id: 'leon', img: 'img_leon.png', sentence: 'Al león le duele el diente.' },
  { id: 'nena', img: 'img_nena.png', sentence: 'La nena es alta.'            },
];

// Estado
var selectedImg      = null; // id seleccionado en grilla de imágenes
var selectedSentence = null; // id seleccionado en grilla de oraciones
var matched          = {};   // id → true si ya fue emparejado
var score            = 0;

function init() {
  selectedImg      = null;
  selectedSentence = null;
  matched          = {};
  score            = 0;

  renderImages(shuffle(ITEMS.map(function(i){ return i.id; })));
  renderSentences(shuffle(ITEMS.map(function(i){ return i.id; })));
  updateProgress();
  document.getElementById('modal-final').classList.add('hidden');
}

// ── GRILLA IMÁGENES ──────────────────────────
function renderImages(order) {
  var grid = document.getElementById('grid-images');
  grid.innerHTML = '';
  order.forEach(function(id) {
    var item = ITEMS.find(function(x){ return x.id === id; });
    var card = document.createElement('div');
    card.className = 'img-card';
    card.id = 'imgcard-' + id;

    var img = document.createElement('img');
    img.src   = item.img;
    img.alt   = item.sentence;

    card.appendChild(img);
    card.addEventListener('click', function(){ onClickImage(id); });
    grid.appendChild(card);
  });
}

// ── GRILLA ORACIONES ─────────────────────────
function renderSentences(order) {
  var grid = document.getElementById('grid-sentences');
  grid.innerHTML = '';
  order.forEach(function(id) {
    var item = ITEMS.find(function(x){ return x.id === id; });
    var card = document.createElement('div');
    card.className = 'sent-card';
    card.id = 'sentcard-' + id;
    card.textContent = item.sentence;
    card.addEventListener('click', function(){ onClickSentence(id); });
    grid.appendChild(card);
  });
}

// ── CLICKS ───────────────────────────────────
function onClickImage(id) {
  if (matched[id]) return;

  // Deseleccionar imagen previa
  if (selectedImg !== null) {
    var prev = document.getElementById('imgcard-' + selectedImg);
    if (prev) prev.classList.remove('selected');
  }

  // Toggle
  if (selectedImg === id) {
    selectedImg = null;
    return;
  }

  selectedImg = id;
  document.getElementById('imgcard-' + id).classList.add('selected');

  if (selectedSentence !== null) tryMatch();
}

function onClickSentence(id) {
  if (matched[id]) return;

  if (selectedSentence !== null) {
    var prev = document.getElementById('sentcard-' + selectedSentence);
    if (prev) prev.classList.remove('selected');
  }

  if (selectedSentence === id) {
    selectedSentence = null;
    return;
  }

  selectedSentence = id;
  document.getElementById('sentcard-' + id).classList.add('selected');

  if (selectedImg !== null) tryMatch();
}

// ── VERIFICAR PAREJA ─────────────────────────
function tryMatch() {
  var imgId  = selectedImg;
  var sentId = selectedSentence;

  var imgCard  = document.getElementById('imgcard-'  + imgId);
  var sentCard = document.getElementById('sentcard-' + sentId);

  if (imgId === sentId) {
    // ✅ Correcto
    matched[imgId] = true;
    score++;

    imgCard.classList.remove('selected');
    sentCard.classList.remove('selected');
    imgCard.classList.add('matched');
    sentCard.classList.add('matched');

    // Pequeña animación de pulso
    imgCard.classList.add('pulse');
    sentCard.classList.add('pulse');
    setTimeout(function(){
      imgCard.classList.remove('pulse');
      sentCard.classList.remove('pulse');
    }, 500);

  } else {
    // ❌ Incorrecto — shake y limpiar
    imgCard.classList.add('wrong');
    sentCard.classList.add('wrong');
    setTimeout(function(){
      imgCard.classList.remove('wrong','selected');
      sentCard.classList.remove('wrong','selected');
    }, 600);
  }

  selectedImg      = null;
  selectedSentence = null;

  updateProgress();

  if (score === ITEMS.length) {
    setTimeout(function(){
      document.getElementById('modal-final').classList.remove('hidden');
    }, 700);
  }
}

// ── PROGRESO ─────────────────────────────────
function updateProgress() {
  var pct = (score / ITEMS.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = score + ' / ' + ITEMS.length;
}

function restartAll() {
  document.getElementById('modal-final').classList.add('hidden');
  init();
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1));
    var t = a[i]; a[i]=a[j]; a[j]=t;
  }
  return a;
}

init();
