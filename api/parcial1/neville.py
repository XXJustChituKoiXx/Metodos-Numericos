def neville(x_vals, y_vals, x):
    
    n = len(x_vals)
    # Tabla de Neville Q[i][j]
    Q = [[0.0] * n for _ in range(n)]

    # Inicializar primera columna con y_vals
    for i in range(n):
        Q[i][0] = y_vals[i]

    # Construir la tabla
    for j in range(1, n):
        for i in range(n - j):
            Q[i][j] = ((x - x_vals[i + j]) * Q[i][j - 1]
                       - (x - x_vals[i]) * Q[i + 1][j - 1]) \
                      / (x_vals[i] - x_vals[i + j])

    return Q[0][n - 1], Q


def imprimir_tabla(Q, x_vals):
    n = len(Q)
    print("\nTabla de Neville:")
    print("i\\j", end="\t")
    for j in range(n):
        print(f"Q[i][{j}]", end="\t")
    print()
    for i in range(n):
        print(f"{i}", end="\t")
        for j in range(n - i):
            print(f"{Q[i][j]:.6f}", end="\t")
        print()


# Usar
if __name__ == "__main__":
    # Datos de ejemplo: f(x) = cos(x)
    import math
    x_vals = [0.0, 0.6, 0.9, 1.1]
    y_vals = [math.cos(x) for x in x_vals]
    x_eval = 0.8

    valor, tabla = neville(x_vals, y_vals, x_eval)

    imprimir_tabla(tabla, x_vals)
    print(f"\nP({x_eval}) ≈ {valor:.8f}")
    print(f"cos({x_eval}) = {math.cos(x_eval):.8f}")
    print(f"Error        = {abs(valor - math.cos(x_eval)):.2e}")