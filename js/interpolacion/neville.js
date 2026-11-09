import {
    createSection, createLabel, createInput, createButton,
    createDiv, createSpan, createGenericTable
} from "../factories.js";
import { mostrarError, formatearNumero } from "../auxiliares.js";
import { conectApi } from "../conection.js";

export function neville_init() {
    const article = document.querySelector("article");

    const sectionInput = createSection("main-section-neville", "main-section-neville");
    const inputDiv = createDiv("input-section-neville", "inputs-div");

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Metodo de Neville.";

    const labelPuntos = createLabel("label-puntos-neville", "label-input",
        "input-puntos-neville", "Ingrese los puntos 'x,y' separados por ';':");
    const inputPuntos = createInput("input-puntos-neville", "input-text", "text",
        "Ej: 0,1; 0.6,0.825; 0.9,0.621; 1.1,0.453");

    const labelX = createLabel("label-x-neville", "label-input",
        "input-x-neville", "x a evaluar:");
    const inputX = createInput("input-x-neville", "input-number", "number", "Ej: 0.8");

    const errorMensaje = createSpan("error-neville", "error-message", "");
    errorMensaje.style.display = "none";

    const buttonSend = createButton("send-button", "Calcular");

    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelPuntos);
    inputDiv.appendChild(inputPuntos);
    inputDiv.appendChild(labelX);
    inputDiv.appendChild(inputX);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);

    buttonSend.addEventListener("click", async () => {
        const puntos = inputPuntos.value.trim();
        const xEval  = inputX.value;

        if (puntos === "") {
            mostrarError(errorMensaje, "Ingrese al menos un punto."); return;
        }
        if (xEval === "") {
            mostrarError(errorMensaje, "Ingrese un valor de x."); return;
        }
        errorMensaje.style.display = "none";

        const body = JSON.stringify({
            puntos: puntos,
            x_evaluar: Number(xEval)
        });
        const respuesta = await conectApi(body, "neville");
        if (!respuesta) {
            mostrarError(errorMensaje, "No se pudo conectar con el servidor.");
            return;
        }
        neville_result(respuesta);
    });
}

function neville_result(data) {
    const article = document.querySelector("article");
    const anterior = document.getElementById("result-section-neville");
    if (anterior) anterior.remove();

    const section = createSection("result-section-neville", "main-section-neville");
    const div = createDiv("result-div-neville", "inputs-div");

    const h2 = document.createElement("h2");
    h2.textContent = "Resultados";
    div.appendChild(h2);

    if (data.resultado === null || data.resultado === undefined) {
        div.appendChild(createSpan("aviso-neville", "error-message",
            data.mensaje || "No se pudo interpolar."));
        section.appendChild(div);
        article.appendChild(section);
        return;
    }

    div.appendChild(createSpan("raiz-neville", "resultado-texto",
        "P(x) = " + formatearNumero(data.resultado)));

    if (data.mensaje) {
        div.appendChild(createSpan("msg-neville", "resultado-texto", data.mensaje));
    }

    if (data.tabla && data.tabla.length > 0) {
        const headers = ["i"];
        for (let j = 0; j < data.n; j++) headers.push(`N[i][${j}]`);

        const tabla = createGenericTable(
            "tabla-neville",
            "tabla-iteraciones",
            headers,
            data.tabla,
            (valor, indiceCol) => {
                if (valor === null || valor === undefined) return "";
                return indiceCol === 0 ? valor : formatearNumero(valor);
            }
        );
        div.appendChild(tabla);
    }

    section.appendChild(div);
    article.appendChild(section);
}