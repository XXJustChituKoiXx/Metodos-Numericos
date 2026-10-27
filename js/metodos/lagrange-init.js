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
 
 
export function lagrange_init() {
    const article = document.querySelector("article");
 
    const sectionInput = createSection("main-section-lagrange", "main-section-lagrange");
    const inputDiv = createDiv("input-section-lagrange", "inputs-div");
    const titleH2 = document.createElement("h2");
 
    titleH2.textContent = "Interpolacion de Lagrange";
 
    const labelPuntos = createLabel(
        "label-puntos-lagrange",
        "label-input",
        "input-puntos-lagrange",
        "Puntos (x,y) separados por punto y coma:"
    );
 
    const inputPuntos = createInput(
        "input-puntos-lagrange",
        "input-text",
        "text",
        "Ej: 1,2 ; 2,5 ; 4,17"
    );
 
    const labelEvaluar = createLabel(
        "label-evaluar-lagrange",
        "label-input",
        "input-evaluar-lagrange",
        "Evaluar el polinomio en x (opcional):"
    );
 
    const inputEvaluar = createInput(
        "input-evaluar-lagrange",
        "input-number",
        "number",
        "Ej: 3"
    );
 
    const errorMensaje = createSpan(
        "error-lagrange",
        "error-message",
        ""
    );
 
    const buttonSend = createButton("send-button", "Calcular");
 
    inputEvaluar.step = "any";
 
    errorMensaje.style.display = "none";
 
    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelPuntos);
    inputDiv.appendChild(inputPuntos);
    inputDiv.appendChild(labelEvaluar);
    inputDiv.appendChild(inputEvaluar);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);
 
    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);
 
    buttonSend.addEventListener("click", async () => {
        const texto = inputPuntos.value.trim();
        const xEvaluar = inputEvaluar.value;
 
        if (texto === "") {
            mostrarError(errorMensaje, "Escriba al menos dos puntos.");
            return;
        }
 
        // Cada par viene separado por ';' y dentro lleva x,y
        const pares = texto.split(";").filter((p) => p.trim() !== "");
 
        if (pares.length < 2) {
            mostrarError(errorMensaje, "Escriba al menos dos puntos, separados por punto y coma.");
            return;
        }
 
        const puntos = [];
        const vistas = [];
 
        for (const par of pares) {
            const partes = par.replace(/[()]/g, "").split(",").filter((c) => c.trim() !== "");
 
            if (partes.length !== 2) {
                mostrarError(errorMensaje, "Cada punto debe tener dos numeros, por ejemplo 1,2");
                return;
            }
 
            const x = Number(partes[0]);
            const y = Number(partes[1]);
 
            if (!isFinite(x) || !isFinite(y)) {
                mostrarError(errorMensaje, "Los puntos deben ser numeros.");
                return;
            }
 
            if (vistas.includes(x)) {
                mostrarError(errorMensaje, "La x = " + x + " esta repetida. Cada x debe aparecer una sola vez.");
                return;
            }
 
            vistas.push(x);
            puntos.push([x, y]);
        }
 
        errorMensaje.style.display = "none";
 
        const body = JSON.stringify({
            "puntos": puntos,
            "x_evaluar": xEvaluar === "" ? null : Number(xEvaluar)
        });
 
        const respuesta = await conectApi(body, "lagrange");
 
        if (!respuesta) {
            mostrarError(errorMensaje, "No se pudo conectar con el servidor.");
            return;
        }
 
        lagrange_result(respuesta);
    });
}
 
 
export function lagrange_result(data) {
    const article = document.querySelector("article");
 
    const anterior = document.getElementById("result-section-lagrange");
    if (anterior) {
        anterior.remove();
    }
 
    const sectionResult = createSection("result-section-lagrange", "main-section-lagrange");
    const resultDiv = createDiv("result-div-lagrange", "inputs-div");
    const titleH2 = document.createElement("h2");
 
    titleH2.textContent = "Resultados";
    resultDiv.appendChild(titleH2);
 
    if (data.polinomio === null || data.polinomio === undefined) {
        const aviso = createSpan(
            "aviso-lagrange",
            "error-message",
            data.mensaje ? data.mensaje : "No se pudo construir el polinomio."
        );
        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);
        return;
    }
 
    const polinomioSpan = createSpan(
        "polinomio-lagrange",
        "resultado-texto",
        "P(x) = " + data.polinomio
    );
    resultDiv.appendChild(polinomioSpan);
 
    if (data.grado !== null && data.grado !== undefined) {
        const gradoSpan = createSpan(
            "grado-lagrange",
            "resultado-texto",
            "Grado: " + data.grado
        );
        resultDiv.appendChild(gradoSpan);
    }
 
    if (data.evaluacion) {
        const evalSpan = createSpan(
            "evaluacion-lagrange",
            "resultado-texto",
            "P(" + formatearNumero(data.evaluacion.x) + ") = " + formatearNumero(data.evaluacion.y)
        );
        resultDiv.appendChild(evalSpan);
    }
 
    if (data.mensaje) {
        const mensajeSpan = createSpan(
            "mensaje-lagrange",
            "resultado-texto",
            data.mensaje
        );
        resultDiv.appendChild(mensajeSpan);
    }
 
    const encabezados = ["i", "x(i)", "y(i)", "L(i)(x)"];
 
    const tabla = createGenericTable(
        "tabla-lagrange",
        "tabla-iteraciones",
        encabezados,
        data.tabla,
        (valor, indiceCol) => {
            // la columna 0 es el indice y la 3 es texto, esas no se formatean
            if (indiceCol === 0 || indiceCol === 3) {
                return valor;
            }
            return formatearNumero(valor);
        }
    );
 
    resultDiv.appendChild(tabla);
 
    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);
}
 
