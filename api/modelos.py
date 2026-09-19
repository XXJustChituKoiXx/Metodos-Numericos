from pydantic import BaseModel

#estos son modelos que usan las peticiones desde otros metodos
class MullerModel(BaseModel):
    function: str
    x0: complex
    x1: complex
    x2: complex #este metodo necesita 3 aproximaciones
    error_max: float = 1e-8
    max_iter: int = 100

class BisexionModel(BaseModel):
    function: str
    a: float
    b: float
    error_max: float = 1e-8
    max_iter: int = 100