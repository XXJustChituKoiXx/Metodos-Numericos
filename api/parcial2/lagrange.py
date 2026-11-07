from auxiliares import (
    multiplicar_por_factor,
    sumar_coeficientes,
    escalar_coeficientes,
    limpiar_ceros,
    evaluar_coeficientes
)

def Lagrange(puntos, x_evaluar=None) -> dict:
    """Interpolación de Lagrange pura (solo cálculos numéricos)."""
    n = len(puntos)
    acumulado = [0.0]
    tabla = []

    for i in range(n):
        xi = puntos[i][0]
        yi = puntos[i][1]

        Li = [1.0]
        denominador = 1.0

        for j in range(n):
            if j != i:
                xj = puntos[j][0]
                Li = multiplicar_por_factor(Li, xj)
                denominador = denominador * (xi - xj)

        Li = escalar_coeficientes(Li, 1.0 / denominador)
        
        # Guardamos los coeficientes numéricos de L_i en la tabla
        tabla.append([i, xi, yi, Li])

        acumulado = sumar_coeficientes(acumulado, escalar_coeficientes(Li, yi))

    coeficientes = limpiar_ceros(acumulado)

    resultado = {
        "coeficientes": coeficientes,
        "grado": len(coeficientes) - 1,
        "tabla": tabla,
        "evaluacion": None
    }

    if x_evaluar is not None:
        x = float(x_evaluar)
        resultado["evaluacion"] = {
            "x": x,
            "y": evaluar_coeficientes(coeficientes, x)
        }

    return resultado

def lagrange_method(data) -> dict:
    return Lagrange(data.puntos, data.x_evaluar)