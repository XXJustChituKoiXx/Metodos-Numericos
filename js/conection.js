export async function conectApi(body, direction){
    console.log(body)
        try {
        const response = await fetch(`http://127.0.0.1:8000/${direction}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
            return data;

    } catch (error) {
        console.error("Error al conectar con la API:", error);
        return null;
    }
}