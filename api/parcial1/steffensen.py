import sys
import os

ruta_api = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ruta_api)

from auxiliares import construir_funcion
from bisexion import biseccion
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

    tabla.append(['i', 'Pn', 'P n+1', 'P n+2', 'Error'])
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

def ctr_Steff(MAX_iter, a, b, funcion, MAX_err, metodo):
    f = construir_funcion(funcion)
    
    if metodo not in metodos:
        return {"raiz": None, "tabla": []}
        
    primeros = metodos[metodo](f, a, b, MAX_err, N_ITERAR)
    
    if primeros.get("raiz") is None and "aproximaciones" not in primeros:
        resultado = primeros
    else:
        resultado = Steffensen(f, primeros["aproximaciones"], MAX_iter, MAX_err)
        
        
    return resultado

resultado = ctr_Steff(15, 3, 5, "x**2 - x - 9", 1e-6, 'Biseccion')
print("Raiz:", resultado["raiz"])
print("Tabla:")
for fila in resultado["tabla"]:
    print(fila)