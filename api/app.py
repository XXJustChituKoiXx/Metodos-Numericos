from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auxiliares import *
from parcial1.secante import construir_funcion, metodo_secante

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FloatNumberModel(BaseModel):
    number: str
    bits: int
    
@app.post("/float_number")
def float_number_representation(data: FloatNumberModel):
    #validar los bits y asignar tamaños
    if data.bits == 16:
        despla_expo = 15
        tam_exponente = 5
        tam_mantisa = 10
    elif data.bits == 32:
        despla_expo = 127
        tam_exponente = 8
        tam_mantisa = 23
    elif data.bits == 64:
        despla_expo = 1023
        tam_exponente = 11
        tam_mantisa = 52
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La representación debe ser de 16, 32 o 64 bits."
        )
    #validar que se resiva un float
    try:
        float(data.number)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número no es un float válido."
        )
    #obtener signo
    signo: int = 0 if float(data.number) >= 0 else 1
    abs_number: str = data.number.replace("-", "")
    #comprobar si es entero o float, separar y transformar en binario la parte entera y decimal por separado
    if "." in abs_number:
        dot_position: int = abs_number.find(".")
        int_part: int = int(abs_number[:dot_position])
        dec_part: float = float(abs_number[dot_position:])
        
        int_part_bin = int_to_bin(int_part)
        dec_part_bin = dec_to_bin(dec_part, len(int_part_bin))
    else:
        int_part: int = int(abs_number)
        dec_part: float = 0.0
        
        int_part_bin = int_to_bin(int_part)
        dec_part_bin = "0"

    #unir las partes en un solo string para obtener el exponente y normalizar despues
    normalizado = normalizar_bin(int_part_bin, dec_part_bin)

    #desplazar el exponente segun el tamaño para convertirlo en un exponente sin signo y convertirlo en binario
    exponente_con_sesgo = int(normalizado['exponente']) + despla_expo
    exponente_bin = int_to_bin(exponente_con_sesgo).zfill(tam_exponente) #ZFILL RELLENA CON 0 AL INICIO DEL STRING SEGUN LO QUE FALTE(en enteros el cero a la derecha no cambia el valor)

    #recuperar mantiza normalisada, si le faltan bits se agregan a la derecha(en decimal el 0 a la derecha no afecta nada jaja)
    mantisa_cruda = normalizado['bits_mantisa']
    mantisa_final = mantisa_cruda.ljust(tam_mantisa, "0")[:tam_mantisa] #LJUST AGREGA 0 AL FINAL SEGUN LO QUE FALTE
    
    float_in_bin = f"{signo}{exponente_bin}{mantisa_final}"

    return {
        "bit_signo": signo,
        "bits_exponente": exponente_bin,
        "bits_mantisa": mantisa_final,
        "float_in_bin": float_in_bin
    }



@app.get("/")
def read_root():
    return {"message": "holi uwu"}


class SecanteModel(BaseModel):
    funcion: str
    x0: float
    x1: float
    error_max: float = 1e-8
    max_iter: int = 100
 
 
@app.post("/secante")
def calcular_secante(data: SecanteModel):
    # Validar que la expresion se pueda evaluar antes de arrancar
    f = construir_funcion(data.funcion)
    try:
        f(data.x0)
        f(data.x1)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La funcion no es valida. Usa 'x' como variable, "
                   "por ejemplo: x**3 - 5*x + 3"
        )
 
    if data.error_max <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El error maximo debe ser mayor a cero."
        )
 
    if data.max_iter < 1 or data.max_iter > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las iteraciones deben estar entre 1 y 1000."
        )
 
    try:
        resultado = metodo_secante(f, data.x0, data.x1, data.error_max, data.max_iter)
    except (ValueError, ZeroDivisionError) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except OverflowError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El metodo diverge con esos valores iniciales."
        )
 
    return resultado