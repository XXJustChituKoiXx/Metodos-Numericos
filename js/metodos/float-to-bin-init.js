import {
    createSection,
    createLabel,
    createInput,
    createButton,
    createDiv,
    createSpan,
    createGenericTable  
} from "../factories.js";
import {mostrarError} from "../auxiliares.js";
import {conectApi} from "../conection.js"


const article = document.querySelector("article");

export function float_to_bin_init(){
    const article = document.querySelector("article");
    const sectionInput = createSection("main-section","main-section-float-to-bin");
    const inputDiv = createDiv("input-section-float-to-bin","container-div");
    const titleH2 = document.createElement("h2");

    const label1 = createLabel(
        "label-float-to-bin",
        "label-input",
        "input-float",
        "Ingrese Float a convertir:"
    );

    const inputNumber = createInput(
        "input-float",
        "input-number",
        "number",
        "Ej: -3.14159"
    );

    const label2 = createLabel(
        "label-precision",
        "label-input",
        "input-precision",
        "Ingrese bits a usar:"
    );

    const inputPrecicion = createInput(
        "input-precision",
        "input-number",
        "number",
        "Ej: 16,32 ó 64"
    );

    const errorMessage = createSpan(
        "general-error",
        "error-message",
        ""
    );
    const buttonSend = createButton("send-button","Calcular");

    titleH2.textContent = "Convertir Flotante a Binario";

    inputPrecicion.min = 16;
    inputPrecicion.max = 64;
    inputPrecicion.step = 16;

    errorPrecision.style.display = "none";

    inputDiv.appendChild(titleH2);
    inputDiv.appendChild(label1);
    inputDiv.appendChild(inputNumber);
    inputDiv.appendChild(label2);
    inputDiv.appendChild(inputPrecicion);
    inputDiv.appendChild(errorMessage);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);

    buttonSend.addEventListener("click", async () => { 
        const precision = inputPrecicion.value; 
    
        if (![16, 32, 64].includes(Number(precision))) { 
            mostrarError(errorMessage,"Los valores de la presicion solo pueden ser 16,32 o 64.") 
            return; 
        } 
    
        errorMessage.style.display = "none"; 
    
        const float_number = inputNumber.value !== "" ? inputNumber.value : "0"; 
        if(inputNumber.value === "") inputNumber.value = 0; 

        const body = JSON.stringify({ 
            "number": float_number, 
            "bits": precision 
        }); 
    
        const res = await conectApi(body, "float_number");

        if(article.children.length > 1) {
            article.lastElementChild.remove(); 
        }

        reesultados(res); 
    });
}

function reesultados(res) { 
    const sectionResultados = createSection(
        "resultados-section", 
        "section-resultados"
    );

    const divResultados = createDiv(
        "container-res",
        "container-div"
    );

    const titleH2 = document.createElement("h2");
    titleH2.textContent = "Resultados";

    const encabezados = [
        "Signo",
        "Exponente",
        "Mantisa",
        "Float en binario"
    ];

    const datos = [[
        res.bit_signo,
        res.bits_exponente,
        res.bits_mantisa,
        res.float_in_bin
    ]];

    const tabla = createGenericTable(
        "tabla-float-to-bin",
        "tabla-resultados",
        encabezados,
        datos
    );

    divResultados.appendChild(titleH2);
    divResultados.appendChild(tabla);

    sectionResultados.appendChild(divResultados);
    article.appendChild(sectionResultados);
}

