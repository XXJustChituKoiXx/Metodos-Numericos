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


export function horner_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection("main-section-horner", "main-section-horner");
    const inputDiv = createDiv("input-section-horner", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Metodo de Horner";

    const labelCoeficientes = createLabel(
        "label-coeficientes-horner",
        "label-input",
        "input-coeficientes-horner",
        "Coeficientes del polinomio, de mayor a menor grado:"
    );

    const inputCoeficientes = createInput(
        "input-coeficientes-horner",
        "input-text",
        "text",
        "Ej: 2, 0, -3, 3, -4"
    );

    const labelA = createLabel(
        "label-a-horner",
        "label-input",
        "input-a-horner",
        "Aproximacion inicial:"
    );

    const inputA = createInput(
        "input-a-horner",
        "input-number",
        "number",
        "Ej: -2"
    );

    const labelError = createLabel(
        "label-error-horner",
        "label-input",
        "input-error-horner",
        "Error maximo (tolerancia):"
    );

    const inputError = createInput(
        "input-error-horner",
        "input-number",
        "number",
        "Ej: 0.001"
    );

    const labelIter = createLabel(
        "label-iter-horner",
        "label-input",
        "input-iter-horner",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-horner",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-horner",
        "error-message",
        ""
    );

    const buttonSend = createButton("send-button", "Calcular");

    // Restricciones de los inputs numericos
    inputError.min = 0;
    inputError.step = "any";
    inputA.step = "any";
    inputIter.min = 1;
    inputIter.step = 1;

    inputError.value = "0.001";
    inputIter.value = "100";

    errorMensaje.style.display = "none";

    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelCoeficientes);
    inputDiv.appendChild(inputCoeficientes);
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
        const coeficientes = inputCoeficientes.value.trim();
        const a = inputA.value;
        const errorMax = inputError.value;
        const maxIter = inputIter.value;

        if (coeficientes === "") {
            mostrarError(errorMensaje, "Escriba los coeficientes del polinomio.");
            return;
        }

        if (coeficientes.split(/[,;\s]+/).filter((c) => c !== "").length < 2) {
            mostrarError(errorMensaje, "Escriba al menos dos coeficientes, el polinomio debe ser de grado 1 o mayor.");
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
            "coeficientes": coeficientes,
            "a": Number(a),
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(body, "horner");

        if (!respuesta) {
            mostrarError(errorMensaje, "No se pudo conectar con el servidor.");
            return;
        }

        horner_result(respuesta);
    });
}

export function horner_result(data) {
    const article = document.querySelector("article");

    const anterior = document.getElementById("result-section-horner");
    if (anterior) {
        anterior.remove();
    }

    const sectionResult = createSection("result-section-horner", "main-section-horner");
    const resultDiv = createDiv("result-div-horner", "inputs-div");
    const titleH2 = document.createElement("h2");

    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    if (data.raiz === null || data.raiz === undefined) {
        const aviso = createSpan(
            "aviso-horner",
            "error-message",
            data.mensaje ? data.mensaje : "El metodo no encontro una raiz."
        );
        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);
        return;
    }

    const raizSpan = createSpan(
        "raiz-horner",
        "resultado-texto",
        "Raiz aproximada: " + data.raiz
    );
    resultDiv.appendChild(raizSpan);

    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-horner",
            "resultado-texto",
            data.mensaje
        );
        resultDiv.appendChild(mensajeSpan);
    }

    if (data.cociente && data.cociente.length > 0) {
        const cocienteSpan = createSpan(
            "cociente-horner",
            "resultado-texto",
            "Coeficientes de Q(x): " + data.cociente.map(formatearNumero).join(", ")
        );
        resultDiv.appendChild(cocienteSpan);
    }

    const encabezados = [
        "i",
        "x(i)",
        "P(x(i))",
        "P'(x(i))",
        "x(i+1)",
        "Error absoluto"
    ];

    const tabla = createGenericTable(
        "tabla-horner",
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
