import sympy as sp

def newton_raphson(data):
    ## tabla: i | xn | f(x) | f'(x) | xnp1 | Error abs
    tabla = []
    aproximaciones = []
    error_message = ""
    x = sp.Symbol('x')
    function = sp.sympify(data.function)
    derivada = sp.diff(function, x)
    
    xn = data.x0
    
    for i in range(data.max_iter):
        aproximaciones.append(xn)
        
        f_xn = float(function.subs(x, xn))
        df_xn = float(derivada.subs(x, xn))
        
        if df_xn == 0:
            error_message ="Error: La derivada se hizo cero. El método no puede continuar."
            break
            
        xnp1 = xn - (f_xn / df_xn)
        error = abs(xnp1 - xn) 
        tabla.append([i, xn, f_xn, df_xn, xnp1, error])
        xn = xnp1    
        
        if(error <= data.error.max and i < data.max_iter):
            error_message = f"Se alcanzo el error maximo antes de la iteracion {data.max_iter}"
            break

    return {
        "raiz": xn,
        "tabla": tabla,
        "aproximaciones": aproximaciones,
        "error_message":error_message
    }
