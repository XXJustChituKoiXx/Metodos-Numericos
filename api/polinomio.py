class Polinomio:
    def __init__(self, grado, coeficientes, funcion=None,raices=None):
        self.grado = grado
        self.coeficientes = [complex(c) for c in coeficientes]  # grande -> pequeño
        self.raices=  list(raices) if raices else []
        self.funcion=funcion

    def _gen_texto_funcion(self):
        terminos = []
        n = self.grado

        for i, c in enumerate(self.coeficientes):
            c = complex(c).real       
            if abs(c) < 1e-15:# saltar coeficientes cero
                continue

            grado = n - i 

            if grado == 0:
                terminos.append(f"{c:g}")
            else:
                if abs(c - 1) < 1e-15:
                    coef_str = ""  # 1*x -> "x"
                elif abs(c + 1) < 1e-15:
                    coef_str = "-"
                else:
                    coef_str = f"{c:g}*"

                if grado == 1:
                    x_str = "x"
                else:
                    x_str = f"x**{grado}"

                terminos.append(f"{coef_str}{x_str}")

        if not terminos:
            return "0"

        texto = terminos[0]
        for t in terminos[1:]:
            if t.startswith("-"):
                texto += f" - {t[1:]}"
            else:
                texto += f" + {t}"
                
        self.funcion=texto
        return texto

    def _div_sint(self, raiz):
        raiz = complex(raiz)
        coef = self.coeficientes
        n = len(coef) - 1
        if n < 1:
            raise ValueError("No se puede usar division sintetica")

        b = [0j] * n
        b[0] = coef[0]
        for i in range(1, n):
            b[i] = coef[i] + raiz * b[i - 1]

        return Polinomio(n - 1, b)

    def evaluar(self, x):
        return self.funcion(x)

    def agregar_raiz(self, raiz, tol=1e-8):

        r = complex(raiz)
        for existente in self.raices:
            if abs(existente - r) < tol:
                return False
        self.raices.append(r)
        return True
    
    def agregar_raices(self, lista_raices, tol=1e-8):
        """Agrega varias  de una vez"""
        for r in lista_raices:
            self.agregar_raiz(r, tol)

    def limpiar_raices(self):
        """Borra todas las  guardadas"""
        self.raices = []

    
    def suma(self, otro):
        a, b = self._alinear(otro)
        coef = [ai + bi for ai, bi in zip(a, b)]
        return Polinomio(lambda x: self.evaluar(x) + otro.evaluar(x),
                         len(coef) - 1, coef)

    def resta(self, otro):
        a, b = self._alinear(otro)
        coef = [ai - bi for ai, bi in zip(a, b)]
        return Polinomio(lambda x: self.evaluar(x) - otro.evaluar(x),
                         len(coef) - 1, coef)

    def multiplicacion(self, otro):
        a, b = self.coeficientes, otro.coeficientes
        coef = [0j] * (len(a) + len(b) - 1)
        for i, ai in enumerate(a):
            for j, bj in enumerate(b):
                coef[i + j] += ai * bj
        return Polinomio(lambda x: self.evaluar(x) * otro.evaluar(x),
                         len(coef) - 1, coef)

    @staticmethod
    def _eval_coef(coef, x):
        x = complex(x)
        y = 0j
        for c in coef:
            y = y * x + c
        return y
