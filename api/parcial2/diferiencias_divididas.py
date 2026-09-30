def init_dif_divididas(data):
    pass
def diferencias_divididas(puntos):
    n = len(puntos)
    tabla = [[punto[1]] for punto in puntos]

    for nivel in range(1, n):
        for i in range(n - nivel):
            x1 = puntos[i][0]
            x2 = puntos[i + nivel][0]

            y1 = tabla[i][nivel - 1]
            y2 = tabla[i + 1][nivel - 1]

            diferencia = (y2 - y1) / (x2 - x1)
            tabla[i].append(diferencia)

    return tabla


def formato_numero(valor):
    if abs(valor) < 1e-12:
        return "0"

    if abs(valor - round(valor)) < 1e-12:
        return str(int(round(valor)))

    return f"{valor:g}"


def construir_newton(puntos, coeficientes):
    n = len(puntos)

    polinomio = formato_numero(coeficientes[0])

    for i in range(1, n):
        coeficiente = coeficientes[i]

        if abs(coeficiente) < 1e-12:
            continue

        termino = ""

        if abs(abs(coeficiente) - 1) >= 1e-12:
            termino = formato_numero(abs(coeficiente))

        for j in range(i):
            x = puntos[j][0]

            if x >= 0:
                termino += f"(x-{formato_numero(x)})"
            else:
                termino += f"(x+{formato_numero(abs(x))})"

        if coeficiente < 0:
            polinomio += " - " + termino
        else:
            polinomio += " + " + termino

    return polinomio


def interpolacion_newton(puntos):
    tabla = diferencias_divididas(puntos)
    coeficientes = tabla[0]

    return construir_newton(puntos, coeficientes)


puntos = [
    [1, 2],
    [2, 5],
    [4, 17]
]

resultado = interpolacion_newton(puntos)

print(resultado)