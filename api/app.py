from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parcial1.float_to_bin import float_to_bin
from parcial1.secante import sec_method

#crea la fakin app del server
app = FastAPI()
#configuracion del corse para que no pete con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#float number
class FloatNumberModel(BaseModel):
    number: str
    bits: int
    
@app.post("/float_number")
def float_number_representation(data: FloatNumberModel):
    return float_to_bin(data)


#secante method
class SecanteModel(BaseModel):
    funcion: str
    x0: float
    x1: float
    error_max: float = 1e-8
    max_iter: int = 100
 
 
@app.post("/secante")
def calcular_secante(data: SecanteModel):
    return sec_method(data)





@app.post("/")
def inicio():
    return {
        "a": "a"
    }