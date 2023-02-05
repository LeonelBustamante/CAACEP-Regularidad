import tiempos from './tiempos.json' assert {type: 'json'};


function prepararCarrera() {
    let tiempoUltimaEtapa = 0;
    tiempos.etapa.forEach(etapa => {
        //Para cada etapa se calcula la velocidad en m/s
        etapa.velocidadMS = convertirVelocidad(etapa.velocidadKMH);
        //Se calcula el tiempo de cada referencia
        etapa.totalSegundos = calcularTiempoReferencias(etapa, tiempoUltimaEtapa);
        //Se guarda el tiempo de la ultima etapa para calcular el tiempo de la siguiente
        tiempoUltimaEtapa = etapa.totalSegundos;
    });

    let hojaDeRuta = document.querySelector('#hojaRuta');
    hojaDeRuta.appendChild(crearHojaDeRuta());
}


function calcularTiempoReferencias(etapa, totalSegundos) {
    // Metodo que tomara de cada etapa el arreglo de las referencias, 
    // y calculara de estas cuantos segundos se deberia tardar a esa 
    // referencia segun tiempo y velocidad
    let ultimoEnlace = 0;
    let tiempoReferencia = 0;

    // Se crea repetitiva para recorrer cada referencia
    etapa.referencias.forEach(referencia => {

        if (referencia.inicio) {
            // Si es el inicio se toma el tiempo de inicio y se ajusta
            tiempoReferencia = calcularSegundosEnlace(referencia.tiempo);
            referencia.segundos = tiempoReferencia;
            ultimoEnlace = tiempoReferencia;
            console.log("Inicio - " + referencia.referencia + " - Tiempo - " + tiempoReferencia);
        } else if (referencia.inicio == false && referencia.enlace) {
            // Es un enlace pero no el primero, se calcula el tiempo 
            // de la ultima referencia y se le suma el tiempo del enlace 
            // redondeando a minutos
            tiempoReferencia = totalSegundos + calcularSegundosEnlace(referencia.tiempo);
            tiempoReferencia = redondearMinutos(tiempoReferencia);
            referencia.segundos = tiempoReferencia;
            ultimoEnlace = referencia.segundos * 60;
            console.log("Enalce - " + referencia.referencia + " - Tiempo - " + tiempoReferencia);
        } else {
            // Si es una referencia se toma el tiempo anterior y se le 
            // suma el calculo del ultimo enlace
            tiempoReferencia = ultimoEnlace + calcularSegundosReferencia(referencia.metros, etapa.velocidadMS);
            // Se coloca el tiempo en la referencia
            referencia.segundos = tiempoReferencia;
            console.log("Referencia - " + referencia.referencia + " - Tiempo - " + tiempoReferencia);
        }
    });
    return tiempoReferencia;
}

function redondearMinutos(tiempo) {
    return Math.round(tiempo / 60);
}

function calcularSegundosEnlace(tiempo) {
    return tiempo * 60;
}

function calcularSegundosReferencia(metros, velocidad) {
    return metros / velocidad;
}

function crearHojaDeRuta() {
    let hojaDeRuta = document.createElement('div');
    hojaDeRuta.classList.add('hojaRuta');

    tiempos.etapa.forEach(etapa => {
        let etapaDiv = document.createElement('div');
        etapaDiv.classList.add('etapa');
        etapa.referencias.forEach(referencia => {
            etapaDiv.appendChild(crearFila(etapa.velocidadKMH, referencia));
        });
        hojaDeRuta.appendChild(etapaDiv);
    });

    return hojaDeRuta;
}

function crearFila(velocidadEtapa, cadaReferencia) {
    let fila = document.createElement('div');
    fila.classList.add('fila');

    let velocidad = document.createElement('div');
    velocidad.classList.add('columna');
    velocidad.appendChild(crearP(velocidadEtapa));

    let detalle = document.createElement('div');
    detalle.classList.add('columna');
    detalle.appendChild(crearP(cadaReferencia.referencia));

    let tiempo = document.createElement('div');
    tiempo.classList.add('columna');
    tiempo.appendChild(crearP(calcularTiempo(cadaReferencia)));

    fila.appendChild(velocidad);
    fila.appendChild(detalle);
    fila.appendChild(tiempo);

    return fila;
}

function crearP(valor) {
    let tag = document.createElement('p');
    tag.innerHTML = valor;
    return tag;
}

function calcularTiempo(referencia) {
    let centiseconds = Math.floor(referencia.segundos * 100) % 100;
    let seconds = Math.floor(referencia.segundos % 60);
    let minutes = Math.floor((referencia.segundos / 60) % 60);
    let hours = Math.floor(referencia.segundos / 3600);

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    centiseconds = centiseconds < 10 ? `0${centiseconds}` : centiseconds;

    if (referencia.oculto == false) {
        return `${hours}:${minutes}:${seconds}:${centiseconds}`;
    } else {
        if (referencia.autocontrol) {
            return "__:__:__:__";
        }
        return "XX:XX:XX:XX";
    }

}

prepararCarrera();



function convertirVelocidad(velocidad) {
    return velocidad / 3.6;
}