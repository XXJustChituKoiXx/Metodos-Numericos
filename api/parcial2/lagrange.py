from polinomio import Polinomio
 
def parsear_puntos(dato) -> list:
    """Convierte la entrada del usuario en una lista [[x, y], ...].
 
    Acepta una lista de listas tal cual, o un texto con los pares
    separados por punto y coma: "1,2 ; 2,5 ; 4,17".
    """
    if isinstance(dato, str):
        puntos = []
        for par in dato.split(";"):
            par = par.strip()
            if par == "":
                continue
            partes = [p for p in par.replace("(", "").replace(")", "").split(",") if p.strip() != ""]
            if len(partes) != 2:
                raise ValueError("cada punto debe tener exactamente x e y")
            puntos.append([float(partes[0]), float(partes[1])])
        return puntos
 
    return [[float(p[0]), float(p[1])] for p in dato]
 
 
def multiplicar_por_factor(coeficientes: list, r: float) -> list:
    """Multiplica el polinomio por el factor (x - r).
 
    Los coeficientes van de mayor a menor grado, asi que la lista
    crece en uno. Se arman dos filas y se suman:
        A = recorrer un lugar  (multiplicar por x)
        B = escalar por -r
    """
    n = len(coeficientes)
 
    A = coeficientes + [0.0]
    B = [0.0] + [c * (-r) for c in coeficientes]
 
    resultado = []
    for k in range(n + 1):
        resultado.append(A[k] + B[k])
 
    return resultado
 
 
def sumar_coeficientes(a: list, b: list) -> list:
    """Suma dos polinomios dados por sus coeficientes.
 
    Como el grado esta amarrado a la DERECHA de la lista, la mas
    corta se rellena con ceros al inicio antes de sumar.
    """
    largo = max(len(a), len(b))
 
    a_ajustada = [0.0] * (largo - len(a)) + list(a)
    b_ajustada = [0.0] * (largo - len(b)) + list(b)
 
    return [a_ajustada[k] + b_ajustada[k] for k in range(largo)]
 
 
def escalar_coeficientes(coeficientes: list, k: float) -> list:
    """Multiplica todo el polinomio por el numero k."""
    return [c * k for c in coeficientes]
 
 
def limpiar_ceros(coeficientes: list) -> list:
    """Quita los ceros sobrantes del inicio.
 
    Si los terminos de mayor grado se cancelan, la lista queda con
    ceros adelante que inflan el grado sin cambiar el polinomio.
    """
    limpios = list(coeficientes)
 
    while len(limpios) > 1 and abs(limpios[0]) < 1e-12:
        limpios.pop(0)
 
    return limpios
 
 
def texto_polinomio(coeficientes: list) -> str:
    """Convierte los coeficientes en texto, con el formato del equipo.
 
    Antes de armar el texto se acercan a entero los coeficientes que
    quedaron a menos de 1e-9. Es solo cosmetico: sin esto, un 1 que
    por redondeo quedo en 1.0000000000000013 se imprime como "1*x**2"
    en vez de "x**2". Los coeficientes que se devuelven no se tocan.
    """
    limpios = limpiar_ceros(coeficientes)
 
    presentables = []
    for c in limpios:
        if abs(c - round(c)) < 1e-9:
            presentables.append(float(round(c)))
        else:
            presentables.append(c)
 
    return Polinomio(len(presentables) - 1, presentables)._gen_texto_funcion()
 
 
def evaluar_coeficientes(coeficientes: list, x: float) -> float:
    """Evalua el polinomio en x por el metodo de Horner."""
    y = 0.0
    for c in coeficientes:
        y = y * x + c
    return y
 
 
def validar_puntos(puntos: list) -> str:
    """Devuelve un mensaje de error, o cadena vacia si todo esta bien."""
    if len(puntos) < 2:
        return "Escribe al menos dos puntos para poder interpolar."
 
    for i in range(len(puntos)):
        for j in range(i + 1, len(puntos)):
            if puntos[i][0] == puntos[j][0]:
                return (f"La x = {puntos[i][0]} esta repetida. Una funcion no "
                        "puede tener dos valores de y para la misma x.")
 
    return ""
 
 
def Lagrange(puntos, x_evaluar=None) -> dict:
    """Interpolacion por el polinomio de Lagrange.
 
    Parametros:
        puntos     : lista [[x, y], ...] o texto "1,2 ; 2,5 ; 4,17"
        x_evaluar  : opcional, un valor donde evaluar el polinomio
 
    Salida (estandar de interpolacion):
        {
          "polinomio"    : el polinomio final como texto
          "coeficientes" : lista de mayor a menor grado
          "grado"        : grado del polinomio
          "tabla"        : filas [i, x_i, y_i, "L_i(x)"]
          "evaluacion"   : {"x": ..., "y": ...} o None
          "mensaje"      : texto explicativo
        }
    """
    resultado = {
        "polinomio": None,
        "coeficientes": [],
        "grado": None,
        "tabla": [],
        "evaluacion": None,
        "mensaje": "",
    }
 
    # --- leer los puntos ---
    try:
        puntos = parsear_puntos(puntos)
    except (ValueError, TypeError, IndexError):
        resultado["mensaje"] = ("Los puntos no son validos. Escribelos como "
                                "pares separados por punto y coma, por ejemplo: "
                                "1,2 ; 2,5 ; 4,17")
        return resultado
 
    # --- validar antes de arrancar ---
    error = validar_puntos(puntos)
    if error != "":
        resultado["mensaje"] = error
        return resultado
 
    n = len(puntos)
    acumulado = [0.0]
 
    # --- ciclo principal: un L_i por cada punto ---
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
 
        # el denominador es un numero, no un polinomio
        Li = escalar_coeficientes(Li, 1.0 / denominador)
 
        resultado["tabla"].append([i, xi, yi, texto_polinomio(Li)])
 
        # cada L_i entra al polinomio final multiplicado por su y_i
        acumulado = sumar_coeficientes(acumulado, escalar_coeficientes(Li, yi))
 
    coeficientes = limpiar_ceros(acumulado)
 
    resultado["coeficientes"] = coeficientes
    resultado["grado"] = len(coeficientes) - 1
    resultado["polinomio"] = texto_polinomio(coeficientes)
    resultado["mensaje"] = (f"Polinomio de grado {resultado['grado']} "
                            f"construido con {n} puntos.")
 
    # --- evaluacion opcional ---
    if x_evaluar is not None:
        try:
            x = float(x_evaluar)
            resultado["evaluacion"] = {
                "x": x,
                "y": evaluar_coeficientes(coeficientes, x),
            }
        except (ValueError, TypeError, OverflowError):
            resultado["mensaje"] += " No se pudo evaluar en la x que diste."
 
    return resultado
 
 
def lagrange_method(data) -> dict:
    return Lagrange(data.puntos, data.x_evaluar)