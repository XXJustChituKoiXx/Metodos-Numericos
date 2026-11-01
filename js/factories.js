function createSection(id, clas) {
    let section = document.createElement("section")
    section.className = clas;
    section.id = id
    return section
}

function createLabel(id, clas, forr, text) {
    let label = document.createElement("label");
    label.id = id;
    label.className = clas;
    label.htmlFor = forr;
    label.textContent = text;
    return label;
}

function createInput(id, clas, type, placeholder) {
    let input = document.createElement("input");
    input.id = id;
    input.className = clas;
    input.type = type;
    input.placeholder = placeholder;
    return input;
}

function createButton(clas, text) {
    let button = document.createElement("button");
    button.className = clas;
    button.textContent = text;
    return button;
}

function createDiv(id, clas) {
    let div = document.createElement("div");
    div.id = id;
    div.className = clas;
    return div;
}

function createSpan(id, clas, text) {
    let span = document.createElement("span");
    span.id = id;
    span.className = clas;
    span.textContent = text;
    return span;
}

function createTable(id, clas, minRows, minCols) {
    let table = document.createElement("table");
    table.id = id;
    table.className = clas;
    return table;
}

function createTr(id, clas) {
    let tr = document.createElement("tr");
    tr.id = id;
    tr.className = clas;
    return tr;
}

function createTd(id, clas, text) {
    let td = document.createElement("td");
    td.id = id;
    td.className = clas;
    td.textContent = text;
    return td;
}

function createTh(id, clas, text) {
    let th = document.createElement("th");
    th.id = id;
    th.className = clas;
    th.textContent = text;
    return th;    
}

// crea botones de menu compuestos
function createMenuButton(wraper , id, clas, classButton ,buttons=[]){
    const container = wraper == "nav" ? document.createElement('nav'):createDiv(id,clas);
    container.className = clas;
    container.id = id;
    buttons.forEach((e) =>{
        const element = createButton(classButton,e.text);
        element.className = classButton;
        container.appendChild(element);
    });
    return container;
}

// crea una tabla generica permitiendo texto o elementos html dinamicos
function createGenericTable(id, clas, encabezados = [], datos = [], formatear = (valor) => valor) {
    const table = createTable(id, clas);

    const filaEncabezado = createTr("tr-encabezado", "tr-encabezado");

    encabezados.forEach((texto, indice) => {
        const th = createTh(
            "th-" + indice,
            "th-tabla",
            texto
        );
        filaEncabezado.appendChild(th);
    });

    table.appendChild(filaEncabezado);

    datos.forEach((fila, indiceFila) => {
        const tr = createTr(
            "tr-" + indiceFila,
            "tr-tabla"
        );

        fila.forEach((valor, indiceCol) => {
            const resultadoFormateado = formatear(valor, indiceCol, indiceFila);

            const td = createTd(
                "td-" + indiceFila + "-" + indiceCol,
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
function createPolynomial(id, clas, coeficientes) {
    let container = createDiv(id, clas || "polynomial-container");
    
    let terminosValidos = [];
    let n = coeficientes.length - 1;

    for (let i = 0; i < coeficientes.length; i++) {
        let c = coeficientes[i];
        if (Math.abs(c) < 1e-12) continue;
        let grado = n - i;
        terminosValidos.push({ c, grado });
    }

    if (terminosValidos.length === 0) {
        let span = createSpan("", "", "0");
        container.appendChild(span);
        return container;
    }

    terminosValidos.forEach((term, index) => {
        let { c, grado } = term;
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
function createChartCanvas(sectionId, canvasId, titulo = "Grafica de Resultados") {
    let section = createSection(sectionId, "main-section-lagrange");
    let div = createDiv("", "inputs-div");
    
    let h2 = document.createElement("h2");
    h2.textContent = titulo;
    div.appendChild(h2);

    let graficaContainer = createDiv("", "grafica-container");
    let canvas = document.createElement("canvas");
    canvas.id = canvasId;
    graficaContainer.appendChild(canvas);
    
    div.appendChild(graficaContainer);
    section.appendChild(div);
    
    return section;
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
    createChartCanvas
};