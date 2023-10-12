const HOST = "https://api.frankfurter.app";

document.querySelector("#enviar").onclick = function (e) {
    e.preventDefault();

    const $form = document.querySelector("#form");
    const fecha = $form.fecha.value;
    const monedaBase = $form.moneda.value;

    // Si tanto fecha o monedaBase están "vacios", va a terminar la ejecucion
    if (!(fecha && monedaBase !== "0")) {
        return;
    }

    fetch(`${HOST}/${fecha}?from=${monedaBase}`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            actualizarTitulo(respuesta.date, respuesta.base);
            borrarTiposDeCambioAnteriores();
            agregarTiposDeCambio(respuesta.rates);
            mostrarTiposDeCambio();
        });
};

fetch(`${HOST}/currencies`) // Devuelve un objeto con el siguiente formato {CODIGO-MONEDA: "Nombre moneda"}
    .then(respuesta => respuesta.json())
    .then(monedasDisponibles => {
        cargarMonedasDisponibles(monedasDisponibles);
    });


// Carga las monedas que tenga la API en el select del index.html
function cargarMonedasDisponibles(monedas) {
    const $select = document.querySelector("#moneda");
    Object.keys(monedas).forEach(function (moneda) {
        const abreviacionMoneda = moneda;
        const nombreMoneda = monedas[moneda];

        const $opcion = document.createElement("option");
        $opcion.textContent = `${abreviacionMoneda} - ${nombreMoneda}`;
        $opcion.value = abreviacionMoneda;

        $select.appendChild($opcion);
    });
}

// function agregarTiposDeCambio(tiposDeCambio);
function actualizarTitulo(fecha, monedaBase) {
    const fechaFormateada = formatearFecha(fecha);
    const $titulo = document.querySelector(".tipos-de-cambio__titulo");
    $titulo.textContent = `Los tipos de cambio del ${monedaBase} para el ${fechaFormateada} son: `;
}

function agregarTiposDeCambio(tiposDeCambio) {
    const $listaTiposDeCambio = document.querySelector(".tipos-de-cambio__lista");

    Object.keys(tiposDeCambio).forEach(function (moneda) {
        const $li = document.createElement("li");
        $li.className = "tipo-de-cambio";
        $li.textContent = `${moneda}: ${tiposDeCambio[moneda]}`;

        $listaTiposDeCambio.appendChild($li);


    });
}

function borrarTiposDeCambioAnteriores() {
    document.querySelectorAll(".tipo-de-cambio").forEach(function (elemento) {
        elemento.remove();
    });
}

function mostrarTiposDeCambio() {
    document.querySelector(".tipos-de-cambio").classList.remove("oculto");
}

function formatearFecha(fecha) {
    const formatoFecha = /(\d{4})-(\d{2})-(\d{2})/; // aaaa-mm-dd
    const dd = fecha.match(formatoFecha)[3];
    const mm = fecha.match(formatoFecha)[2];
    const aaaa = fecha.match(formatoFecha)[1];

    return `${dd}-${mm}-${aaaa}`;
}
