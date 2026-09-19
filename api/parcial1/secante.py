from auxiliares import construir_funcion
def Secante(funcion: str, a: float, b: float,
            MAX_err: float, MAX_iter: int) -> dict:
    """Metodo de la secante.

    Parametros (orden estandar para la tablita):
        función  : uso de la 'x' como variable
        a        : primera aproximacion inicial
        b        : segunda aproximacion inicial
        MAX_err  : error maximo aceptado
        MAX_iter : maximo de iteraciones xd

    Salida (estandar):
        {
          "raiz"           : float o None si no converge
          "tabla"          : lista de filas [i, p0, p1, p2, error]
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
        f = construir_funcion(funcion)
        f(float(a))
        f(float(b))
    except Exception:
        resultado["mensaje"] = ("La funcion no es valida. Usa 'x' como variable ")
        return resultado

    # --- validaciones de los puntos iniciales ---
    if a == b:
        resultado["mensaje"] = "Los dos valores iniciales deben ser distintos."
        return resultado

    if MAX_err <= 0:
        resultado["mensaje"] = "El error maximo debe ser mayor a cero."
        return resultado

    if MAX_iter < 1:
        resultado["mensaje"] = "Las iteraciones deben ser al menos 1."
        return resultado

    p0: float = a
    p1: float = b
    resultado["aproximaciones"] = [p0, p1]

    # --- ciclo principal ---
    for i in range(1, MAX_iter + 1):
        try:
            f0 = f(p0)
            f1 = f(p1)
        except (ValueError, TypeError, OverflowError, ZeroDivisionError):
            resultado["mensaje"] = (f"En la iteracion {i} la funcion no se "
                                    "pudo evaluar. Prueba con otros valores "
                                    "iniciales.")
            return resultado

        denominador = f1 - f0

        # Proteger la division ANTES de dividir
        if abs(denominador) < 1e-15:
            resultado["mensaje"] = (f"En la iteracion {i} el denominador se "
                                    "hizo casi cero. Prueba con otros valores "
                                    "iniciales.")
            return resultado

        # Formula de la secante
        p2 = p1 - f1 * (p1 - p0) / denominador

        error = abs(p2 - p1)

        resultado["tabla"].append([i, p0, p1, p2, error])
        resultado["aproximaciones"].append(p2)

        # Criterio de paro
        try:
            f_p2 = f(p2)
        except (ValueError, TypeError, OverflowError, ZeroDivisionError):
            f_p2 = None

        if f_p2 == 0 or error < MAX_err:
            resultado["raiz"] = p2
            resultado["mensaje"] = f"Convergio en {i} iteraciones."
            return resultado

        # Recorrer la ventana
        p0 = p1
        p1 = p2

    resultado["mensaje"] = (f"No convergio en {MAX_iter} iteraciones. "
                            "La ultima aproximacion fue "
                            f"{resultado['aproximaciones'][-1]}.")
    return resultado

def sec_method(data) -> dict:
    return Secante(data.funcion, data.a, data.b, data.error_max, data.max_iter)