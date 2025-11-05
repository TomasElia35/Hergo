// --- CONSTANTES DE ELEMENTOS DEL SVG ---
const filas = 2;
const columnas = 4;

// Obtiene las luces del semáforo (círculos SVG)
const luces = [];
for (let f = 0; f < filas; f++) {
    luces[f] = [];
    for (let c = 0; c < columnas; c++) {
        luces[f][c] = document.getElementById(`luz-${f}-${c}`);
    }
}

// Obtiene los elementos interactivos del SVG
const cronometroTspan = document.getElementById("cronometro-texto");
const cronometroTextElement = cronometroTspan.parentElement; // El elemento <text> padre
const botonReiniciar = document.getElementById("boton-reiniciar");
const mensajeResultado = document.getElementById("mensaje-resultado");
const mensajeTexto = document.getElementById("mensaje-texto");

// --- VARIABLES DE ESTADO DEL JUEGO ---
let tiempo = 0;
let intervalo = null;
let estadoJuego = 'PREPARADO'; // Estados: PREPARADO, ANIMANDO, CONTANDO, FIN_JUEGO

// Clases de estilo del SVG
const LUZ_APAGADA = "st0"; // Clase CSS para luz apagada (negro)
const LUZ_ENCENDIDA = "st1"; // Clase CSS para luz encendida (rojo)
const FUENTE_ORIGINAL_SIZE = "82.5px"; // Tamaño de .st6
const FUENTE_PEQUENA_SIZE = "60px";   // Tamaño ajustado para "Presiona Enter"


/**
 * Resetea el juego a su estado inicial.
 */
function inicializarJuego() {
    // Apaga todas las luces
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (luces[f][c]) {
                luces[f][c].setAttribute('class', LUZ_APAGADA);
            }
        }
    }
    
    // Resetea UI
    ocultarMensajeResultado();
    cronometroTspan.textContent = "Presiona Enter";
    // *** CAMBIO: Ajusta el tamaño de fuente ***
    cronometroTextElement.style.fontSize = FUENTE_PEQUENA_SIZE; 
    
    tiempo = 0;
    estadoJuego = 'PREPARADO';
}

/**
 * Inicia la secuencia de animación del semáforo.
 */
function animarSemaforo() {
    // Apaga todas las luces (por si acaso)
    for (let c = 0; c < columnas; c++) {
        luces[1][c].setAttribute('class', LUZ_APAGADA);
    }
    
    cronometroTspan.textContent = "Listo...";
    // *** CAMBIO: Restaura el tamaño de fuente original ***
    cronometroTextElement.style.fontSize = FUENTE_ORIGINAL_SIZE;
    estadoJuego = 'ANIMANDO'; 

    let index = 0;

    function encenderSiguiente() {
        if (index < columnas) {
            luces[1][index].setAttribute('class', LUZ_ENCENDIDA); // Solo fila 2 (índice 1)
            index++;
            setTimeout(encenderSiguiente, 1000); // 1 segundo por círculo
        } else {
            // Apaga todos los círculos
            setTimeout(() => {
                for (let c = 0; c < columnas; c++) {
                    luces[1][c].setAttribute('class', LUZ_APAGADA);
                }
                cronometroTspan.textContent = "¡YA!"; 
                // *** CAMBIO: Asegura el tamaño de fuente original ***
                cronometroTextElement.style.fontSize = FUENTE_ORIGINAL_SIZE;
                iniciarCronometro();
                estadoJuego = 'CONTANDO';
            }, 500); // Pausa antes de iniciar
        }
    }

    encenderSiguiente();
}

/**
 * Inicia el cronómetro.
 */
function iniciarCronometro() {
    tiempo = 0;
    cronometroTspan.textContent = "00.000";
    // *** CAMBIO: Asegura el tamaño de fuente original ***
    cronometroTextElement.style.fontSize = FUENTE_ORIGINAL_SIZE;
    
    intervalo = setInterval(() => {
        tiempo += 0.01;
        let tiempoStr = tiempo.toFixed(3);
        if (tiempo < 10) {
            tiempoStr = "0" + tiempoStr;
        }
        cronometroTspan.textContent = tiempoStr;
    }, 10);
}

/**
 * Detiene el cronómetro y evalúa el resultado.
 */
function detenerCronometro() {
    clearInterval(intervalo);
    estadoJuego = 'FIN_JUEGO'; 

    const objetivo = 2.000;
    const diferencia = Math.abs(tiempo - objetivo);

    if (diferencia < 0.0001) {
        mostrarMensajeResultado("¡Tiempo perfecto!");
    } else {
        mostrarMensajeResultado(`Diferencia: ${diferencia.toFixed(3)}s`);
    }
}


// --- FUNCIONES DE VISUALIZACIÓN DE MENSAJES ---

function mostrarMensajeResultado(texto) {
    mensajeTexto.textContent = texto;
    mensajeResultado.style.display = 'block';
}

function ocultarMensajeResultado() {
    mensajeTexto.textContent = '';
    mensajeResultado.style.display = 'none';
}


// --- MANEJADOR DE INTERACCIÓN PRINCIPAL ---

function manejarInteraccion() {
    switch (estadoJuego) {
        case 'PREPARADO':
            animarSemaforo();
            break;
            
        case 'CONTANDO':
            detenerCronometro();
            break;
            
        case 'FIN_JUEGO':
            inicializarJuego();
            break;

        case 'ANIMANDO':
            // No hacer nada
            break;
    }
}

// --- EVENT LISTENERS ---

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        manejarInteraccion();
    }
});

botonReiniciar.addEventListener("click", () => {
    manejarInteraccion();
});

window.onload = () => {
    inicializarJuego();
};