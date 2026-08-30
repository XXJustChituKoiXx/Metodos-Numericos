from fastapi import FastAPI,HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auxiliares import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Representacion de punto flotante 
class FloatNumberModel(BaseModel):
    number:str
    bits:int

@app.post("/float_number")
def float_number_representation(data:FloatNumberModel):
    
    if data.bits != 16 and data.bits != 32 and data.bits != 64:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "La representación debe ser de 16,32 o 64 bits."
        )
    try:
        float(data.number)
    except ValueError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "El número no es un float."
        )
     
    signo:int = 0 if float(data.number) >= 0 else 1
    abs_number:str = data.number.replace("-","")
    if "." in abs_number:
        dot_position:int = abs_number.find(".")
        int_part:int = int(abs_number[:dot_position])
        dec_part:float = float(abs_number[dot_position:])
        #transformar a binario
    else:
        int_part:int = int(abs_number)
        dec_part:float = 0.0
        #transformar a binario
    return {
        "Parte entera": int_part,
        "Parte decimal": dec_part
    }
    






#Root
@app.get("/")
def read_root():
    return {"message":"holi uwu"}