from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parcial1.float_to_bin import float_to_bin
from parcial1.secante import sec_method
from parcial1.falsa_posicion import fake_position_metod
from parcial1.newthon_raphson import newton_raphson
from parcial1.muller import muller_method

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
    a: float
    b: float
    error_max: float = 1e-8
    max_iter: int = 100
 
 
@app.post("/secante")
def calcular_secante(data: SecanteModel):
    return sec_method(data)

#Newton-Raphson method
class NewthonRaphsonModel(BaseModel):
    function: str
    x0: float
    #x1: float este metodo solo ocupa una aproximacion
    error_max: float = 1e-8
    max_iter: int = 100
 
 
@app.post("/newton_raphson")
def calcular_newton_raphson(data: NewthonRaphsonModel):
    return newton_raphson(data)

#Falsa-Posicion method
class FakePositionModel(BaseModel):
    function: str
    x0: float
    x1: float
    error_max: float = 1e-8
    max_iter: int = 100
 
@app.post("/fake_position")
def calcular_fake_position(data: FakePositionModel):
    return fake_position_metod(data)

#Muller method
class MullerModel(BaseModel):
    function: str
    x0: float
    x1: float
    x2: float #este metodo necesita 3 aproximaciones
    error_max: float = 1e-8
    max_iter: int = 100
 
@app.post("/muller")
def calcular_Muller(data: MullerModel):
    return muller_method(data)
