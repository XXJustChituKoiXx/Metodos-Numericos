'''
lo que hace este metodo, es que usando algun metodo que obtenga la raiz
de la funcion normal, nosotros la bajamos un grado para ir obteniendo todas las raices

asi por ekemplo usamos Newthon-Rhapson y sacamos una raiz, bajamos un grado y sacamos
otra hasta que sea de grado 1 y solo sea un despeje

'''
import sys
import os
import cmath

ruta_api = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ruta_api)

from auxiliares import construir_funcion
from auxiliares import Polinomio

def Deflacion(polinom, ErrorMAX, IterMAX):
    
    p = Polinomio(polinom.grado, list(polinom.coeficientes))

    tabla = []
    indice = 1

    p0, p1, p2 = 0.5 + 0.5j, -0.5 + 0.5j, 0.5 - 0.5j

    while p.grado > 2:
        resultado = p.muller(p0, p1, p2, ErrorMAX, IterMAX)
        r = resultado["raiz"]

        p.agregar_raiz(r)
        tabla.append({"raiz": indice, "valor": r})
        indice += 1

        p=p.div_sint(r)

        p0, p1, p2 = r + 0.1, r - 0.1j, r + 0.1j

    if p.grado == 2:
        a, b, c = p.coeficientes
        disc = cmath.sqrt(b*b - 4*a*c)
        r1 = (-b + disc)/(2 * a)
        r2 = (-b - disc)/(2 * a)

        p.agregar_raiz(r1)
        p.agregar_raiz(r2)
        tabla.append({"raiz": indice, "valor": r1})
        indice += 1
        tabla.append({"raiz": indice, "valor": r2})

    for r in p.raices:
        polinom.agregar_raiz(r)

    return tabla

def ctr_def(coeficientes,grado,MAX_iter, MAX_err):
    
    pol= Polinomio(grado,coeficientes)

    tabla=Deflacion(pol,MAX_err,MAX_iter)
        
    return tabla

    
    