export function mostrarError(elemento, texto) {
    elemento.textContent = texto;
    elemento.style.display = "block";
}

export function formatearNumero(valor) {
    if (typeof valor !== "number") {
        return valor;
    }
    // Los errores muy chicos se leen mejor en notacion cientifica
    if (valor !== 0 && Math.abs(valor) < 0.000001) {
        return valor.toExponential(4);
    }
    return valor.toFixed(6);
}