import math

# Diccionario de funciones y constantes permitidas: solo estas funciones y constantes que se pueden usar dentro de la expresion. Todo lo demas no entra.

FUNCIONES_PERMITIDAS = {
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "exp": math.exp,
    "log": math.log,
    "log10": math.log10,
    "sqrt": math.sqrt,
    "abs": abs,
    "pi": math.pi,
    "e": math.e,
}


def construir_funcion(expresion: str):
    """Convierte el string del usuario en una funcion de Python.

    Se evalua con un entorno restringido: sin builtins y solo con las
    funciones matematicas del diccionario de funciones permitidas. Esto evita que alguien
    mande codigo arbitrario en la expresion.
    """
    def f(x: float) -> float:
        entorno = dict(FUNCIONES_PERMITIDAS) #Copia del diccionario de funciones permitidas
        entorno["x"] = x
        resultado = eval(expresion, entorno)
        return float(resultado)

    return f


def metodo_secante(f, x0: float, x1: float,
                   error_max: float = 1e-8,
                   max_iter: int = 100) -> dict:
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