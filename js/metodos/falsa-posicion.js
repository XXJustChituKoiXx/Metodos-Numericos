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

export function falsa_posicion_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-falsa-posicion",
        "main-section-falsa-posicion"
    );

    const inputDiv = createDiv(
        "input-section-falsa-posicion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo Falsa Posicion.";

    const labelFuncion = createLabel(
        "label-falsa-posicion",
        "label-input",
        "input-funcion-falsa-posicion",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-falsa-posicion",
        "input-text",
        "text",
        "Ej: x**2 - 3"
    );

    const labelA = createLabel(
        "label-a-falsa-posicion",
        "label-input",
        "input-a-falsa-posicion",
        "x0:"
    );

    const inputA = createInput(
        "input-a-falsa-posicion",
        "input-number",
        "number",
        "Ej: 1"
    );

    const labelB = createLabel(
        "label-b-falsa-posicion",
        "label-input",
        "input-b-falsa-posicion",
        "x1:"
    );

    const inputB = createInput(
        "input-b-falsa-posicion",
        "input-number",
        "number",
        "Ej: 2"
    );

    const labelError = createLabel(
        "label-error-falsa-posicion",
        "label-input",
        "input-error-falsa-posicion",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-falsa-posicion",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    const labelIter = createLabel(
        "label-iter-falsa-posicion",
        "label-input",
        "input-iter-falsa-posicion",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-falsa-posicion",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-falsa-posicion",
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
    inputDiv.appendChild(labelA);
    inputDiv.appendChild(inputA);
    inputDiv.appendChild(labelB);
    inputDiv.appendChild(inputB);
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
        const b = inputB.value;
        const errorMax = inputError.value;
        const maxIter = inputIter.value;

        if (funcion === "") {
            mostrarError(
                errorMensaje,
                "Escriba una funcion."
            );
            return;
        }

        if (a === "" || b === "") {
            mostrarError(
                errorMensaje,
                "Escriba las dos aproximaciones iniciales."
            );
            return;
        }

        if (Number(a) === Number(b)) {
            mostrarError(
                errorMensaje,
                "Las dos aproximaciones deben ser distintas."
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
            "funcion": funcion,
            "x0": Number(a),
            "x1": Number(b),
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(
            body,
            "falsa_posicion"
        );

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        falsa_posicion_result(respuesta);
    });
}

function falsa_posicion_result(data) {
    const article = document.querySelector("article");

    // Si ya habia resultados de una corrida anterior, se borran
    const anterior = document.getElementById(
        "result-section-falsa-posicion"
    );

    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection(
        "result-section-falsa-posicion",
        "main-section-falsa-posicion"
    );

    const resultDiv = createDiv(
        "result-div-falsa-posicion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";

    resultDiv.appendChild(titleH2);

    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-falsa-posicion",
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
        "raiz-falsa-posicion",
        "resultado-texto",
        "Raiz aproximada: " + formatearNumero(data.raiz)
    );

    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-falsa-posicion",
            "resultado-texto",
            data.mensaje
        );

        resultDiv.appendChild(mensajeSpan);
    }

    const encabezados = [
        "i",
        "x0",
        "x1",
        "xn",
        "signo f(x0)*f(xn)",
        "signo f(x1)*f(xn)",
        "Error absoluto"
    ];

    const tabla = createGenericTable(
        "tabla-falsa-posicion",
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