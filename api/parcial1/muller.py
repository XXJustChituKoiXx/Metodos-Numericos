import cmath
from auxiliares import crear_funcion_compleja,convertir_complex
def muller_method(data):

    f = crear_funcion_compleja(data.function)

    x0 = data.x0
    x1 = data.x1
    x2 = data.x2

    aproximaciones = [x0, x1, x2]

    # i | x0 | x1 | x2 | x | error absoluto

    tabla = []
    error_message = ""

    for i in range(data.max_iter):

        # obtener delta
        delta = (x0 - x2) * (x1 - x2) * (x0 - x1)

        if delta == 0:
            error_message = "No se puede continuar: existen puntos iniciales repetidos."
            break

        # obtener a
        a = (((f(x0) - f(x2)) * (x1 - x2))- ((f(x1) - f(x2)) * (x0 - x2))) / delta

        # obtener b
        b = (((x0 - x2) ** 2) * (f(x1) - f(x2))- ((x1 - x2) ** 2) * (f(x0) - f(x2))) / delta

        # obtener c
        c = f(x2)

        # calcular x
        discriminante = cmath.sqrt(b ** 2 - 4 * a * c)

        if abs(b + discriminante) > abs(b - discriminante):
            denominador = b + discriminante
        else:
            denominador = b - discriminante

        if denominador == 0:
            error_message = "No se puede continuar: el denominador es cero."
            break

        x = x2 - (2 * c) / denominador

        error_abs = abs(x - x2)

        tabla.append([
            i,
            convertir_complex(x0),
            convertir_complex(x1),
            convertir_complex(x2),
            convertir_complex(x),
            error_abs
        ])

        aproximaciones.append(convertir_complex(x))

        if error_abs <= data.error_max:
            error_message = f"Se alcanzo la tolerancia de error en la iteracion {i}."
            break

        x0 = x1
        x1 = x2
        x2 = x

    return {
        "raiz": convertir_complex(x),
        "tabla": tabla,
        "aproximaciones": aproximaciones,
        "error_message": error_message
    }