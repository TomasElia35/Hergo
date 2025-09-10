const filas = 2;
const columnas = 4;

// Obtiene los círculos en una matriz [fila][columna]
const luces = [];
for (let f = 0; f < filas; f++) {
    luces[f] = [];
    for (let c = 0; c < columnas; c++) {
        luces[f][c] = document.getElementById(`luz${f + 1}-${c + 1}`);
    }
}

const mensaje = document.getElementById("mensaje");
const cronometro = document.getElementById("cronometro");
const reiniciar = document.getElementById("reiniciar");
const audio = document.getElementById('sonido');
const audioGanar = document.getElementById('audioGanar');
const audioPerder = document.getElementById('audioPerder');
const felicitacion = document.getElementById("felicitacion");

let tiempo = 0;
let intervalo = null;
let corriendo = false;
let puedeJugar = false;

// Inicializa todos los círculos apagados
function inicializarSemaforo() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            luces[f][c].style.background = "#222";
        }
    }
    mensaje.textContent = "Preparado...";
    cronometro.textContent = "00.000";
    reiniciar.disabled = true;
    puedeJugar = false;
    audio.pause();
    audio.currentTime = 0;
    ocultarFelicitacion();
}

// Animación: enciende cada círculo de la fila de abajo en rojo uno por uno con sonido
function animarSemaforo() {
    inicializarSemaforo();
    mensaje.textContent = "Listo...";
    audio.play();

    let index = 0;

    function encenderSiguiente() {
        if (index < columnas) {
            luces[1][index].style.background = "red"; // Solo fila 2 (índice 1)
            index++;
            setTimeout(encenderSiguiente, 1000); // 1 segundo por círculo
        } else {
            // Apaga todos los círculos y detiene el sonido
            audio.pause();
            audio.currentTime = 0;
            setTimeout(() => {
                for (let c = 0; c < columnas; c++) {
                    luces[1][c].style.background = "#222";
                }
                mensaje.textContent = "¡YA!";
                iniciarCronometro();
                puedeJugar = true;
                reiniciar.disabled = false;
            }, 4); // Pequeña pausa antes de iniciar el cronómetro
        }
    }

    encenderSiguiente();
}

function iniciarCronometro() {
    tiempo = 0;
    corriendo = true;
    cronometro.textContent = "00.000";
    intervalo = setInterval(() => {
        tiempo += 0.01;
        cronometro.textContent = tiempo.toFixed(3);
    }, 10);
}

function mostrarFelicitacion() {
    felicitacion.textContent = "¡Felicitaciones! Tiempo perfecto.";
    felicitacion.style.display = "block";
    // Oculta el mensaje normal si quieres
    mensaje.textContent = "";
}

function ocultarFelicitacion() {
    felicitacion.textContent = "";
    felicitacion.style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && corriendo && puedeJugar) {
        clearInterval(intervalo);
        corriendo = false;
        puedeJugar = false;
        const objetivo = 2.000;
        const diferencia = Math.abs(tiempo - objetivo);
        if (diferencia < 0.0001) {
            mostrarFelicitacion();
            audioGanar.currentTime = 0;
            audioGanar.play();
        } else {
            mensaje.textContent = `Más suerte la próxima. Diferencia: ${diferencia.toFixed(3)}s`;
            ocultarFelicitacion();
            audioPerder.currentTime = 0;
            audioPerder.play();
        }
        reiniciar.disabled = false;
    }
});

reiniciar.addEventListener("click", () => {
    inicializarSemaforo();
    mensaje.textContent = "Comenzando...";
    setTimeout(animarSemaforo, 800);
});

window.onload = () => {
    inicializarSemaforo();
    setTimeout(animarSemaforo, 1200);
};


