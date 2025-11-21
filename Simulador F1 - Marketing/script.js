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
const cronometroTextElement = cronometroTspan.parentElement; 
const botonReiniciar = document.getElementById("boton-reiniciar");
const mensajeResultado = document.getElementById("mensaje-resultado");
const mensajeTexto = document.getElementById("mensaje-texto");
// Elemento nuevo para cambiar el color del cartel
const cajaMensaje = document.getElementById("caja-mensaje");

// --- VARIABLES DE ESTADO DEL JUEGO ---
let tiempo = 0;
let intervalo = null;
let estadoJuego = 'PREPARADO'; 

// Clases de estilo del SVG
const LUZ_APAGADA = "st0"; 
const LUZ_ENCENDIDA = "st1"; 
const FUENTE_ORIGINAL_SIZE = "82.5px"; 
const FUENTE_PEQUENA_SIZE = "45px";   


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
    
    cronometroTextElement.style.fontSize = FUENTE_PEQUENA_SIZE; 
    cronometroTextElement.setAttribute("dy", "10"); 

    tiempo = 0;
    estadoJuego = 'PREPARADO';
}

/**
 * Inicia la secuencia de animación del semáforo.
 */
function animarSemaforo() {
    for (let c = 0; c < columnas; c++) {
        luces[1][c].setAttribute('class', LUZ_APAGADA);
    }
    
    cronometroTspan.textContent = "Listo...";
    cronometroTextElement.style.fontSize = FUENTE_ORIGINAL_SIZE;
    cronometroTextElement.setAttribute("dy", "0");
    
    estadoJuego = 'ANIMANDO'; 

    let index = 0;

    function encenderSiguiente() {
        if (index < columnas) {
            luces[1][index].setAttribute('class', LUZ_ENCENDIDA); 
            index++;
            setTimeout(encenderSiguiente, 1000); 
        } else {
            setTimeout(() => {
                for (let c = 0; c < columnas; c++) {
                    luces[1][c].setAttribute('class', LUZ_APAGADA);
                }
                cronometroTspan.textContent = "¡YA!"; 
                cronometroTextElement.style.fontSize = FUENTE_ORIGINAL_SIZE;
                iniciarCronometro();
                estadoJuego = 'CONTANDO';
            }, 500); 
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

    // LOGICA GANAR/PERDER
    // Usamos una tolerancia pequeña para flotantes (0.005) para que sea posible ganar
    if (diferencia > 0.005) {
        mostrarMensajeResultado("GANASTE", "win");
    } else {
        mostrarMensajeResultado("PERDIO", "loss");
    }
}


// --- FUNCIONES DE VISUALIZACIÓN DE MENSAJES ---

function mostrarMensajeResultado(texto, tipo) {
    mensajeTexto.textContent = texto;
    
    // Asignar clase de color al rectángulo
    // Reseteamos clase base y añadimos la específica
    cajaMensaje.setAttribute("class", "modal-box " + tipo);

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