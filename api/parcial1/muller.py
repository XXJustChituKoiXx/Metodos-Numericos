def muller_method(data):
    f = data.function
    x0 = data.x0
    x1 = data.x1
    x2 = data.x2
    aproximaciones = []
    # i | x0 | x1 | x2 | x | error absoluto
    tabla = [] 
    error_message = "" 
    aproximaciones.append(x0)
    aproximaciones.append(x1)
    aproximaciones.append(x2)
    for i in range(data.max_iter):

        # obtener delta
        delta = (x0-x2)*(x1-x2)*(x0-x1)
        # obtener a
        a = (((f(x0)-f(x2))*(x1-x2))  -  ((f(x1)-f(x2))*(x0-x2)))/delta
        # obtener b
        b = ((((x0-x2)**2)*(f(x1)-f(x2)))  -  (((x1-x2)**2)*(f(x0)-f(x2))))/delta
        # obtener c
        c = f(x2)

        #calcular x
        discriminante = (b**2 - 4*a*c)**0.5

        if abs(b + discriminante) > abs(b - discriminante):
            denominador = b + discriminante
        else:
            denominador = b - discriminante

        x = x2 - (2*c) / denominador
        
        error_abs = abs(x - x2)
        tabla.append([i,x0,x1,x2,x,error_abs])
        if(error_abs <= data.error.max and i < data.max_iter):
            error_message = f"Se alcanzo el error maximo antes de la iteracion {data.max_iter}"
            break
        
        x0 = x1
        x1 = x2
        x2 = x

    return {
        "raiz": x,
        "tabla": tabla,
        "aproximaciones": aproximaciones,
        "error_message":error_message
    }