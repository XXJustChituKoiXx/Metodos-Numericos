import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm'; 
Chart.register(...registerables);

export function mostrarError(elemento, texto) {
    elemento.textContent = texto;
    elemento.style.display = "block";
}

export function formatearNumero(valor) {
    if (valor !== null && typeof valor === "object") {
        const real = valor.real;
        const imag = valor.imag;

        if (imag === 0) {
            return formatearNumero(real);
        }

        if (real === 0) {
            return formatearNumero(imag) + "i";
        }

        const signo = imag >= 0 ? " + " : " - ";

        return (
            formatearNumero(real) + signo + formatearNumero(Math.abs(imag)) +"i"
        );
    }

    if (typeof valor !== "number") {
        return valor;
    }

    if (valor !== 0 && Math.abs(valor) < 0.000001) {
        return valor.toExponential(4);
    }

    if (Math.abs(valor - Math.round(valor)) < 1e-9) {
        return Math.round(valor).toString();
    }

    return Number(valor.toFixed(6)).toString();
}

export function formatearPolinomio(coeficientes) {
    let terminos = [];
    let n = coeficientes.length - 1;

    for (let i = 0; i < coeficientes.length; i++) {
        let c = coeficientes[i];
        if (Math.abs(c) < 1e-12) continue;

        let grado = n - i;
        let coefStr = "";

        if (grado === 0) {
            terminos.push(formatearNumero(c));
        } else {
            if (Math.abs(Math.abs(c) - 1) < 1e-12) {
                coefStr = c < 0 ? "-" : "";
            } else {
                coefStr = formatearNumero(c) + "*";
            }

            let xStr = grado === 1 ? "x" : "x**" + grado;
            terminos.push(coefStr + xStr);
        }
    }

    if (terminos.length === 0) return "0";

    let texto = terminos[0];
    for (let i = 1; i < terminos.length; i++) {
        let t = terminos[i];
        if (t.startsWith("-")) {
            texto += " - " + t.substring(1);
        } else {
            texto += " + " + t;
        }
    }
    return texto;
}

export function renderizarGrafica(canvasId, datasetsPersonalizados, opcionesExtras = {}) {
    if (window[canvasId + "Instance"] instanceof Chart) {
        try {
            window[canvasId + "Instance"].destroy();
        } catch (error) {
            console.warn("No se pudo destruir la instancia previa de Chart.js:", error);
        }
        window[canvasId + "Instance"] = null;
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    window[canvasId + "Instance"] = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasetsPersonalizados
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            ...opcionesExtras
        }
    });
}

export function evaluarPolinomio(coefs, x) {
    let y = 0;
    if (!Array.isArray(coefs)) return y;
    let n = coefs.length - 1;

    for (let i = 0; i < coefs.length; i++) {
        let grado = n - i;
        let c = coefs[i];

        // Extraer el valor numérico si el coeficiente viene como objeto complejo ({real, imag})
        let valorCoef = c;
        if (c !== null && typeof c === "object") {
            valorCoef = c.real !== undefined ? c.real : 0;
        }

        if (typeof valorCoef === "number" && !isNaN(valorCoef)) {
            y += valorCoef * Math.pow(x, grado);
        }
    }
    return y;
}