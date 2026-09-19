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

export function biseccion_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-biseccion",
        "main-section-biseccion"
    );

    const inputDiv = createDiv(
        "input-section-biseccion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Metodo Biseccion.";

    // ----- Funcion -----
    const labelFuncion = createLabel(
        "label-biseccion",
        "label-input",
        "input-funcion-biseccion",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-biseccion",
        "input-text",
        "text",
        "Ej: x**3 - x - 2"
    );

    // ----- a -----
    const labelA = createLabel(
        "label-a-biseccion",
        "label-input",
        "input-a-biseccion",
        "Limite inferior a:"
    );

    const inputA = createInput(
        "input-a-biseccion",
        "input-number",
        "number",
        "Ej: 1"
    );

    // ----- b -----
    const labelB = createLabel(
        "label-b-biseccion",
        "label-input",
        "input-b-biseccion",
        "Limite superior b:"
    );

    const inputB = createInput(
        "input-b-biseccion",
        "input-number",
        "number",
        "Ej: 2"
    );

    // ----- Error maximo -----
    const labelError = createLabel(
        "label-error-biseccion",
        "label-input",
        "input-error-biseccion",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-biseccion",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    // ----- Maximo de iteraciones -----
    const labelIter = createLabel(
        "label-iter-biseccion",
        "label-input",
        "input-iter-biseccion",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-biseccion",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-biseccion",
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
        const funcion  = inputFuncion.value.trim();
        const a        = inputA.value;
        const b        = inputB.value;
        const errorMax = inputError.value;
        const maxIter  = inputIter.value;

        // ----- Validacion: funcion -----
        if (funcion === "") {
            mostrarError(errorMensaje, "Escriba una funcion.");
            return;
        }

        // ----- Validacion: limites a y b -----
        if (a === "" || b === "") {
            mostrarError(
                errorMensaje,
                "Escriba los limites a y b del intervalo."
            );
            return;
        }

        const aNum = Number(a);
        const bNum = Number(b);

        if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
            mostrarError(
                errorMensaje,
                "Los limites deben ser numeros validos."
            );
            return;
        }

        if (aNum === bNum) {
            mostrarError(
                errorMensaje,
                "Los limites a y b deben ser distintos."
            );
            return;
        }

        if (aNum > bNum) {
            mostrarError(
                errorMensaje,
                "El limite inferior a debe ser menor que b."
            );
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
            "function": funcion,
            "a": aNum,
            "b": bNum,
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(body, "biseccion");

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        biseccion_result(respuesta);
    });
}

/* ------------------------------------------------------------------ */
/*  Render de resultados                                              */
/* ------------------------------------------------------------------ */
function biseccion_result(data) {
    const article = document.querySelector("article");

    // Borrar resultados previos
    const anterior = document.getElementById("result-section-biseccion");
    if (anterior) anterior.remove();

    const sectionResult = createSection(
        "result-section-biseccion",
        "main-section-biseccion"
    );

    const resultDiv = createDiv(
        "result-div-biseccion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    // ----- Caso sin raiz -----
    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-biseccion",
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
        "raiz-biseccion",
        "resultado-texto",
        "Raiz aproximada: " + formatearNumero(data.raiz)
    );
    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-biseccion",
            "resultado-texto",
            data.mensaje
        );
        resultDiv.appendChild(mensajeSpan);
    }

    // ----- Tabla de iteraciones -----
    if (data.tabla && data.tabla.length > 0) {
        const encabezados = [
            'i', 
            'a',
            'b',
            'c', 
            'f(a)',
            'f(c)',
            'f(b)', 
            'Error Absoluto'
        ];

        const tabla = createGenericTable(
            "tabla-biseccion",
            "tabla-iteraciones",
            encabezados,
            data.tabla,
            (valor, indiceCol) => {
                // Col 0 = indice (entero), no formatear
                return indiceCol === 0 ? valor : formatearNumero(valor);
            }
        );

        resultDiv.appendChild(tabla);
    }

    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}