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

from auxiliares import Polinomio
from auxiliares import crear_funcion_compleja,convertir_complex
from .muller import muller_method
from modelos import MullerModel

def Deflacion(polinom, data):
    
    p = Polinomio(polinom.grado, list(polinom.coeficientes))

    tabla = []
    indice = 1

    p0, p1, p2 = 0.5 + 0.5j, -0.5 + 0.5j, 0.5 - 0.5j

    funcion= data.function

    while p.grado > 2:
        para_muller = MullerModel(
            function=funcion,
            x0=p0,
            x1=p1,
            x2=p2,
            error_max=data.error_max,
            max_iter=data.max_iter
        )
    
        resultado = muller_method(para_muller)
        raiz=resultado["raiz"]
        r = complex(
            raiz["real"],
            raiz["imag"]
        )

        p.agregar_raiz(r)
        tabla.append({"raiz": indice, "valor": convertir_complex(r)})
        indice += 1

        p=p._div_sint(r)
        p._gen_texto_funcion()
        funcion= p.funcion
        p0, p1, p2 = r + 0.1, r - 0.1j, r + 0.1j

    if p.grado == 2:
        a, b, c = p.coeficientes
        disc = cmath.sqrt(b*b - 4*a*c)
        r1 = (-b + disc)/(2 * a)
        r2 = (-b - disc)/(2 * a)

        p.agregar_raiz(r1)
        p.agregar_raiz(r2)
        tabla.append({"raiz": indice, "valor": convertir_complex(r1)})
        indice += 1
        tabla.append({"raiz": indice, "valor": convertir_complex(r2)})

    for r in p.raices:
        polinom.agregar_raiz(r)

    return tabla

def ctr_deflacion(data):
    f = crear_funcion_compleja(data.function)
    pol= Polinomio(data.grado,list(data.coeficientes), f)
    tabla=Deflacion(pol,data)
        
    return {
        "tabla": tabla,
        "funcion": data.function
    }

    
    