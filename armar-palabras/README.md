# 🔤 Armá palabras con sílabas

Ficha interactiva de **armado de palabras bisílabas** para alumnos de **2° grado de primaria**.  
Los alumnos hacen clic en una sílaba de la columna izquierda y otra de la columna derecha para formar la palabra y unirla con su imagen.

## 🎮 Cómo jugar

1. Hacé clic en una **1ª sílaba** (columna naranja)
2. Hacé clic en la **2ª sílaba** (columna azul)
3. Si forman una palabra correcta → aparece en el centro y la imagen se ilumina ✓
4. Si no coinciden → vibra y se puede intentar de nuevo
5. ¡Completá las 9 palabras para ganar! 🎉

## 📝 Palabras incluidas

| 1ª sílaba | 2ª sílaba | Palabra | Imagen |
|-----------|-----------|---------|--------|
| ma | no | mano | ✋ |
| pa | to | pato | 🦆 |
| lu | na | luna | 🌙 |
| da | do | dado | 🎲 |
| ni | ño | niño | 👦 |
| fo | ca | foca | 🦭 |
| sa | po | sapo | 🐸 |
| so | pa | sopa | 🍲 |
| pe | ro | pero | 🍎 |

## 🗂️ Archivos

```
silabas/
├── index.html   ← Página principal
├── style.css    ← Estilos
├── script.js    ← Lógica del juego
└── README.md
```

## 🚀 Publicar en GitHub Pages

1. Crear repositorio público en GitHub
2. Subir los 3 archivos
3. **Settings → Pages → Source: main / root**
4. Compartir la URL con los alumnos

## ✏️ Personalizar las palabras

En `script.js`, editá el array `WORDS` al inicio del archivo:
```js
var WORDS = [
  { a: 'ma', b: 'no', word: 'mano', emoji: '✋', hint: 'mano' },
  // ... agregar o modificar palabras aquí
];
```
Cada emoji representa visualmente la imagen. Podés reemplazarlos por imágenes reales usando `<img>` si lo preferís.

## 🎨 Tecnologías

HTML5 · CSS3 · JavaScript vanilla · Google Fonts (Fredoka One + Nunito)
