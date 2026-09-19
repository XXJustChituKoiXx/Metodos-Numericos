import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createSpan,
    createGenericTable
} from "../factories.js";
import {mostrarError,formatearNumero} from "../auxiliares.js";
import { conectApi } from "../conection.js";

// ============================================================
// FUNCION 1: arma el section de los inputs
// Se invoca desde main.js con el boton del menu
// ============================================================
export function secante_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection("main-section-secante", "main-section-secante");
    const inputDiv = createDiv("input-section-secante", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo de la Secante";

    // --- funcion ---
    const labelFuncion = createLabel(
        "label-funcion-secante",
        "label-input",
        "input-funcion-secante",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-secante",
        "input-text",
        "text",
        "Ej: x**2 - 3"
    );

    // --- primer valor inicial ---
    const labelA = createLabel(
        "label-a-secante",
        "label-input",
        "input-a-secante",
        "Primera aproximacion inicial:"
    );

    const inputA = createInput(
        "input-a-secante",
        "input-number",
        "number",
        "Ej: 1"
    );

    // --- segundo valor inicial ---
    const labelB = createLabel(
        "label-b-secante",
        "label-input",
        "input-b-secante",
        "Segunda aproximacion inicial:"
    );

    const inputB = createInput(
        "input-b-secante",
        "input-number",
        "number",
        "Ej: 2"
    );

    // --- error maximo ---
    const labelError = createLabel(
        "label-error-secante",
        "label-input",
        "input-error-secante",
        "Error maximo (tolerancia):"
    );

    const inputError = createInput(
        "input-error-secante",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    // --- maximo de iteraciones ---
    const labelIter = createLabel(
        "label-iter-secante",
        "label-input",
        "input-iter-secante",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-secante",
        "input-number",
        "number",
        "Ej: 100"
    );

    // --- mensajes de error del formulario ---
    const errorMensaje = createSpan(
        "error-secante",
        "error-message",
        ""
    );

    const buttonSend = createButton("send-button", "Calcular");

    // Restricciones de los inputs numericos
    inputError.min = 0;
    inputError.step = "any";
    inputA.step = "any";
    inputB.step = "any";
    inputIter.min = 1;
    inputIter.step = 1;

    // Valores por defecto, mismos que la plantilla de Python
    inputError.value = "0.001";
    inputIter.value = "100";

    errorMensaje.style.display = "none";

    // Armado del div
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

    // --- evento del boton ---
    buttonSend.addEventListener("click", async () => {
        const funcion = inputFuncion.value.trim();
        const a = inputA.value;
        const b = inputB.value;
        const errorMax = inputError.value;
        const maxIter = inputIter.value;

        // Validaciones antes de molestar al servidor
        if (funcion === "") {
            mostrarError(errorMensaje, "Escriba una funcion.");
            return;
        }

        if (a === "" || b === "") {
            mostrarError(errorMensaje, "Escriba las dos aproximaciones iniciales.");
            return;
        }

        if (Number(a) === Number(b)) {
            mostrarError(errorMensaje, "Las dos aproximaciones deben ser distintas.");
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
            "b": Number(b),
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(body, "secante");

        if (!respuesta) {
            mostrarError(errorMensaje, "No se pudo conectar con el servidor.");
            return;
        }

        secante_result(respuesta);
    });
}


// ============================================================
// FUNCION 2: arma el section de los resultados
// Recibe la respuesta del endpoint
// ============================================================

function secante_result(data) {
    const article = document.querySelector("article");

    // Si ya habia resultados de una corrida anterior, se borran
    const anterior = document.getElementById("result-section-secante");
    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection("result-section-secante", "main-section-secante");
    const resultDiv = createDiv("result-div-secante", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    // --- caso sin raiz: se muestra el mensaje y no hay tabla ---
    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-secante",
            "error-message",
            data.mensaje ? data.mensaje : "El metodo no encontro una raiz."
        );

        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);

        return;
    }

    // --- raiz encontrada ---
    const raizSpan = createSpan(
        "raiz-secante",
        "resultado-texto",
        "Raiz aproximada: " + data.raiz
    );

    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-secante",
            "resultado-texto",
            data.mensaje
        );

        resultDiv.appendChild(mensajeSpan);
    }

    // --- tabla de iteraciones ---
    const encabezados = [
        "i",
        "x(i-1)",
        "x(i)",
        "x(i+1)",
        "Error absoluto"
    ];

    const tabla = createGenericTable(
        "tabla-secante",
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