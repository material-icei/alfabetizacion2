// Opcional: Sonido al pasar el mouse
const buttons = document.querySelectorAll('.game-card');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        // Aquí podrías reproducir un "pop" suave
        console.log("¡Listo para jugar!");
    });

    button.addEventListener('click', (e) => {
        // Efecto visual simple antes de navegar
        button.style.backgroundColor = "white";
        button.style.color = "black";
    });
});