import math
#Diccionario de funciones y constantes permititdas

FUNCIONES_PERMITIDAS = {
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "sinh": math.sinh,
    "cosh": math.cosh,
    "tanh": math.tanh,
    "exp": math.exp,
    "log": math.log,
    "log10": math.log10,
    "sqrt": math.sqrt,
    "abs": abs,
    "pi": math.pi,
    "e": math.e,
}


def construir_funcion(funcion: str):
    """Convierte un string en una funcion de Python."""
    def g(x: float) -> float:
        entorno = dict(FUNCIONES_PERMITIDAS)
        entorno["x"] = x
        return float(eval(funcion, {"__builtins__": {}}, entorno))

    return g


def punto_fijo(funcion: str, a: float,
               MAX_err: float, MAX_iter: int) -> dict:
    """Metodo del punto fijo.

    Parametros (orden estandar para la tablita):
        funcion  : la g(x) ya despejada, usando la 'x' como variable
        a        : aproximacion inicial
        MAX_err  : error maximo aceptado
        MAX_iter : maximo de iteraciones

    Salida (estandar):
        {
          "raiz"           : float o None si no converge
          "tabla"          : lista de filas [i, xi, xi_1, error]
          "aproximaciones" : lista de valores sucesivos de x
          "mensaje"        : texto explicativo (extra, opcional)
        }
    """
    resultado = {
        "raiz": None,
        "tabla": [],
        "aproximaciones": [],
        "mensaje": "",
    }

    # --- validar la expresion antes de arrancar ---
    try:
        g = construir_funcion(funcion)
        g(float(a))
    except Exception:
        resultado["mensaje"] = ("La funcion no es valida. Usa 'x' como variable ")
        return resultado

    # --- validaciones de los parametros ---
    if MAX_err <= 0:
        resultado["mensaje"] = "El error maximo debe ser mayor a cero."
        return resultado

    if MAX_iter < 1:
        resultado["mensaje"] = "Las iteraciones deben ser al menos 1."
        return resultado

    xi: float = float(a)
    error_viejo: float = 0.0
    resultado["aproximaciones"] = [xi]

    # --- ciclo principal ---
    for i in range(1, MAX_iter + 1):
        try:
            xi_1 = g(xi)
        except (ValueError, TypeError, OverflowError, ZeroDivisionError):
            resultado["mensaje"] = (f"En la iteracion {i} la funcion no se "
                                    "pudo evaluar. Prueba con otro valor "
                                    "inicial o despeja distinto la g(x).")
            return resultado

        # Si el valor se fue a infinito o quedo indefinido, ya no hay nada que hacer
        if not math.isfinite(xi_1):
            resultado["mensaje"] = (f"En la iteracion {i} el valor se disparo a "
                                    "infinito. El metodo diverge con esa g(x).")
            return resultado

        error = abs(xi_1 - xi)

        resultado["tabla"].append([i, xi, xi_1, error])
        resultado["aproximaciones"].append(xi_1)

        # Criterio de paro - es la buena 
        if error < MAX_err:
            resultado["raiz"] = xi_1
            resultado["mensaje"] = f"Convergio en {i} iteraciones."
            return resultado

        # Deteccion de divergencia: el error no solo dejo de bajar, se disparo
        if i > 1 and error > error_viejo * 10:
            resultado["mensaje"] = (f"En la iteracion {i} el error crecio de "
                                    f"{error_viejo} a {error}. El metodo diverge, "
                                    "prueba con otra g(x) o con otro valor inicial.")
            return resultado

        # Recorrer la ventana
        error_viejo = error
        xi = xi_1

    resultado["mensaje"] = (f"No convergio en {MAX_iter} iteraciones. "
                            "La ultima aproximacion fue "
                            f"{resultado['aproximaciones'][-1]}.")
    return resultado


def pf_method(data) -> dict:
    return punto_fijo(data.funcion, data.a, data.error_max, data.max_iter)
