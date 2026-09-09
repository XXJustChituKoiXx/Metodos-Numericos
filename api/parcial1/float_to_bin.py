from auxiliares import *
from fastapi import HTTPException, status

def float_to_bin(data):
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