-Libreerias de Python
pip install fastapi
python -m uvicorn app:app --reload
python -m uvicorn api.app:app --reload
pip install sympy
-Librerias de js

Metodos
✅-terminado
⚠️-en produccion
❗-no empezado

Metodos Numericos
-Flotante a Bin    RICARDO  ✅
-Biseccion         ISIS     ✅ 
-Secante           FERNANDO ✅
-Falsa posicion    RICARDO  ✅
-Newton-Raphson    RICARDO  ✅
-Punto Fijo        FERNANDO ✅ 
-Steffensen        ISIS     ✅
-Deflacion         ISIS     ✅  
-Horner            FERNANDO ✅ 
-Muller            RICARDO  ✅

Interpolaciones
-Lagrange                   FERNANDO    ❗
-Neville                    ISIS        ⚠️  Interfaz, conectar con pagina
-Lagrange                   FERNANDO    ⚠️ Solo falta grafica con chart js
-Neville                    ISIS        ❗
-Diferiencias divididas     RICARDO     ⚠️ Ibterfaz Grafica
-Igualmente espaciados      ISIS        ⚠️
-Hermite                    FERNANDO    ❗
-Splines Cubicos            RICARDO     ⚠️ TODO ALV

Derivacion
-Formula de 2 puntos 
    (Hacer serie de Taylor tmb) ISIS        ❗
-Formula 2 puntos igual espacia FERNANDO    ❗
-Formula 3 puntos igual espacia RICARDO     ❗

Integracion
-Trapecio                                   ISIS        ❗
-Simpson 1/3                                FERNANDO    ❗
-Simpson 3/8                                RICARDO     ❗
-Trapecio compueto                          ISIS        ❗
-Extrapolacion Richardson                   FERNANDO    ❗
-Cuadratura Adaptativa                      RICARDO     ❗
-Cuadratura Gaussiana                       ISIS        ❗

-Integracion multiple (Trapcio compuesto...) FERNANDO   ❗

Programas pa testear
- Postman

Clases re-usables de CSS
.menu-metodos
.inputs-div
.send-button
.error-message

metodos:
    parametros: 
        (variable de funcion,intervalo 1, intervalo 2, error maximo, maximo de iteraciones)
    salida: 
        {
            "raiz"
            "tabla"
            "aproximaciones"
        }

generales:
    -hacer generador de tabla