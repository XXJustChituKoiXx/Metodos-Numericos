import math
import cmath
from sympy.parsing.sympy_parser import (parse_expr, standard_transformations, implicit_multiplication_application)

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
    transformations = standard_transformations + (
        implicit_multiplication_application,
    )
    funcion = parse_expr(
        expresion,
        transformations=transformations
    )
    def f(x):
        return float(funcion.subs("x", x))
    return f

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

def normalizar_bin(int_part: str, dec_part: str) -> dict:
    bin_num: str = f"{int_part}.{dec_part}"
    dot_pos: int = bin_num.find(".")
    first_one: int = bin_num.find("1")
    exponente: int

    if dot_pos > first_one:
        exponente = dot_pos - first_one - 1
    else:
        exponente = dot_pos - first_one

    cadena_sin_punto: str = bin_num.replace(".", "")
    idx_ajustado = first_one if first_one < dot_pos else first_one - 1
    parte_despues_del_uno = cadena_sin_punto[idx_ajustado + 1:]
    if not parte_despues_del_uno:
        parte_despues_del_uno = "0"
        
    mantisa_normalizada = f"1.{parte_despues_del_uno}"
    return {
        "exponente": exponente,
        "mantisa_normalizada": mantisa_normalizada,
        "bits_mantisa": parte_despues_del_uno 
    }

def crear_funcion_compleja(funcion):
    def f(x):
        return eval(
            funcion,
            {
                "x": x,
                "sqrt": cmath.sqrt,
                "sin": cmath.sin,
                "cos": cmath.cos,
                "tan": cmath.tan,
                "exp": cmath.exp,
                "log": cmath.log,
                "pi": cmath.pi,
                "e": cmath.e
            }
        )
    return f

def convertir_complex(valor):
    if isinstance(valor, complex):
        return {
            "real": valor.real,
            "imag": valor.imag
        }
    return valor


# --- FUNCIONES AUXILIARES MATEMÁTICAS PARA POLINOMIOS / INTERPOLACIÓN ---

def multiplicar_por_factor(coeficientes: list, r: float) -> list:
    n = len(coeficientes)
    A = coeficientes + [0.0]
    B = [0.0] + [c * (-r) for c in coeficientes]
    return [A[k] + B[k] for k in range(n + 1)]

def sumar_coeficientes(a: list, b: list) -> list:
    largo = max(len(a), len(b))
    a_ajustada = [0.0] * (largo - len(a)) + list(a)
    b_ajustada = [0.0] * (largo - len(b)) + list(b)
    return [a_ajustada[k] + b_ajustada[k] for k in range(largo)]

def escalar_coeficientes(coeficientes: list, k: float) -> list:
    return [c * k for c in coeficientes]

def limpiar_ceros(coeficientes: list) -> list:
    limpios = list(coeficientes)
    while len(limpios) > 1 and abs(limpios[0]) < 1e-12:
        limpios.pop(0)
    return limpios

def evaluar_coeficientes(coeficientes: list, x: float) -> float:
    y = 0.0
    for c in coeficientes:
        y = y * x + c
    return y