import sys, os
ruta_api = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ruta_api)


def _parse_puntos(puntos):
    if isinstance(puntos, list):
        return [[float(p[0]), float(p[1])] for p in puntos]
    txt = puntos.replace("\n", ";")
    pares = []
    for chunk in txt.split(";"):
        chunk = chunk.strip()
        if not chunk:
            continue
        vals = chunk.split(",")
        if len(vals) != 2:
            raise ValueError(f"Punto invalido: '{chunk}' (debe ser 'x,y')")
        pares.append([float(vals[0].strip()), float(vals[1].strip())])
    return pares


def _neville(puntos, x_eval):
    pares = _parse_puntos(puntos)
    n = len(pares)
    if n < 1:
        return {"resultado": None, "tabla": [], "mensaje": "Sin puntos"}
    xs = [p[0] for p in pares]
    ys = [p[1] for p in pares]

    N = [[0.0] * n for _ in range(n)]
    for i in range(n):
        N[i][0] = ys[i]

    for j in range(1, n):
        for i in range(n - j):
            denom = xs[i] - xs[i + j]
            if abs(denom) < 1e-15:
                return {"resultado": None, "tabla": [], "mensaje": "Nodos repetidos"}
            N[i][j] = ((x_eval - xs[i + j]) * N[i][j - 1]
                       - (x_eval - xs[i]) * N[i + 1][j - 1]) / denom

    tabla = []
    for i in range(n):
        fila = [i]
        for j in range(n):
            fila.append(N[i][j] if j <= n - 1 - i else None)
        tabla.append(fila)

    return {"resultado": N[0][n - 1], "tabla": tabla, "n": n,
            "x_evaluar": x_eval,
            "mensaje": f"Polinomio interpolante evaluado en x = {x_eval}"}


def ctr_neville(data):
    try:
        return _neville(data.puntos, data.x_evaluar)
    except Exception as e:
        return {"resultado": None, "tabla": [], "mensaje": f"Error: {e}"}