from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.parcial1.float_to_bin import *

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
