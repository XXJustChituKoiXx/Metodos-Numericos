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

// renderiza cualquier grafica de chart.js de forma generica
export function renderizarGraficaGenerica(canvasId, datasetsPersonalizados, opcionesExtras = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (window[canvasId + "Instance"] instanceof Chart) {
        window[canvasId + "Instance"].destroy();
    }

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

// renderiza la grafica especifica para el metodo de lagrange
export function renderizarGraficaLagrange(canvasId, puntosOriginales, coeficientes) {
    const xs = puntosOriginales.map(p => p[0]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    function evaluarPolinomio(coefs, x) {
        let y = 0;
        let n = coefs.length - 1;
        for (let i = 0; i < coefs.length; i++) {
            let grado = n - i;
            y += coefs[i] * Math.pow(x, grado);
        }
        return y;
    }

    const puntosCurva = [];
    const pasos = 100;
    const margen = (maxX - minX) * 0.1 || 1;
    const inicio = minX - margen;
    const fin = maxX + margen;
    const paso = (fin - inicio) / pasos;

    for (let i = 0; i <= pasos; i++) {
        let x = inicio + i * paso;
        let y = evaluarPolinomio(coeficientes, x);
        puntosCurva.push({ x: x, y: y });
    }

    const puntosDataset = puntosOriginales.map(p => ({ x: p[0], y: p[1] }));

    const datasets = [
        {
            label: 'Polinomio P(x)',
            data: puntosCurva,
            type: 'line',
            borderColor: '#3b82f6',
            borderWidth: 2,
            fill: false,
            pointRadius: 0
        },
        {
            label: 'Puntos Originales',
            data: puntosDataset,
            backgroundColor: '#f57eb6',
            pointRadius: 6,
            pointHoverRadius: 8
        }
    ];

    renderizarGraficaGenerica(canvasId, datasets);
}