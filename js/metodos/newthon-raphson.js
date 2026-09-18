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

export function newton_raphson_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-newton-raphson",
        "main-section-newton-raphson"
    );

    const inputDiv = createDiv(
        "input-section-newton-raphson",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo Newton Raphson.";

    const labelFuncion = createLabel(
        "label-newton-raphson",
        "label-input",
        "input-funcion-newton-raphson",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-newton-raphson",
        "input-text",
        "text",
        "Ej: x**2 - 3"
    );

    const labelX0 = createLabel(
        "label-x0-newton-raphson",
        "label-input",
        "input-x0-newton-raphson",
        "x0:"
    );

    const inputX0 = createInput(
        "input-x0-newton-raphson",
        "input-number",
        "number",
        "Ej: 1"
    );

    const labelError = createLabel(
        "label-error-newton-raphson",
        "label-input",
        "input-error-newton-raphson",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-newton-raphson",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    const labelIter = createLabel(
        "label-iter-newton-raphson",
        "label-input",
        "input-iter-newton-raphson",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-newton-raphson",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-newton-raphson",
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
        const errorMax = inputError.value;
        const maxIter = inputIter.value;

        if (funcion === "") {
            mostrarError(
                errorMensaje,
                "Escriba una funcion."
            );
            return;
        }

        if (x0 === "") {
            mostrarError(
                errorMensaje,
                "Escriba la aproximacion inicial."
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
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(
            body,
            "newton_raphson"
        );

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        newton_raphson_result(respuesta);
    });
}

function newton_raphson_result(data) {
    const article = document.querySelector("article");

    // Si ya habia resultados de una corrida anterior, se borran
    const anterior = document.getElementById(
        "result-section-newton-raphson"
    );

    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection(
        "result-section-newton-raphson",
        "main-section-newton-raphson"
    );

    const resultDiv = createDiv(
        "result-div-newton-raphson",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";

    resultDiv.appendChild(titleH2);

    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-newton-raphson",
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
        "raiz-newton-raphson",
        "resultado-texto",
        "Raiz aproximada: " + formatearNumero(data.raiz)
    );

    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-newton-raphson",
            "resultado-texto",
            data.mensaje
        );

        resultDiv.appendChild(mensajeSpan);
    }

    const encabezados = [
        "i",
        "x0",
        "f(x)",
        "f'(x)",
        "xn",
        "Error absoluto"
    ];

    const tabla = createGenericTable(
        "tabla-newton-raphson",
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