# ✨ Inventá tu cuento — Ficha interactiva

Actividad de producción escrita para alumnos de **2° grado de primaria**.  
Los alumnos eligen un personaje, un lugar y un objeto, y redactan su propio cuento respetando las partes narrativas: inicio, conflicto y desenlace.

## 📋 Descripción

La ficha interactiva incluye:

- **Datos del alumno**: nombre, curso y título del cuento
- **Selector de elementos** en 3 columnas (Personaje / Lugar / Objeto) con botones visuales
- **Resumen** de los elementos elegidos
- **Área de escritura** con 3 secciones: Inicio, Conflicto y Desenlace
- **Chips de sugerencias** por sección, incluyendo un chip especial que arma una frase con los elementos seleccionados
- **Contador de palabras** en tiempo real
- **Modal "Ver mi cuento"** con mensaje de felicitación
- **Envío a Google Sheets** (requiere configurar la URL del script)
- **Diseño responsive** para Chromebooks y tablets

## 🗂️ Archivos

```
cuento-elementos/
├── index.html   ← Página principal
├── style.css    ← Estilos
├── script.js    ← Interactividad
└── README.md    ← Este archivo
```

## 🚀 Publicar en GitHub Pages

1. Crear un repositorio público en GitHub
2. Subir los 3 archivos (`index.html`, `style.css`, `script.js`)
3. Ir a **Settings → Pages → Source: main / root**
4. En pocos minutos la URL estará disponible para compartir con los alumnos

## 📊 Configurar envío a Google Sheets

1. Crear una hoja de cálculo en Google Sheets con columnas:  
   `fecha | nombre | curso | titulo | personaje | lugar | objeto | inicio | conflicto | desenlace`
2. En Google Sheets → **Extensiones → Apps Script** → pegar el script de recepción (doPost)
3. Publicar como aplicación web → copiar la URL generada
4. Reemplazar la URL en `script.js` en la función `enviarCuento()`

## 🎨 Tecnologías

HTML5 · CSS3 · JavaScript vanilla · Google Fonts (Fredoka One + Nunito)
