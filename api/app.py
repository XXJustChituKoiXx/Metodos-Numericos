from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.parcial1.float_to_bin import *
from auxiliares import *
from parcial1.secante import construir_funcion, metodo_secante

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

class FloatNumberModel(BaseModel):
    number: str
    bits: int
    
@app.post("/float_number")
def float_number_representation(data: FloatNumberModel):
    return float_to_bin(data)



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