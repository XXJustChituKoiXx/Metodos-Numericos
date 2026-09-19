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

export function steffensen_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-steffensen",
        "main-section-steffensen"
    );

    const inputDiv = createDiv(
        "input-section-steffensen",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Metodo Steffensen.";

    // ----- Funcion -----
    const labelFuncion = createLabel(
        "label-steffensen",
        "label-input",
        "input-funcion-steffensen",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-steffensen",
        "input-text",
        "text",
        "Ej: x**3 - x - 2"
    );

    // ----- Error maximo -----
    const labelError = createLabel(
        "label-error-steffensen",
        "label-input",
        "input-error-steffensen",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-steffensen",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    // ----- Maximo de iteraciones -----
    const labelIter = createLabel(
        "label-iter-steffensen",
        "label-input",
        "input-iter-steffensen",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-steffensen",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-steffensen",
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
    inputDiv.appendChild(labelError);
    inputDiv.appendChild(inputError);
    inputDiv.appendChild(labelIter);
    inputDiv.appendChild(inputIter);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);

    buttonSend.addEventListener("click", async () => {
        const funcion  = inputFuncion.value.trim();
        const errorMax = inputError.value;
        const maxIter  = inputIter.value;

        // ----- Validacion: funcion -----
        if (funcion === "") {
            mostrarError(errorMensaje, "Escriba una funcion.");
            return;
        }

        // ----- Validacion: error maximo -----
        if (errorMax === "" || Number(errorMax) <= 0) {
            mostrarError(
                errorMensaje,
                "El error maximo debe ser mayor a cero."
            );
            return;
        }

        // ----- Validacion: iteraciones -----
        if (maxIter === "" || Number(maxIter) < 1) {
            mostrarError(
                errorMensaje,
                "Las iteraciones deben ser al menos 1."
            );
            return;
        }

        errorMensaje.style.display = "none";

        const body = JSON.stringify({
            "function":  funcion,
            "error_max": Number(errorMax),
            "max_iter":  Number(maxIter)
        });

        const respuesta = await conectApi(body, "steffensen");

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        steffensen_result(respuesta);
    });
}

/* ------------------------------------------------------------------ */
/*  Render de resultados                                              */
/* ------------------------------------------------------------------ */
function steffensen_result(data) {
    const article = document.querySelector("article");

    // Borrar resultados previos
    const anterior = document.getElementById("result-section-steffensen");
    if (anterior) anterior.remove();

    const sectionResult = createSection(
        "result-section-steffensen",
        "main-section-steffensen"
    );

    const resultDiv = createDiv(
        "result-div-steffensen",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    // ----- Caso sin raiz -----
    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-steffensen",
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

    // ----- Raiz encontrada -----
    const raizSpan = createSpan(
        "raiz-steffensen",
        "resultado-texto",
        "Raiz aproximada: " + formatearNumero(data.raiz)
    );
    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-steffensen",
            "resultado-texto",
            data.mensaje
        );
        resultDiv.appendChild(mensajeSpan);
    }

    // ----- Tabla de iteraciones -----
    if (data.tabla && data.tabla.length > 0) {
        const encabezados = [
            "i",
            "Pn",
            "P n+1",
            "P n+2",
            "Error"
        ];

        const tabla = createGenericTable(
            "tabla-steffensen",
            "tabla-iteraciones",
            encabezados,
            data.tabla,
            (valor, indiceCol) => {
                // Col 0 = indice entero
                return indiceCol === 0 ? valor : formatearNumero(valor);
            }
        );

        resultDiv.appendChild(tabla);
    }

    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}