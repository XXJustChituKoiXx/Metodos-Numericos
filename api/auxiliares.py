import math
import cmath
from types import MethodType

FUNCIONES_PERMITIDAS = {
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "exp": math.exp,
    "log": math.log,
    "log10": math.log10,
    "sqrt": math.sqrt,
    "abs": abs,
    "pi": math.pi,
    "e": math.e,
}

def construir_funcion(expresion: str):
    """Convierte el string del usuario en una funcion de Python.

    Se evalua con un entorno restringido: sin builtins y solo con las
    funciones matematicas del diccionario de funciones permitidas. Esto evita que alguien
    mande codigo arbitrario en la expresion.
    """
    def f(x: float) -> float:
        entorno = dict(FUNCIONES_PERMITIDAS) #Copia del diccionario de funciones permitidas
        entorno["x"] = x
        resultado = eval(expresion, entorno)
        return float(resultado)

    return f

class Polinomio:
    def __init__(self, grado, coeficientes, raices=None):
        self.grado = grado
        self.coeficientes = [complex(c) for c in coeficientes]  # grande -> pequeño
        self.raices=  list(raices) if raices else []

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
        x = complex(x)
        y = 0j
        for c in self.coeficientes:
            y = y * x + c
        return y

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

    def escalar(self, k):
        k = complex(k)
        coef = [k * c for c in self.coeficientes]
        return Polinomio(lambda x: k * self.evaluar(x), self.grado, coef)

    @staticmethod
    def _eval_coef(coef, x):
        x = complex(x)
        y = 0j
        for c in coef:
            y = y * x + c
        return y


def int_to_bin(num: int) -> str:
    if num == 0:
        return "0"
        
    num_bin: str = ""
    while num > 0: 
        num_bin = str(num % 2) + num_bin
        num = num // 2
        
    return num_bin

def dec_to_bin(num: float, len_int: int) -> str:
    if num == 0.0:
        return "0"

    dec_bin: str = ""
    bits_faltantes: int = 11 - len_int 
    #mantisa = 10 bits, 10 = (len Parte entera - 1(ya normalizado)) + bits faltantes parte decimal
    #por lo tanto bits faltantes = 11 - largo de la parte entera en binario
    
    for _ in range(bits_faltantes):
        mult_num = num * 2
        mult_str = str(mult_num)
        
        dot_pos = mult_str.find(".")
        bit_entero = mult_str[:dot_pos]

        dec_bin = dec_bin + bit_entero
        
        num = mult_num - int(bit_entero)
        if num == 0.0:
            break
            
    return dec_bin


def normalizar_bin(int_part:str,dec_part:str) -> dict:
    bin_num:str = f"{int_part}.{dec_part}"
    dot_pos:int = bin_num.find(".")
    first_one:int = bin_num.find("1")
    exponente:int


    if dot_pos > first_one  :
        exponente = dot_pos - first_one - 1
        
    else:
        exponente = dot_pos - first_one

    cadena_sin_punto:str = bin_num.replace(".", "") #limpiar cadena
    idx_ajustado = first_one if first_one < dot_pos else first_one - 1 #ajustar la posicion del primer 1 solo si estaba despues del punto
    parte_despues_del_uno = cadena_sin_punto[idx_ajustado + 1:] #extraer todo despues del primer 1
    if not parte_despues_del_uno:
        parte_despues_del_uno = "0" #si solo hay un 1 entonces el resto es 0 
        
    mantisa_normalizada = f"1.{parte_despues_del_uno}"
    return {
        "exponente": exponente,
        "mantisa_normalizada": mantisa_normalizada,
        "bits_mantisa": parte_despues_del_uno 
    }