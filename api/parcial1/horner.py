import math
import re


def parsear_coeficientes(texto) -> list:
    """Convierte "1, 0, 2, -1, -3" en [1.0, 0.0, 2.0, -1.0, -3.0]."""
    if isinstance(texto, (list, tuple)):
        return [float(c) for c in texto]

    partes = [p for p in re.split(r"[,;\s]+", str(texto).strip()) if p != ""]
    return [float(p) for p in partes]


def horner(coeficientes: list, x0: float):
    """Division sintetica. Devuelve P(x0), P'(x0) y los coeficientes de Q(x).

    b acumula el valor del polinomio y d el de su derivada. Funciona porque
    P(x) = (x - x0) * Q(x) + P(x0), y al derivar queda P'(x0) = Q(x0).
    """
    grado = len(coeficientes) - 1

    b = coeficientes[0]
    d = b
    cociente = [b]

    for j in range(1, grado):
        b = coeficientes[j] + b * x0
        cociente.append(b)
        d = b + d * x0

    b = coeficientes[grado] + b * x0

    return b, d, cociente


def Horner(coeficientes, a: float,
           MAX_err: float, MAX_iter: int) -> dict:
    """Metodo de Newton-Horner.

    Parametros (orden estandar para la tablita):
        coeficientes : del polinomio, de mayor a menor grado
        a            : aproximacion inicial
        MAX_err      : error maximo aceptado
        MAX_iter     : maximo de iteraciones

    Salida (estandar):
        {
          "raiz"           : float o None si no converge
          "tabla"          : lista de filas [i, x, P(x), P'(x), x_1, error]
          "aproximaciones" : lista de valores sucesivos de x
          "cociente"       : coeficientes de Q(x) al dividir entre (x - raiz)
          "mensaje"        : texto explicativo (extra, opcional)
        }
    """
    resultado = {
        "raiz": None,
        "tabla": [],
        "aproximaciones": [],
        "cociente": [],
        "mensaje": "",
    }

    # --- validar los coeficientes antes de arrancar ---
    try:
        coeficientes = parsear_coeficientes(coeficientes)
    except (ValueError, TypeError):
        resultado["mensaje"] = ("Los coeficientes no son validos. Escribe solo "
                                "numeros separados por comas.")
        return resultado

    if len(coeficientes) < 2:
        resultado["mensaje"] = ("Escribe al menos dos coeficientes: el polinomio "
                                "debe ser de grado 1 o mayor.")
        return resultado

    if coeficientes[0] == 0:
        resultado["mensaje"] = ("El primer coeficiente no puede ser cero, es el "
                                "del termino de mayor grado.")
        return resultado

    # --- validaciones de los parametros ---
    if MAX_err <= 0:
        resultado["mensaje"] = "El error maximo debe ser mayor a cero."
        return resultado

    if MAX_iter < 1:
        resultado["mensaje"] = "Las iteraciones deben ser al menos 1."
        return resultado

    xi: float = float(a)
    resultado["aproximaciones"] = [xi]

    # --- ciclo principal ---
    for i in range(1, MAX_iter + 1):
        try:
            p, dp, _ = horner(coeficientes, xi)
        except OverflowError:
            resultado["mensaje"] = (f"En la iteracion {i} los valores se "
                                    "dispararon. Prueba con otra aproximacion "
                                    "inicial.")
            return resultado

        if not math.isfinite(p) or not math.isfinite(dp):
            resultado["mensaje"] = (f"En la iteracion {i} el valor se disparo a "
                                    "infinito. Prueba con otra aproximacion "
                                    "inicial.")
            return resultado

        # Proteger la division ANTES de dividir
        if abs(dp) < 1e-15:
            resultado["mensaje"] = (f"En la iteracion {i} la derivada se hizo "
                                    "casi cero. Prueba con otra aproximacion "
                                    "inicial.")
            return resultado

        # Formula de Newton, con P y P' que ya dio Horner
        xi_1 = xi - p / dp

        error = abs(xi_1 - xi)

        resultado["tabla"].append([i, xi, p, dp, xi_1, error])
        resultado["aproximaciones"].append(xi_1)

        # Criterio de paro
        if error < MAX_err:
            resultado["raiz"] = xi_1
            resultado["cociente"] = horner(coeficientes, xi_1)[2]
            resultado["mensaje"] = f"Convergio en {i} iteraciones."
            return resultado

        xi = xi_1

    resultado["mensaje"] = (f"No convergio en {MAX_iter} iteraciones. "
                            "La ultima aproximacion fue "
                            f"{resultado['aproximaciones'][-1]}.")
    return resultado


def horner_method(data) -> dict:
    return Horner(data.coeficientes, data.a, data.error_max, data.max_iter)
