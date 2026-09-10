from auxiliares import construir_funcion
from bisexion import biseccion
#primero se saca con otro metodo 2 aproximaciones p0 y p1
#despues usando la formula p0 - (p1-p0)**2/(p2 -2p1 + p0)
N_ITERAR=3
metodos = {
    "Biseccion": biseccion
}

def formula(p0,p1,p2):
    return p0 -(  ((p1-p0)**2)/(p2 -2*p1 +p0)  )

def Steffensen(f,aprox,MAX_iter,MAX_err):
    tabla=[]
    i=0
    resultado={"raiz":None,"tabla":tabla}
    p0=aprox[N_ITERAR-3]
    p1=aprox[N_ITERAR-2]
    p2=aprox[N_ITERAR-1]

    Error= p2-p1

    tabla.append([ 'i','Pn','P n+1','P n+2','Error'])
    tabla.append([i,p0,p1,p2,Error])

    aux=None

    while (i<=MAX_iter):
        
        aux=formula(p0,p1,p2)
        p0=p1
        p1=p2
        p2=aux

        Error=p2 - p1
        i+=1
        tabla.append([i,p0,p1,p2,Error])

        if f(p2)==0 or (i > 0 and Error<=MAX_err):
            resultado["raiz"] = p2
            return resultado

    resultado["raiz"] = p2
    return resultado
        

def ctr_Steff(MAX_iter, a,b, funcion, MAX_err, metodo):
    #crear la funcion, pasar como parametro, luego pasar los parametros a el metodo
    f = construir_funcion(funcion)
    if not metodos[metodo]:
        return []
    primeros = metodos[metodo]( f, a,b, MAX_err, N_ITERAR)
    
    if not primeros["raiz"]:
        resultado = Steffensen(funcion,primeros["aproximaciones"],MAX_iter,MAX_err)
    else:
        resultado = primeros
    return resultado