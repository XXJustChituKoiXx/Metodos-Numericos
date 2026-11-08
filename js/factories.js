function createSection(idSeccion, claseCss) {
    let section = document.createElement("section");
    section.className = claseCss;
    section.id = idSeccion;
    return section;
}

function createLabel(idLabel, claseCss, idAsociado, texto) {
    let label = document.createElement("label");
    label.id = idLabel;
    label.className = claseCss;
    label.htmlFor = idAsociado;
    label.textContent = texto;
    return label;
}

function createInput(idInput, claseCss, tipo, textoPlaceholder) {
    let input = document.createElement("input");
    input.id = idInput;
    input.className = claseCss;
    input.type = tipo;
    input.placeholder = textoPlaceholder;
    return input;
}

function createButton(claseCss, textoBoton) {
    let button = document.createElement("button");
    button.className = claseCss;
    button.textContent = textoBoton;
    return button;
}

function createDiv(idDiv, claseCss) {
    let div = document.createElement("div");
    div.id = idDiv;
    div.className = claseCss;
    return div;
}

function createSpan(idSpan, claseCss, texto) {
    let span = document.createElement("span");
    span.id = idSpan;
    span.className = claseCss;
    span.textContent = texto;
    return span;
}

function createTable(idTabla, claseCss) {
    let table = document.createElement("table");
    table.id = idTabla;
    table.className = claseCss;
    return table;
}

function createTr(idFila, claseCss) {
    let tr = document.createElement("tr");
    tr.id = idFila;
    tr.className = claseCss;
    return tr;
}

function createTd(idCelda, claseCss, texto) {
    let td = document.createElement("td");
    td.id = idCelda;
    td.className = claseCss;
    td.textContent = texto;
    return td;
}

function createTh(idCabecera, claseCss, texto) {
    let th = document.createElement("th");
    th.id = idCabecera;
    th.className = claseCss;
    th.textContent = texto;
    return th;    
}

// crea botones de menu compuestos
function createMenuButton(tipoContenedor, idContenedor, claseContenedor, claseBoton, listaBotones = []) {
    const container = tipoContenedor == "nav" ? document.createElement('nav') : createDiv(idContenedor, claseContenedor);
    container.className = claseContenedor;
    container.id = idContenedor;
    listaBotones.forEach((botonData) => {
        const element = createButton(claseBoton, botonData.text);
        element.className = claseBoton;
        container.appendChild(element);
    });
    return container;
}

