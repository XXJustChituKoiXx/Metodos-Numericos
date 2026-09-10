'''
lo que hace este metodo, es que usando algun metodo que obtenga la raiz
de la funcion normal, nosotros la bajamos un grado para ir obteniendo todas las raices

asi por ekemplo usamos Newthon-Rhapson y sacamos una raiz, bajamos un grado y sacamos
otra hasta que sea de grado 1 y solo sea un despeje

'''

def deflacion_met(funcion, a,b, MAX_err, MAX_iter):
    funct=''.split(funcion)
    