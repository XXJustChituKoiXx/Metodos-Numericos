import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createTable,
    createTr,
    createTd,
    createTh,
    createSpan
} from "../factories.js";
import { conectApi } from "../conection.js";


export function punto_fijo_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection("main-section-punto-fijo", "main-section-punto-fijo");
    const inputDiv = createDiv("input-section-punto-fijo", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo de Punto Fijo";

    const labelFuncion = createLabel(
        "label-funcion-punto-fijo",
        "label-input",
        "input-funcion-punto-fijo",
        "Ingrese la funcion g(x) ya despejada (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-punto-fijo",
        "input-text",
        "text",
        "Ej: cos(x)"
    );

    const labelA = createLabel(
        "label-a-punto-fijo",
        "label-input",
        "input-a-punto-fijo",
        "Aproximacion inicial:"
    );

    const inputA = createInput(
        "input-a-punto-fijo",
        "input-number",
        "number",
        "Ej: 0"
    );

    const labelError = createLabel(
        "label-error-punto-fijo",
        "label-input",
        "input-error-punto-fijo",
        "Error maximo (tolerancia):"
    );

    const inputError = createInput(
        "input-error-punto-fijo",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    const labelIter = createLabel(
        "label-iter-punto-fijo",
        "label-input",
        "input-iter-punto-fijo",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-punto-fijo",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-punto-fijo",
        "error-message",
        ""
    );

    const buttonSend = createButton("send-button", "Calcular");

    inputError.min = 0;
    inputError.step = "any";
    inputA.step = "any";
    inputIter.min = 1;
    inputIter.step = 1;

    inputError.value = "0.001";
    inputIter.value = "100";

    errorMensaje.style.display = "none";


    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelFuncion);
    inputDiv.appendChild(inputFuncion);
    inputDiv.appendChild(labelA);
    inputDiv.appendChild(inputA);
    inputDiv.appendChild(labelError);
    inputDiv.appendChild(inputError);
    inputDiv.appendChild(labelIter);
    inputDiv.appendChild(inputIter);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);


    buttonSend.addEventListener("click", async () => {
        const funcion = inputFuncion.value.trim();
        const a = inputA.value;
        const errorMax = inputError.value;
        const maxIter = inputIter.value;


        if (funcion === "") {
            mostrarError(errorMensaje, "Escriba una funcion.");
            return;
        }

        if (a === "") {
            mostrarError(errorMensaje, "Escriba la aproximacion inicial.");
            return;
        }

        if (errorMax === "" || Number(errorMax) <= 0) {
            mostrarError(errorMensaje, "El error maximo debe ser mayor a cero.");
            return;
        }

        if (maxIter === "" || Number(maxIter) < 1) {
            mostrarError(errorMensaje, "Las iteraciones deben ser al menos 1.");
            return;
        }

        errorMensaje.style.display = "none";

        const body = JSON.stringify({
            "funcion": funcion,
            "a": Number(a),
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(body, "punto_fijo");

        if (!respuesta) {
            mostrarError(errorMensaje, "No se pudo conectar con el servidor.");
            return;
        }

        punto_fijo_result(respuesta);
    });
}

export function punto_fijo_result(data) {
    const article = document.querySelector("article");

    const anterior = document.getElementById("result-section-punto-fijo");
    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection("result-section-punto-fijo", "main-section-punto-fijo");
    const resultDiv = createDiv("result-div-punto-fijo", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-punto-fijo",
            "error-message",
            data.mensaje ? data.mensaje : "El metodo no encontro una raiz."
        );
        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);
        return;
    }

    const raizSpan = createSpan(
        "raiz-punto-fijo",
        "resultado-texto",
        "Raiz aproximada: " + data.raiz
    );
    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-punto-fijo",
            "resultado-texto",
            data.mensaje
        );
        resultDiv.appendChild(mensajeSpan);
    }


    const encabezados = ["i", "x(i)", "g(x(i))", "Error absoluto"];
    const tabla = createTable("tabla-punto-fijo", "tabla-iteraciones");

    const filaEncabezado = createTr("tr-encabezado-punto-fijo", "tr-encabezado");
    encabezados.forEach((texto, indice) => {
        const th = createTh("th-punto-fijo-" + indice, "th-tabla", texto);
        filaEncabezado.appendChild(th);
    });
    tabla.appendChild(filaEncabezado);

    data.tabla.forEach((fila, indiceFila) => {
        const tr = createTr("tr-punto-fijo-" + indiceFila, "tr-tabla");
        fila.forEach((valor, indiceCol) => {
            const texto = indiceCol === 0 ? valor : formatearNumero(valor);
            const td = createTd(
                "td-punto-fijo-" + indiceFila + "-" + indiceCol,
                "td-tabla",
                texto
            );
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });

    resultDiv.appendChild(tabla);

    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}

function mostrarError(elemento, texto) {
    elemento.textContent = texto;
    elemento.style.display = "block";
}

function formatearNumero(valor) {
    if (typeof valor !== "number") {
        return valor;
    }
    if (valor !== 0 && Math.abs(valor) < 0.000001) {
        return valor.toExponential(4);
    }
    return valor.toFixed(6);
}