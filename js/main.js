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
    createMenuButton
} from "./factories.js";
import { secante_init } from "./metodos/secante-init.js"
import {createMenuButton} from "./factories.js";
import {float_to_bin_init} from "./metodos/float-to-bin-init.js"

const aside = document.querySelector("aside");
const article = document.querySelector("article");

// Toggle cambio de modo obscuro/claro
const toggleSwitch = document.querySelector('#checkbox');
const html = document.documentElement;
toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        html.setAttribute('data-theme', 'light'); 
    } else {
        html.setAttribute('data-theme', 'dark');  
    }
});

const parc1Button = document.getElementById('parc1');
const parc2Button = document.getElementById('parc2');
const parc3Button = document.getElementById('parc3');


parc1Button.addEventListener("click", () => {
    //vaciar el aside y el article para cambiar de parcial o metodo
    aside.innerHTML = "";
    article.innerHTML = "";

    //arreglo de metodos a agregar
    const menuMethods = [
        {"text" : "Flotante en Binario"},
        {"text" : "Metodo Biseccion"},
        {"text" : "Metodo Secante"}
    ];

    //crea los elementos de este parcial
    const menuButtons = createMenuButton("div","menu-metodos","menu-metodos","methods-parc1-btn",menuMethods);
    const buttons = menuButtons.querySelectorAll(".methods-parc1-btn");

    buttons[0].addEventListener("click", () => {
        article.innerHTML = "";
        float_to_bin_init();
    });

    buttons[1].addEventListener("click", () => {
        console.log("Biseccion");
    });

    buttons[2].addEventListener("click", () => {
        article.innerHTML = "";
        secante_init();
    });

    

    aside.appendChild(menuButtons);
});

parc2Button.addEventListener("click", () => {
    aside.innerHTML = "";
    article.innerHTML = "";
});

parc3Button.addEventListener("click", () => {
    aside.innerHTML = "";
    article.innerHTML = "";
});