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

export function deflacion_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection(
        "main-section-deflacion",
        "main-section-deflacion"
    );

    const inputDiv = createDiv(
        "input-section-deflacion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Metodo Deflacion (Muller + Division Sintetica)";

    // ----- Funcion -----
    const labelFuncion = createLabel(
        "label-deflacion",
        "label-input",
        "input-funcion-deflacion",
        "Ingrese la funcion (use x como variable):"
    );

    const inputFuncion = createInput(
        "input-funcion-deflacion",
        "input-text",
        "text",
        "Ej: x**3 - 1"
    );

    // ----- Coeficientes -----
    const labelCoef = createLabel(
        "label-coef-deflacion",
        "label-input",
        "input-coef-deflacion",
        "Coeficientes (mayor a menor grado, separados por coma):"
    );

    const inputCoef = createInput(
        "input-coef-deflacion",
        "input-text",
        "text",
        "Ej: 1, 0, 0, -1   |   Ej: 1, 1+1j, 2j"
    );

    // ----- Grado -----
    const labelGrado = createLabel(
        "label-grado-deflacion",
        "label-input",
        "input-grado-deflacion",
        "Grado del polinomio:"
    );

    const inputGrado = createInput(
        "input-grado-deflacion",
        "input-number",
        "number",
        "Ej: 3"
    );

    // ----- Error maximo -----
    const labelError = createLabel(
        "label-error-deflacion",
        "label-input",
        "input-error-deflacion",
        "Error maximo:"
    );

    const inputError = createInput(
        "input-error-deflacion",
        "input-number",
        "number",
        "Ej: 0.0000000001"
    );

    // ----- Maximo de iteraciones -----
    const labelIter = createLabel(
        "label-iter-deflacion",
        "label-input",
        "input-iter-deflacion",
        "Maximo de iteraciones:"
    );

    const inputIter = createInput(
        "input-iter-deflacion",
        "input-number",
        "number",
        "Ej: 100"
    );

    const errorMensaje = createSpan(
        "error-deflacion",
        "error-message",
        ""
    );

    const buttonSend = createButton(
        "send-button",
        "Calcular"
    );

    // Restricciones de los inputs numericos
    inputGrado.min = 1;
    inputGrado.step = 1;
    inputError.min = 0;
    inputIter.min = 1;
    inputIter.step = 1;

    inputError.value = "0.000001";
    inputIter.value = "100";

    errorMensaje.style.display = "none";

    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelFuncion);
    inputDiv.appendChild(inputFuncion);
    inputDiv.appendChild(labelCoef);
    inputDiv.appendChild(inputCoef);
    inputDiv.appendChild(labelGrado);
    inputDiv.appendChild(inputGrado);
    inputDiv.appendChild(labelError);
    inputDiv.appendChild(inputError);
    inputDiv.appendChild(labelIter);
    inputDiv.appendChild(inputIter);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);

    buttonSend.addEventListener("click", async () => {
        const funcion    = inputFuncion.value.trim();
        const coefTexto  = inputCoef.value.trim();
        const grado      = inputGrado.value;
        const errorMax   = inputError.value;
        const maxIter    = inputIter.value;

        // ----- Validacion: funcion -----
        if (funcion === "") {
            mostrarError(errorMensaje, "Escriba una funcion.");
            return;
        }

        // ----- Validacion: coeficientes -----
        if (coefTexto === "") {
            mostrarError(errorMensaje, "Escriba los coeficientes.");
            return;
        }

        let coeficientes;
        try {
            coeficientes = parseCoeficientes(coefTexto);
        } catch (e) {
            mostrarError(
                errorMensaje,
                "Coeficientes invalidos. Use: 1, 0, 0, -1  ó  1, 1+1j, 2j"
            );
            return;
        }

        if (coeficientes.length === 0) {
            mostrarError(errorMensaje, "Debe haber al menos un coeficiente.");
            return;
        }

        // ----- Validacion: grado -----
        if (grado === "" || Number(grado) < 1) {
            mostrarError(errorMensaje, "El grado debe ser al menos 1.");
            return;
        }

        const gradoNum = Number(grado);
        const gradoEsperado = coeficientes.length - 1;

        if (gradoNum !== gradoEsperado) {
            mostrarError(
                errorMensaje,
                `El grado (${gradoNum}) no coincide con los coeficientes ` +
                `(${coeficientes.length} valores → grado ${gradoEsperado}).`
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
            "coeficientes": coeficientes,
            "grado": gradoNum,
            "error_max": Number(errorMax),
            "max_iter": Number(maxIter)
        });

        const respuesta = await conectApi(body, "deflacion");

        if (!respuesta) {
            mostrarError(
                errorMensaje,
                "No se pudo conectar con el servidor."
            );
            return;
        }

        deflacion_result(respuesta);
    });
}

