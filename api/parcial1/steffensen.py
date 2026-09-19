import sys
import os

ruta_api = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ruta_api)

from auxiliares import construir_funcion
from .bisexion import biseccion
from modelos import BisexionModel
#primero se saca con otro metodo 2 aproximaciones p0 y p1
#despues usando la formula p0 - (p1-p0)**2/(p2 -2p1 + p0)
N_ITERAR = 3
metodos = {
    "Biseccion": biseccion
}

def formula(p0, p1, p2):
    return p0 - (((p1 - p0) ** 2) / (p2 - 2 * p1 + p0))

def Steffensen(f, aprox, MAX_iter, MAX_err):
    print("entro")
    tabla = []
    i = 0
    resultado = {"raiz": None, "tabla": tabla}
    
    p0 = aprox[N_ITERAR-3]
    p1 = aprox[N_ITERAR-2]
    p2 = aprox[N_ITERAR-1]

    Error = abs(p2 - p1)

    tabla.append([i+1, p0, p1, p2, Error])

    while i <= MAX_iter:
        aux = formula(p0, p1, p2)
        p0 = p1
        p1 = p2
        p2 = aux

        Error = abs(p2 - p1)
        i += 1
        tabla.append([i+1, p0, p1, p2, Error])

        if abs(f(p2)) < MAX_err or Error <= MAX_err:
            resultado["raiz"] = p2
            return resultado
        

    resultado["raiz"] = p2
    return resultado

def ctr_Steff(data):
    metodo="Biseccion"
    f = construir_funcion(data.function)
    a= 3
    b= 5
    MAX_err = data.error_max
    MAX_iter = data.max_iter
    
    if metodo not in metodos:
        return {"raiz": None, "tabla": []}

    b_json = BisexionModel(
        function=data.function,
        a=a,
        b=b,
        error_max=data.error_max,
        max_iter=N_ITERAR
    )
        
    primeros = metodos[metodo](b_json)
    
    if primeros.get("raiz") is None and "aproximaciones" not in primeros:
        resultado = primeros
    else:
        resultado = Steffensen(f, primeros["aproximaciones"], MAX_iter, MAX_err)
        
        
    return resultado