// crea una tabla generica permitiendo texto o elementos html dinamicos
function createGenericTable(idTabla, claseCss, titulosColumnas = [], matrizDatos = [], formatearCelda = (valor) => valor) {
    const table = createTable(idTabla, claseCss);

    const filaEncabezado = createTr("tr-encabezado", "tr-encabezado");

    titulosColumnas.forEach((textoCabecera, indiceColumna) => {
        const th = createTh(
            "th-" + indiceColumna,
            "th-tabla",
            textoCabecera
        );
        filaEncabezado.appendChild(th);
    });

    table.appendChild(filaEncabezado);

    matrizDatos.forEach((filaDatos, indiceFila) => {
        const tr = createTr(
            "tr-" + indiceFila,
            "tr-tabla"
        );

        filaDatos.forEach((valorCelda, indiceColumna) => {
            const resultadoFormateado = formatearCelda(valorCelda, indiceColumna, indiceFila);

            const td = createTd(
                "td-" + indiceFila + "-" + indiceColumna,
                "td-tabla",
                ""
            );

            if (resultadoFormateado instanceof HTMLElement) {
                td.appendChild(resultadoFormateado);
            } else {
                td.textContent = resultadoFormateado;
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    return table;
}

// crea un contenedor estructurado para mostrar polinomios limpios con exponentes reales
function createPolynomial(idContenedor, claseCss, coeficientes) {
    let container = createDiv(idContenedor, claseCss || "polynomial-container");
    
    let terminosValidos = [];
    let gradoMaximo = coeficientes.length - 1;

    for (let i = 0; i < coeficientes.length; i++) {
        let coeficienteActual = coeficientes[i];
        if (Math.abs(coeficienteActual) < 1e-12) continue;
        let grado = gradoMaximo - i;
        terminosValidos.push({ c: coeficienteActual, grado });
    }

    if (terminosValidos.length === 0) {
        let span = createSpan("", "", "0");
        container.appendChild(span);
        return container;
    }

    terminosValidos.forEach((termino, index) => {
        let { c, grado } = termino;
        let esPrimero = (index === 0);
        let signoStr = "";
        let absC = Math.abs(c);

        if (!esPrimero) {
            signoStr = c < 0 ? " - " : " + ";
        } else {
            if (c < 0) signoStr = "-";
        }

        if (signoStr) {
            let signoSpan = createSpan("", "poly-sign", signoStr);
            container.appendChild(signoSpan);
        }

        let omitirCoef = (Math.abs(absC - 1) < 1e-12 && grado > 0);
        if (!omitirCoef || grado === 0) {
            let valRedondeado = Math.abs(absC - Math.round(absC)) < 1e-9 ? Math.round(absC) : Number(absC.toFixed(4));
            let coefSpan = createSpan("", "poly-coef", valRedondeado.toString());
            container.appendChild(coefSpan);
        }

        if (grado > 0) {
            let xSpan = createSpan("", "poly-variable", "x");
            container.appendChild(xSpan);

            if (grado > 1) {
                let sup = document.createElement("sup");
                sup.className = "poly-exponent";
                sup.textContent = grado;
                container.appendChild(sup);
            }
        }
    });

    return container;
}

// crea una seccion con un canvas listo para chart.js
function createChartCanvas(idSeccion, idCanvas, tituloGrafica = "Grafica de Resultados") {
    let section = createSection(idSeccion, "main-section-lagrange");
    let div = createDiv("", "inputs-div");
    
    let h2 = document.createElement("h2");
    h2.textContent = tituloGrafica;
    div.appendChild(h2);

    let graficaContainer = createDiv("", "grafica-container");
    let canvas = document.createElement("canvas");
    canvas.id = idCanvas;
    graficaContainer.appendChild(canvas);
    
    div.appendChild(graficaContainer);
    section.appendChild(div);
    
    return section;
}

function renderizarGraficaMultiplesPolinomios(idCanvas, listaPolinomiosCoeficientes, listaPuntosIntervalos) {
    const todosLosX = listaPuntosIntervalos.flat().map(p => p[0]);
    const minX = Math.min(...todosLosX);
    const maxX = Math.max(...todosLosX);
    const datasets = [];
    const colores = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']; // Paleta para diferenciar curvas

    // 1. Generar graficas para cada polinomio dentro de su intervalo correspondiente
    listaPolinomiosCoeficientes.forEach((coeficientes, index) => {
        const puntosIntervalo = listaPuntosIntervalos[index];
        const xsIntervalo = puntosIntervalo.map(p => p[0]);
        const minIntervalo = Math.min(...xsIntervalo);
        const maxIntervalo = Math.max(...xsIntervalo);

        const puntosCurva = [];
        const pasos = 100;
        const paso = (maxIntervalo - minIntervalo) / pasos;

        for (let i = 0; i <= pasos; i++) {
            let x = minIntervalo + i * paso;
            let y = evaluarPolinomio(coeficientes, x);
            puntosCurva.push({ x: x, y: y });
        }

        datasets.push({
            label: `Polinomio ${index + 1}`,
            data: puntosCurva,
            type: 'line',
            borderColor: colores[index % colores.length],
            borderWidth: 2,
            fill: false,
            pointRadius: 0
        });
    });

    // 2. Agregar los puntos de todos los intervalos agrupados en un solo dataset o múltiples
    const todosLosPuntosOriginales = listaPuntosIntervalos.flat().map(p => ({ x: p[0], y: p[1] }));
    
    datasets.push({
        label: 'Puntos de los Intervalos',
        data: todosLosPuntosOriginales,
        backgroundColor: '#f57eb6',
        pointRadius: 6,
        pointHoverRadius: 8
    });

    // Llamada a tu función genérica existente que se encarga de renderizar en Chart.js
    renderizarGrafica(idCanvas, datasets);
}

export {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createTable,
    createTr,
    createTd,
    createTh,
    createMenuButton,
    createGenericTable,
    createSpan,
    createPolynomial,
    createChartCanvas,
    renderizarGraficaMultiplesPolinomios 
};