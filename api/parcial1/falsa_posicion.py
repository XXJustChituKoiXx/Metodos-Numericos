from parcial1.secante import Secante, construir_funcion


def fake_position_metod(data):
    ## tabla: i | x0 | x1 | xn | signo f(x0)*f(xn) | signo f(x1)*f(xn) | Error abs
    tabla = []
    aproximaciones = []
    error_message = ""

    x0 = data.x0
    x1 = data.x1
    f = construir_funcion(data.function)

    if (f(x0) * f(x1)) < 0:
        aproximaciones.append(x0)
        aproximaciones.append(x1)

        xn_anterior = None
        xn = None

        for i in range(data.max_iter):
            resultado_secante = Secante(
                data.function,
                x0,
                x1,
                data.error_max,
                1
            )

            xn = resultado_secante["aproximaciones"][-1]

            aproximaciones.append(xn)

            if xn_anterior is not None:
                error_abs = abs(xn - xn_anterior)
            else:
                error_abs = "-"

            signo_x0 = ((f(x0) * f(xn)) > 0) - ((f(x0) * f(xn)) < 0)
            signo_x1 = ((f(x1) * f(xn)) > 0) - ((f(x1) * f(xn)) < 0)

            tabla.append([
                i,
                x0,
                x1,
                xn,
                signo_x0,
                signo_x1,
                error_abs
            ])

            if f(xn) == 0:
                break

            if xn_anterior is not None and error_abs < data.error_max:
                break

            xn_anterior = xn

            if (f(x0) * f(xn)) < 0:
                x1 = xn
            else:
                x0 = xn

    else:
        error_message = "En este intervalo no hay una raiz (f(x0) y f(x1) tienen el mismo signo)"
        xn = None

    return {
        "tabla": tabla,
        "aproximaciones": aproximaciones,
        "raiz": xn,
        "message_error": error_message
    }