import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createSpan,
    createGenericTable
} from "../factories.js";

import { mostrarError, formatearNumero } from "../auxiliares.js";
import { conectApi } from "../conection.js";

export function muller_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-muller",
        "main-section-muller"
    );

    const inputDiv = createDiv(
        "input-section-muller",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo Muller.";

    const labelFuncion = createLabel(
        "label-muller",
        "label-input",
        "input-funcion-muller",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-muller",
        "input-text",
        "text",
        "Ej: x**3 - x - 2"
    );

    const labelX0 = createLabel(
        "label-x0-muller",
        "label-input",
        "input-x0-muller",
        "x0:"
    );

    const inputX0 = createInput(
        "input-x0-muller",
        "input-number",
        "number",
        "Ej: 0"
    );

    const labelX1 = createLabel(
        "label-x1-muller",
        "label-input",
        "input-x1-muller",
        "x1:"
    );

    const inputX1 = createInput(
        "input-x1-muller",
        "input-number",
        "number",
        "Ej: 1"
    );

    const labelX2 = createLabel(
        "label-x2-muller",
        "label-input",
        "input-x2-muller",
        "x2:"
    );

    const inputX2 = createInput(
        "input-x2-muller",
        "input-number",
        "number",
        "Ej: 2"
    );

    const labelError = createLabel(
        "label-error-muller",
        "label-input",
        "input-error-muller",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-muller",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    const labelIter = createLabel(
        "label-iter-muller",
        "label-input",
        "input-iter-muller",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-muller",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-muller",
        "error-message",
        ""
    );

    const buttonSend = createButton(
        "send-button",
        "Calcular"
    );

    // Restricciones de los inputs numericos
    inputError.min = 0;
    inputIter.min = 1;
    inputIter.step = 1;
    inputError.value = "0.001";
    inputIter.value = "100";

    errorMensaje.style.display = "none";

    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelFuncion);
    inputDiv.appendChild(inputFuncion);
    inputDiv.appendChild(labelX0);
    inputDiv.appendChild(inputX0);
    inputDiv.appendChild(labelX1);
    inputDiv.appendChild(inputX1);
    inputDiv.appendChild(labelX2);
    inputDiv.appendChild(inputX2);
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
        const x0 = inputX0.value;
        const x1 = inputX1.value;
        const x2 = inputX2.value;
        const errorMax = inputError.value;
        const maxIter = inputIter.value;

        if (funcion === "") {
            mostrarError(
                errorMensaje,
                "Escriba una funcion."
            );
            return;
        }

        if (x0 === "" || x1 === "" || x2 === "") {
            mostrarError(
                errorMensaje,
                "Escriba las tres aproximaciones iniciales."
            );
            return;
        }

        if (
            Number(x0) === Number(x1) ||
            Number(x0) === Number(x2) ||
            Number(x1) === Number(x2)
        ) {
            mostrarError(
                errorMensaje,
                "Las tres aproximaciones deben ser distintas."
            );
            return;
        }

        if (errorMax === "" || Number(errorMax) <= 0) {
            mostrarError(
                errorMensaje,
                "El error maximo debe ser mayor a cero."
            );
            return;
        }

        if (maxIter === "" || Number(maxIter) < 1) {
            mostrarError(
                errorMensaje,
                "Las iteraciones deben ser al menos 1."
            );
            return;
        }

        errorMensaje.style.display = "none";

        const body = JSON.stringify({
            "function": funcion,
            "x0": Number(x0),
            "x1": Number(x1),
            "x2": Number(x2),
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(
            body,
            "muller"
        );

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        muller_result(respuesta);
    });
}

function muller_result(data) {
    const article = document.querySelector("article");

    // Si ya habia resultados de una corrida anterior, se borran
    const anterior = document.getElementById(
        "result-section-muller"
    );

    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection(
        "result-section-muller",
        "main-section-muller"
    );

    const resultDiv = createDiv(
        "result-div-muller",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";

    resultDiv.appendChild(titleH2);

    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-muller",
            "error-message",
            data.mensaje
                ? data.mensaje
                : "El metodo no encontro una raiz."
        );

        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);

        return;
    }

    const raizSpan = createSpan(
        "raiz-muller",
        "resultado-texto",
        "Raiz aproximada: " + formatearNumero(data.raiz)
    );

    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-muller",
            "resultado-texto",
            data.mensaje
        );

        resultDiv.appendChild(mensajeSpan);
    }

    const encabezados = [
        "i",
        "x0",
        "x1",
        "x2",
        "x",
        "Error absoluto"
    ];

    const tabla = createGenericTable(
        "tabla-muller",
        "tabla-iteraciones",
        encabezados,
        data.tabla,
        (valor, indiceCol) => {
            return indiceCol === 0 ? valor : formatearNumero(valor);
        }
    );

    resultDiv.appendChild(tabla);

    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}