/* ------------------------------------------------------------------ */
/*  Parseo de coeficientes                                            */
/*  Acepta:  "1, 0, 0, -1"        -> [1, 0, 0, -1]  (reales)          */
/*           "1, 1+1j, 2j"        -> ["1","1+1j","2j"] (strings)      */
/*  Regla: si TODOS son reales, se mandan como numero (JSON number).  */
/*         si ALGUNO tiene parte imaginaria, se mandan como string.   */
/* ------------------------------------------------------------------ */
function parseCoeficientes(texto) {
    const partes = texto
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

    if (partes.length === 0) return [];

    let hayComplejos = false;

    for (const p of partes) {
        if (!esNumeroReal(p) && !esComplejo(p)) {
            throw new Error("Formato invalido: " + p);
        }
        if (!esNumeroReal(p)) hayComplejos = true;
    }

    if (hayComplejos) {
        // Se mandan como strings; Pydantic los convertira a complex
        return partes.map(p => String(p));
    }

    // Todos reales -> numeros
    return partes.map(p => Number(p));
}

// ¿Es un numero real valido? "1", "-2.5", "0.001", "1e-3"...
function esNumeroReal(str) {
    return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(str);
}

// ¿Es un complejo valido? Formatos aceptados:
//   1+2j, 1-2j, -1+2j, 2j, -2j, 1j, 1+2.5j, 1.5-0.3j
function esComplejo(str) {
    return /^-?(\d+(\.\d+)?)?([+-]\d+(\.\d+)?)?j$/.test(str) ||
           /^-?\d+(\.\d+)?[+-]\d+(\.\d+)?j$/.test(str);
}

/* ------------------------------------------------------------------ */
/*  Render de resultados                                              */
/* ------------------------------------------------------------------ */
function deflacion_result(data) {
    const article = document.querySelector("article");

    const anterior = document.getElementById("result-section-deflacion");
    if (anterior) anterior.remove();

    const sectionResult = createSection(
        "result-section-deflacion",
        "main-section-deflacion"
    );

    const resultDiv = createDiv(
        "result-div-deflacion",
        "inputs-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);

    // ---- Caso sin tabla ----
    if (!data || !data.tabla || data.tabla.length === 0) {
        const aviso = createSpan(
            "aviso-deflacion",
            "error-message",
            data && data.mensaje
                ? data.mensaje
                : "El metodo no encontro raices."
        );
        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);
        return;
    }

    // ---- Funcion evaluada ----
    if (data.funcion) {
        const fSpan = createSpan(
            "funcion-deflacion",
            "resultado-texto",
            "Funcion: " + data.funcion
        );
        resultDiv.appendChild(fSpan);
    }

    // ---- APLANAR: convertir cada fila a un array plano ----
    //   {raiz:1, valor:{real:1, imag:-4.9e-21}}
    //     →  [1, "1.000000 + 0.000000j"]
    const filas = data.tabla.map(fila => [
        fila.raiz,
        formatearComplejo(fila.valor)
    ]);

    const encabezados = ["Raiz", "Valor"];

    const tabla = createGenericTable(
        "tabla-deflacion",
        "tabla-iteraciones",
        encabezados,
        filas,
        (valor, indiceCol) => {
            // Ya viene todo formateado en `filas`, solo devolvemos tal cual
            return valor;
        }
    );

    resultDiv.appendChild(tabla);
    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}

/* ------------------------------------------------------------------ */
/*  Formato de un numero complejo {real, imag} → string legible       */
/* ------------------------------------------------------------------ */
function formatearComplejo(valor) {
    if (valor === null || valor === undefined) return "—";

    // Caso: objeto {real, imag}
    if (typeof valor === "object" && "real" in valor && "imag" in valor) {
        const re = valor.real;
        const im = valor.imag;

        // Si la parte imaginaria es ~0, mostrar solo el real
        if (Math.abs(im) < 1e-12) {
            return formatearNumero(re);
        }

        // Signo de la parte imaginaria
        const signo = im >= 0 ? "+" : "-";
        const imAbs = Math.abs(im);

        return `${formatearNumero(re)} ${signo} ${formatearNumero(imAbs)}j`;
    }

    // Caso: número real
    if (typeof valor === "number") {
        return formatearNumero(valor);
    }

    // Caso: string ya formateado
    return String(valor);
}