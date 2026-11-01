import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createSpan,
    createGenericTable
} from "../factories.js";
import { mostrarError, formatearNumero, formatearPolinomio } from "../auxiliares.js";
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
        "",
        "Ingrese los puntos (x, y):"
    );
 
    const contenedorPuntos = createDiv("contenedor-filas-puntos", "contenedor-filas");
    contenedorPuntos.style.display = "flex";
    contenedorPuntos.style.flexDirection = "column";
    contenedorPuntos.style.gap = "8px";
    contenedorPuntos.style.margin = "10px 0";

    const btnAgregar = createButton("btn-agregar-punto", "+ Agregar Punto");
    btnAgregar.type = "button";

    function agregarFilaPuntos(valX = "", valY = "") {
        const filaDiv = createDiv("", "fila-punto");
        filaDiv.style.display = "flex";
        filaDiv.style.gap = "10px";
        filaDiv.style.alignItems = "center";

        const inputX = createInput("", "input-text", "number", "Valor X");
        inputX.value = valX;
        inputX.step = "any";

        const inputY = createInput("", "input-text", "number", "Valor Y");
        inputY.value = valY;
        inputY.step = "any";

        const btnEliminar = createButton("btn-eliminar-fila", "X");
        btnEliminar.style.backgroundColor = "#ff4d4d";
        btnEliminar.style.color = "white";
        btnEliminar.type = "button";
        
        btnEliminar.addEventListener("click", () => {
            if (contenedorPuntos.children.length > 2) {
                filaDiv.remove();
            } else {
                alert("Debes mantener al menos 2 puntos para interpolar.");
            }
        });

        filaDiv.appendChild(inputX);
        filaDiv.appendChild(inputY);
        filaDiv.appendChild(btnEliminar);
        contenedorPuntos.appendChild(filaDiv);
    }

    agregarFilaPuntos();
    agregarFilaPuntos();

    btnAgregar.addEventListener("click", () => {
        agregarFilaPuntos();
    });
 
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
    inputEvaluar.step = "any";
 
    const errorMensaje = createSpan(
        "error-lagrange",
        "error-message",
        ""
    );
    errorMensaje.style.display = "none";
 
    const buttonSend = createButton("send-button", "Calcular");
 
    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(labelPuntos);
    inputDiv.appendChild(contenedorPuntos);
    inputDiv.appendChild(btnAgregar);
    inputDiv.appendChild(labelEvaluar);
    inputDiv.appendChild(inputEvaluar);
    inputDiv.appendChild(errorMensaje);
    inputDiv.appendChild(buttonSend);
 
    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);
 
    buttonSend.addEventListener("click", async () => {
        errorMensaje.style.display = "none";
        const xEvaluar = inputEvaluar.value;
 
        const filas = contenedorPuntos.querySelectorAll(".fila-punto");
        const puntos = [];
        const vistas = [];

        for (const fila of filas) {
            const inputs = fila.querySelectorAll("input");
            const valX = inputs[0].value.trim();
            const valY = inputs[1].value.trim();

            if (valX === "" || valY === "") {
                mostrarError(errorMensaje, "Complete todos los campos de x e y.");
                return;
            }

            const x = Number(valX);
            const y = Number(valY);

            if (!isFinite(x) || !isFinite(y)) {
                mostrarError(errorMensaje, "Los valores deben ser números válidos.");
                return;
            }

            if (vistas.includes(x)) {
                mostrarError(errorMensaje, `La x = ${x} está repetida. Cada x debe ser única.`);
                return;
            }

            vistas.push(x);
            puntos.push([x, y]);
        }

        if (puntos.length < 2) {
            mostrarError(errorMensaje, "Debe ingresar al menos dos puntos.");
            return;
        }
 
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
 
    if (!data.coeficientes || data.coeficientes.length === 0) {
        const aviso = createSpan(
            "aviso-lagrange",
            "error-message",
            "No se pudo construir el polinomio."
        );
        resultDiv.appendChild(aviso);
        sectionResult.appendChild(resultDiv);
        article.appendChild(sectionResult);
        return;
    }
 
    const polinomioTexto = formatearPolinomio(data.coeficientes);
    const polinomioSpan = createSpan(
        "polinomio-lagrange",
        "resultado-texto",
        "P(x) = " + polinomioTexto
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
 
    const encabezados = ["i", "x(i)", "y(i)", "L(i)(x)"];
    
    const tablaFormateada = data.tabla.map(fila => {
        return [
            fila[0],
            fila[1],
            fila[2],
            formatearPolinomio(fila[3])
        ];
    });

    const tabla = createGenericTable(
        "tabla-lagrange",
        "tabla-iteraciones",
        encabezados,
        tablaFormateada,
        (valor, indiceCol) => {
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