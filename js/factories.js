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

//elementos html compuestos jaja
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

            const texto = formatear(valor, indiceCol, indiceFila);

            const td = createTd(
                "td-" + indiceFila + "-" + indiceCol,
                "td-tabla",
                texto
            );

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    return table;
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
    createSpan
};  