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
    HornerModel,
    DeflacionModel,
    LagrangeModel,
    NevilleModel,
    IgualmenteEspaciadosModel,
    Derivacion2PuntosModel,
    TrapecioModel,
    GaussianaModel,
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
from parcial1.neville import ctr_neville
from parcial1.Igualmente_esp import ctr_igualmente_espaciados
from parcial2.Derivacion.derivacion_2puntos import ctr_derivacion_2puntos
from parcial2.Integracion.trapecio import ctr_trapecio
from parcial2.Integracion.gaussiana import ctr_gaussiana

app = FastAPI()

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

@app.post("/horner")
def calcular_Horner(data: HornerModel):
    return horner_method(data)

@app.post("/deflacion")
def calcular_Deflacion(data: DeflacionModel):
    return ctr_deflacion(data)

@app.post("/lagrange")
def calcular_lagrange(data: LagrangeModel):
    return lagrange_method(data)

@app.post("/neville")
def calcular_neville(data: NevilleModel):
    return ctr_neville(data)

@app.post("/igualmente_espaciados")
def calcular_igualmente_espaciados(data: IgualmenteEspaciadosModel):
    return ctr_igualmente_espaciados(data)

@app.post("/derivacion_2puntos")
def calcular_derivacion_2puntos(data: Derivacion2PuntosModel):
    return ctr_derivacion_2puntos(data)

@app.post("/trapecio")
def calcular_trapecio(data: TrapecioModel):
    return ctr_trapecio(data)

@app.post("/gaussiana")
def calcular_gaussiana(data: GaussianaModel):
    return ctr_gaussiana(data)