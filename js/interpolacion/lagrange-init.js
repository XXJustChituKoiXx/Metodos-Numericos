import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createSpan,
    createGenericTable,
    createPolynomial,
    createChartCanvas,
    renderizarGraficaMultiplesPolinomios
} from "../factories.js";
import { mostrarError, formatearNumero} from "../auxiliares.js";
import { conectApi } from "../conection.js";
 
export function lagrange_init() {
    const article = document.querySelector("article");
    article.innerHTML = "";
 
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
    contenedorPuntos.className = "contenedor-filas";

    const btnAgregar = createButton("btn-agregar-punto", "+ Agregar Punto");
    btnAgregar.className = "send-button btn-azul";
    btnAgregar.type = "button";

    function actualizarBotonesEliminar() {
        const filas = contenedorPuntos.querySelectorAll(".fila-punto");
        filas.forEach((fila, index) => {
            const btnEliminar = fila.querySelector(".btn-eliminar-fila");
            if (btnEliminar) {
                if (filas.length > 2 && index >= 2) {
                    btnEliminar.style.display = "inline-block";
                } else {
                    btnEliminar.style.display = "none";
                }
            }
        });
    }

    function agregarFilaPuntos(valX = "", valY = "") {
        const filaDiv = createDiv("", "fila-punto");
        filaDiv.className = "fila-punto";

        const inputX = createInput("", "input-text", "number", "Valor X");
        inputX.value = valX;
        inputX.step = "any";

        const inputY = createInput("", "input-text", "number", "Valor Y");
        inputY.value = valY;
        inputY.step = "any";

        const btnEliminar = createButton("btn-eliminar-fila", "X");
        btnEliminar.className = "btn-eliminar-fila btn-azul-eliminar";
        btnEliminar.type = "button";
        
        btnEliminar.addEventListener("click", () => {
            if (contenedorPuntos.children.length > 2) {
                filaDiv.remove();
                actualizarBotonesEliminar();
            }
        });

        filaDiv.appendChild(inputX);
        filaDiv.appendChild(inputY);
        filaDiv.appendChild(btnEliminar);
        contenedorPuntos.appendChild(filaDiv);
        actualizarBotonesEliminar();
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
 
    const anteriorRes = document.getElementById("result-section-lagrange");
    if (anteriorRes) anteriorRes.remove();

    const anteriorGraf = document.getElementById("grafica-section-lagrange");
    if (anteriorGraf) anteriorGraf.remove();
 
    const sectionResult = createSection("result-section-lagrange", "main-section-lagrange");
    sectionResult.className = "main-section-lagrange section-resultados";
    
    const resultDiv = createDiv("result-div-lagrange", "inputs-div container-res");
    
    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Resultados del Polinomio";
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
 
    const cardPolinomio = createDiv("", "resultado-card");
    const labelPoly = createLabel("", "", "", "Polinomio Interpolante P(x):");
    cardPolinomio.appendChild(labelPoly);
    const polyElement = createPolynomial("polinomio-lagrange", "resultado-polinomio", data.coeficientes);
    cardPolinomio.appendChild(polyElement);
    resultDiv.appendChild(cardPolinomio);
 
    const cardInfo = createDiv("", "resultado-card");
    const gradoSpan = createSpan(
        "grado-lagrange",
        "resultado-texto",
        "Grado del polinomio: " + data.grado
    );
    cardInfo.appendChild(gradoSpan);
 
    if (data.evaluacion) {
        const evalSpan = createSpan(
            "evaluacion-lagrange",
            "resultado-texto",
            `Evaluación -> P(${formatearNumero(data.evaluacion.x)}) = ${formatearNumero(data.evaluacion.y)}`
        );
        cardInfo.appendChild(evalSpan);
    }
    resultDiv.appendChild(cardInfo);
 
    const encabezados = ["i", "x(i)", "y(i)", "L(i)(x)"];
    
    const tablaFormateada = data.tabla.map(fila => {
        return [
            fila[0],
            fila[1],
            fila[2],
            fila[3]
        ];
    });

    const tabla = createGenericTable(
        "tabla-lagrange",
        "tabla-iteraciones",
        encabezados,
        tablaFormateada,
        (valor, indiceCol, indiceFila) => {
            if (indiceCol === 0) return valor;
            if (indiceCol === 1 || indiceCol === 2) return formatearNumero(valor);
            if (indiceCol === 3) {
                return createPolynomial("", "poly-celda", valor);
            }
            return valor;
        }
    );
 
    resultDiv.appendChild(tabla);
    sectionResult.appendChild(resultDiv);
    article.appendChild(sectionResult);

    const sectionGrafica = createChartCanvas(
        "grafica-section-lagrange", 
        "lagrangeChart", 
        "Gráfica del Polinomio"
    );
    article.appendChild(sectionGrafica);

    const listaPolinomios = [data.coeficientes];
    const puntosOriginales = data.tabla.map(f => [f[1], f[2]]);
    const listaIntervalos = [puntosOriginales];

    renderizarGraficaMultiplesPolinomios("lagrangeChart", listaPolinomios, listaIntervalos);
}