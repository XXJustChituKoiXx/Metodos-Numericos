# metodo de la biseccion 
#nos daran maximo de iter, limites, funcion, error maximo abs

##tabla: i| a | b | c | f(a) - signo|f(c)|f(b)|Error abs
# x**3 -2, podria hacer un try catch para el formato

def sign_of(y):
    return '+' if y>=0 else '-'

def biseccion( MAX_iter, a,b, funcion, MAX_err):
    tabla= []
    c= (a+b)/2.0
    Error= 0
    i=0

    resultado={"raiz":None,"tabla":tabla}

    try:
        f = eval("lambda x: " + funcion)
    except Exception as ValueERR:
        print(ValueERR)
        return {"error": "La función no es válida, solo se permite variable x"}

    tabla.append(['i', 'a','b','c', 'f(a)','f(c)','f(b)', 'Error'])

    def agregar(i, a,b,c, Error):
        tabla.append([i+1,a,b,c,sign_of(f(a)), sign_of(f(c)),sign_of(f(b)),Error])

    if f(a)*f(b) > 0:
        return {"error": "No hay raiz o hay un numero par de raíces en el intervalo"}
    if f(a)==0:
        agregar(i, a,b,c, Error)
        resultado["raiz"] = a
        return resultado
    if f(b)==0:
        agregar(i, a,b,c, Error)
        resultado["raiz"] = b
        return resultado

    while (i<MAX_iter):
        c_viejo=c
        c= (a+b)/2.0
        if i == 0:
            Error = abs(b - a) / 2.0   
        else:
            Error = abs(c - c_viejo)
        
        if f(c) == 0 or (i > 0 and Error<=MAX_err):
            agregar(i, a,b,c, Error)
            resultado["raiz"] = c
            return resultado
        
        if f(a)*f(c) < 0:
            b=c
        if f(c)*f(b) <0:
            a=c
        agregar(i, a,b,c, Error)
        i+=1
    resultado["raiz"] = c
    return resultado


resultado = biseccion(10, 3, 5, "x**2 - x - 9", 1e-6)

if "error" in resultado:
    print(resultado["error"])
else:
    print(resultado["raiz"])
    print(resultado["tabla"])