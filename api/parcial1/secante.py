import math
from auxiliares import construir_funcion
from fastapi import HTTPException, status
# Diccionario de funciones y constantes permitidas: solo estas funciones y constantes que se pueden usar dentro de la expresion. Todo lo demas no entra.

def metodo_secante(f, x0: float, x1: float,
                   error_max: float,
                   max_iter: int) -> dict:
    """Aproxima una raiz de f usando el metodo de la secante.

    Parametros:
        f        : funcion a evaluar
        x0, x1   : dos aproximaciones iniciales distintas
        error_max      : error absoluto maximo aceptado
        max_iter : tope de iteraciones antes de rendirse

    Devuelve un diccionario con la raiz, el numero de iteraciones,
    si convergio o no, y la tabla completa de iteraciones.
    """
    if x0 == x1:
        raise ValueError("Los dos valores iniciales deben ser distintos para tener una aproximacion.")

    #Lista vacia para almacenar los resultados de cada iteracion, en la línea 82 le agrega una fila con .append()
    tabla: list = []
    x_anterior: float = x0
    x_actual: float = x1

    for i in range(1, max_iter + 1):
        f_anterior = f(x_anterior)
        f_actual = f(x_actual)

        denominador = f_actual - f_anterior

        # Si la secante queda casi horizontal, la division revienta
        if abs(denominador) == 0: 
                raise ValueError(
                    f"En la iteracion {i} el denominador se hizo cero. "
                    "Prueba con otros valores iniciales."
                )

        # Formula de la secante
        x_nuevo = x_actual - f_actual * (x_actual - x_anterior) / denominador

        error_absoluto = abs(x_nuevo - x_actual)
        error_relativo = (error_absoluto / abs(x_nuevo)
                          if x_nuevo != 0 else error_absoluto)#Por si la raiz es cero, para no dividir por cero

        #Agrega una fila a la tabla con los resultados de la iteracion actual
        tabla.append({
            "iteracion": i,
            "x_anterior": x_anterior,
            "x_actual": x_actual,
            "f_anterior": f_anterior,
            "f_actual": f_actual,
            "x_nuevo": x_nuevo,
            "f_nuevo": f(x_nuevo),
            "error_absoluto": error_absoluto,
            "error_relativo": error_relativo,
        })

        #Critero de Paro por error absoluto: si el error absoluto es menor que el error maximo, se considera que se ha encontrado la raiz BANDERA 1
        if error_absoluto < error_max:
            return {
                "raiz": x_nuevo,
                "valor_funcion": f(x_nuevo),
                "iteraciones": i,
                "convergio": True,
                "tabla": tabla,
            }

        # Recorrer la ventana: el actual pasa a ser el anterior
        x_anterior = x_actual
        x_actual = x_nuevo

    #Criterio de Paro por maximo de iteraciones: si se llega al maximo de iteraciones sin converger, se devuelve el ultimo valor calculado BANDERA 2
    return {
        "raiz": x_actual,
        "valor_funcion": f(x_actual),
        "iteraciones": max_iter,
        "convergio": False,
        "tabla": tabla,
    }


def sec_method(data):
    # Validar que la expresion se pueda evaluar antes de arrancar
    f = construir_funcion(data.funcion)
    try:
        f(data.x0)
        f(data.x1)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La funcion no es valida. Usa 'x' como variable, "
                   "por ejemplo: x**3 - 5*x + 3"
        )
 
    if data.error_max <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El error maximo debe ser mayor a cero."
        )
 
    if data.max_iter < 1 or data.max_iter > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las iteraciones deben estar entre 1 y 1000."
        )
 
    try:
        resultado = metodo_secante(f, data.x0, data.x1, data.error_max, data.max_iter)
    except (ValueError, ZeroDivisionError) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except OverflowError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El metodo diverge con esos valores iniciales."
        )
 
    return resultado