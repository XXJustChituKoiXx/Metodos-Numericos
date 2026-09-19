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

    return valor.toFixed(6);
}