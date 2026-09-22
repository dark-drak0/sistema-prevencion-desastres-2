// =========================================================
// SISTEMA DE PREVENCIÓN FRENTE A DESASTRES NATURALES 2.0
// JavaScript
// =========================================================

// ---------------------------------------------------------
// FECHA Y HORA
// ---------------------------------------------------------

function actualizarFechaHora() {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const hora = ahora.toLocaleTimeString("es-CL");

    document.getElementById("fechaActual").textContent = fecha;
    document.getElementById("horaActual").textContent = hora;
}

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);


// ---------------------------------------------------------
// CLIMA - OPEN-METEO
// Referencia: Chillán, Chile
// ---------------------------------------------------------

async function actualizarClima() {

    const resultado = document.getElementById("climaResultado");

    resultado.innerHTML = `
        <span>
            <i class="fa-solid fa-spinner fa-spin"></i>
            Consultando información...
        </span>
    `;

    try {

        const latitud = -36.6066;
        const longitud = -72.1034;

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitud}` +
            `&longitude=${longitud}` +
            `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
            `&timezone=America%2FSantiago`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el clima.");
        }

        const datos = await respuesta.json();

        const temperatura = datos.current.temperature_2m;
        const humedad = datos.current.relative_humidity_2m;
        const viento = datos.current.wind_speed_10m;

        resultado.innerHTML = `
            <div>
                <div class="fs-3 fw-bold mb-2">
                    ${temperatura} °C
                </div>

                <div>
                    <i class="fa-solid fa-droplet"></i>
                    Humedad: ${humedad}%
                </div>

                <div>
                    <i class="fa-solid fa-wind"></i>
                    Viento: ${viento} km/h
                </div>
            </div>
        `;

    } catch (error) {

        resultado.innerHTML = `
            <div class="text-danger">
                <i class="fa-solid fa-circle-exclamation"></i>
                No fue posible obtener el clima en este momento.
            </div>
        `;
    }
}


// ---------------------------------------------------------
// EVALUACIÓN DEL RIESGO
// ---------------------------------------------------------

function analizarRiesgo() {

    const amenaza = Number(document.getElementById("pregunta1").value);
    const alerta = Number(document.getElementById("pregunta2").value);
    const plan = Number(document.getElementById("pregunta3").value);

    const puntaje = amenaza + alerta + plan;

    const resultado = document.getElementById("resultadoRiesgo");

    // Apagar todas las luces
    document.getElementById("luzVerde").className = "luz";
    document.getElementById("luzAmarilla").className = "luz";
    document.getElementById("luzRoja").className = "luz";
    document.getElementById("luzNegra").className = "luz";

    if (puntaje <= 1) {

        resultado.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Riesgo educativo: BAJO
            <br>
            <small>Continúa preparado y atento a la información oficial.</small>
        `;

        document.getElementById("luzVerde").classList.add("activa-verde");

    } else if (puntaje <= 2) {

        resultado.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            Riesgo educativo: MEDIO
            <br>
            <small>Revisa tu plan familiar y mantente informado.</small>
        `;

        document.getElementById("luzAmarilla").classList.add("activa-amarilla");

    } else if (puntaje <= 3) {

        resultado.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            Riesgo educativo: ALTO
            <br>
            <small>Presta atención a las instrucciones de las autoridades.</small>
        `;

        document.getElementById("luzRoja").classList.add("activa-roja");

    } else {

        resultado.innerHTML = `
            <i class="fa-solid fa-skull-crossbones"></i>
            Riesgo educativo: MUY ALTO
            <br>
            <small>Busca información oficial y sigue las instrucciones de emergencia.</small>
        `;

        document.getElementById("luzNegra").classList.add("activa-negra");
    }
}
