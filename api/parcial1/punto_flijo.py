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

def construir_funcion(funcion_str):
    """Convierte un string en una funcion de Python"""
    def f(x: float) -> float:
        entorno = dict(FUNCIONES_PERMITIDAS)
        entorno['x'] = x
        return float(eval(funcion_str, {"__builtins__": None}, entorno))
    return f

def punto_fijo(funcion_str: str, xi: float, 
            Max_err: float, 
            Max_iter: int) -> dict:
    """Metodo del punto fijo.

    Parametros (orden estandar de la tablita):
        funcion   : toma la g(x) despejada y usa la 'x' como variable
        a         : valor de partida
        Max_err   : error maximo aceptado
        Max_iter  : maximo de iteraciones

    Salida (estandar):
        {
            "raiz": float, o None si no se converge
            "tabla": lista de filas [i, xi, xi_1, error]
            "aproximaciones": lista de valores sucesibos de xi
            "mensaje" : texto explicativo (extra, opcional)
        }"""

    resultado = {
        "raiz": None,
        "tabla": [],
        "aproximaciones": [],
        "mensaje": ""
    }

    # --- validar la expresion antes de arrancar ---
    try:
        f = construir_funcion(funcion_str)
        f(float(xi))
    except Exception:
        resultado["mensaje"] = ("La funcion no es valida. Usa 'x' como variable y funciones matematicas permitidas.")
        return resultado

    # --- validaciones de los parametros ---
    if Max_err <= 0:
        resultado["mensaje"] = "El error máximo debe ser mayor que cero."
        return resultado

    if Max_iter <= 0:
        resultado["mensaje"] = "El número máximo de iteraciones debe ser mayor que cero."
        return resultado

    xi: float = float(xi)
    error_viejo: float = 0

    # --- ciclo principal ---
    for i in range(1, Max_iter + 1):
        g1 = f(xi)
        error_nuevo = abs(g1 - xi) 
        resultado["tabla"].append([i, xi, g1, error_nuevo])
        if error_nuevo < Max_err:
            resultado["raiz"] = g1
            resultado["mensaje"] = f"Convergencia alcanzada en {i} iteraciones."
            return resultado
        else:
            if error_nuevo > error_viejo and i > 1:
                resultado["mensaje"] = "El método no converge."#Divergencia
                return resultado
            else:
                error_viejo = error_nuevo
                resultado["aproximaciones"].append(g1)
                xi = g1
