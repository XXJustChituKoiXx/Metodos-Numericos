import {
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
    createSpan
} from "../../factories.js";
import {conectApi} from "../../conection.js"

export function float_to_bin_init(){
    const article = document.querySelector("article");
    const sectionInput = createSection("main-section","main-section-float-to-bin");
    const inputDiv = createDiv("input-section-float-to-bin","inputs-div");
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

    const errorPrecision = createSpan(
        "error-precision",
        "error-message",
        "La precisión debe ser 16, 32 o 64"
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
    inputDiv.appendChild(errorPrecision);
    inputDiv.appendChild(inputPrecicion);
    inputDiv.appendChild(buttonSend);

    sectionInput.appendChild(inputDiv);
    article.appendChild(sectionInput);

    buttonSend.addEventListener("click", () => {
        const precision = inputPrecicion.value;

        if (![16, 32, 64].includes(Number(precision))) {
            errorPrecision.style.display = "block";
            return;
        }

        errorPrecision.style.display = "none";

        const float_number = inputNumber.value !== "" ? inputNumber.value : "0";

        const body = JSON.stringify({
            "number": float_number,
            "bits": precision
        });

        conectApi(body, "float_number");
    });
}

