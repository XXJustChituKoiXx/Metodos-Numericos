# Métodos Numéricos

## Instalación

```bash
pip install fastapi
python -m uvicorn app:app --reload
python -m uvicorn api.app:app --reload
pip install sympy
```

## Estado de los métodos

| Símbolo | Significado |
|:---:|---|
| ✅ | Terminado |
| ⚠️ | En producción |
| ❗ | No empezado |

## Métodos numéricos (para raíces)

| Método | Responsable | Estado |
|---|---|:---:|
| Flotante a Bin | RICARDO | ✅ |
| Bisección | ISIS | ✅ |
| Secante | FERNANDO | ✅ |
| Falsa posición | RICARDO | ✅ |
| Newton-Raphson | RICARDO | ✅ |
| Punto Fijo | FERNANDO | ✅ |
| Steffensen | ISIS | ✅ |
| Deflación | ISIS | ✅ |
| Horner | FERNANDO | ✅ |
| Müller | RICARDO | ✅ |

## Interpolaciones

| Método | Responsable | Estado | Notas |
|---|---|:---:|---|
| Lagrange | FERNANDO | ✅ | |
| Neville | ISIS | ⚠️ | Interfaz, conectar con página |
| Diferencias divididas | RICARDO | ✅ | |
| Igualmente espaciados | ISIS | ⚠️ | |
| Hermite | FERNANDO | ⚠️ | |
| Splines cúbicos | RICARDO | ⚠️ |  |

## Derivación

| Método | Responsable | Estado |
|---|---|:---:|
| Fórmula de 2 puntos (hacer serie de Taylor también) | ISIS | ❗ |
| Fórmula 2 puntos igual espaciada | FERNANDO | ❗ |
| Fórmula 3 puntos igual espaciada | RICARDO | ❗ |

## Integración

| Método | Responsable | Estado |
|---|---|:---:|
| Trapecio (simple y compuesto) | ISIS | ❗ |
| Simpson 1/3 (simple y compuesto) | FERNANDO | ❗ |
| Simpson 3/8 (simple y compuesto) | RICARDO | ❗ |
| Extrapolación de Richardson y Romberg | FERNANDO | ❗ |
| Cuadratura adaptativa | RICARDO | ❗ |
| Cuadratura gaussiana (simple y compuesto) | ISIS | ❗ |
| Integración múltiple (Trapecio compuesto...) | FERNANDO | ❗ |

## Ecuaciones Diferenciasles
| Método | Responsable | Estado |
|---|---|:---:|
| Euler |  | ❗ |
| Taylor de Orden n|  | ❗ |
| Runge Kutta |  | ❗ |

## Programas para testear

- Postman

## Clases reutilizables de CSS

- `.menu-metodos`
- `.inputs-div`
- `.send-button`
- `.error-message`

## Especificación de métodos

**Parámetros:** variable de función, intervalo 1, intervalo 2, error máximo, máximo de iteraciones

**Salida:**

```json
{
  "raiz": "",
  "tabla": "",
  "aproximaciones": ""
}
```

## Generales

- Hacer generador de tabla