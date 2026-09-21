import {createMenuButton} from "./factories.js";
import { secante_init } from "./metodos/secante-init.js";
import {float_to_bin_init} from "./metodos/float-to-bin-init.js";
import {falsa_posicion_init} from "./metodos/falsa-posicion.js";
import {newton_raphson_init} from "./metodos/newthon-raphson.js";
import { muller_init } from "./metodos/muller.js";
import {deflacion_init} from "./metodos/deflacion.js";
import {biseccion_init} from "./metodos/biseccion.js";
import {steffensen_init} from "./metodos/steffensen.js";

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
    //vacear el aside y el article para cambiar de parcial o metodo
    aside.innerHTML = "";
    article.innerHTML = "";

    //arreglo de metodos a agregar
    const menuMethods = [
        {"text" : "Flotante en Binario"},
        {"text" : "Metodo Biseccion"},
        {"text" : "Metodo Secante"},
        {"text" : "Falsa Posicion"},
        {"text" : "Newton-Raphson"},
        {"text" : "Punto Fijo"},
        {"text" : "Steffensen"},
        {"text" : "Deflacion"},
        {"text" : "Horner"},
        {"text" : "Müler"}
    ];

    //crea los elementos de este parcial
    const menuButtons = createMenuButton("div","menu-metodos","menu-metodos","methods-parc1-btn",menuMethods);
    const buttons = menuButtons.querySelectorAll(".methods-parc1-btn");

    buttons[0].addEventListener("click", () => {
        article.innerHTML = "";
        float_to_bin_init();
    });

    buttons[1].addEventListener("click", () => {
        article.innerHTML = "";
        biseccion_init();
    });

    buttons[2].addEventListener("click", () => {
        article.innerHTML = "";
        secante_init();
    });
    buttons[3].addEventListener("click", () => {
        article.innerHTML = "";
        falsa_posicion_init();
    });
    buttons[4].addEventListener("click", () => {
        article.innerHTML = "";
        newton_raphson_init();
    });
    buttons[5].addEventListener("click", () => {
        article.innerHTML = "";
        punto_fijo_init();
    });
    buttons[6].addEventListener("click", () => {
        article.innerHTML = "";
        steffensen_init();
    });
    buttons[7].addEventListener("click", () => {
        article.innerHTML = "";
        deflacion_init();
    });
    buttons[8].addEventListener("click", () => {
        article.innerHTML = "";
        console.log(buttons[8]);
    });
    buttons[9].addEventListener("click", () => {
        article.innerHTML = "";
        muller_init();
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