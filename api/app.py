from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modelos import (
    FloatNumberModel,
    BisexionModel,
    SecanteModel,
    NewthonRaphsonModel,
    PuntoFijoModel,
    FakePositionModel,
    SteffencenModel,
    MullerModel,
    DeflacionModel,
    LagrangeModel
)

from parcial1.float_to_bin import float_to_bin
from parcial1.secante import sec_method
from parcial1.punto_fijo import pf_method
from parcial1.falsa_posicion import fake_position_metod
from parcial1.newthon_raphson import newton_raphson
from parcial1.muller import muller_method
from parcial1.horner import horner_method
from parcial1.deflacion import ctr_deflacion
from parcial1.bisexion import biseccion
from parcial1.steffensen import ctr_Steff
from parcial2.lagrange import lagrange_method

# crea la fakin app del server
app = FastAPI()

# configuracion del corse para que no pete con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/float_number")
def float_number_representation(data: FloatNumberModel):
    return float_to_bin(data)

@app.post("/biseccion")
def calcular_Bisexion(data: BisexionModel):
    return biseccion(data)

@app.post("/secante")
def calcular_secante(data: SecanteModel):
    return sec_method(data)

@app.post("/newton_raphson")
def calcular_newton_raphson(data: NewthonRaphsonModel):
    return newton_raphson(data)

@app.post("/punto_fijo")
def calcular_punto_fijo(data: PuntoFijoModel):
    return pf_method(data)

@app.post("/fake_position")
def calcular_fake_position(data: FakePositionModel):
    return fake_position_metod(data)

@app.post("/steffensen")
def calcular_Steffensen(data: SteffencenModel):
    return ctr_Steff(data)

@app.post("/muller")
def calcular_Muller(data: MullerModel):
    return muller_method(data)

@app.post("/deflacion")
def calcular_Deflacion(data: DeflacionModel):
    return ctr_deflacion(data)

@app.post("/lagrange")
def calcular_lagrange(data: LagrangeModel):
    return lagrange_method(data)