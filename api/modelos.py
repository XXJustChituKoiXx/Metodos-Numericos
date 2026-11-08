from pydantic import BaseModel
from typing import Union, List, Optional, Any
class FloatNumberModel(BaseModel):
    number: str
    bits: int

class BisexionModel(BaseModel):
    function: str
    a: float
    b: float
    error_max: float = 1e-8
    max_iter: int = 100

class SecanteModel(BaseModel):
    funcion: str
    a: float
    b: float
    error_max: float = 1e-8
    max_iter: int = 100

class NewthonRaphsonModel(BaseModel):
    function: str
    x0: float
    error_max: float = 1e-8
    max_iter: int = 100

class PuntoFijoModel(BaseModel):
    funcion: str
    a: float
    error_max: float = 1e-8
    max_iter: int = 100

class FakePositionModel(BaseModel):
    function: str
    x0: float
    x1: float
    error_max: float = 1e-8
    max_iter: int = 100

class SteffencenModel(BaseModel):
    function: str
    error_max: float = 1e-8
    max_iter: int = 100

class MullerModel(BaseModel):
    function: str
    x0: float
    x1: float
    x2: float
    error_max: float = 1e-8
    max_iter: int = 100

class HornerModel(BaseModel):
    coeficientes: Union[str, List[float]]
    a: float
    error_max: float = 1e-8
    max_iter: int = 100

class DeflacionModel(BaseModel):
    function: str
    x0: float
    x1: float
    x2: float
    error_max: float = 1e-8
    max_iter: int = 100

class LagrangeModel(BaseModel):
    puntos: Union[str, List[List[float]]]
    x_evaluar: Optional[float] = None