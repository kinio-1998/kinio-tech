# Backend para Cotizaciones

Este backend pequeño provee un endpoint para generar PDFs de cotización a partir de una plantilla.

Requisitos
- Python 3.9+

Instalación (PowerShell)

```powershell
cd "c:\Users\personal\Desktop\Carlos\Nueva carpeta\Kinio-Tech.github.io\backend"
py -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Ejecución (desarrollo)

```powershell
# desde carpeta backend
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Uso
- Coloca tu plantilla PDF en `backend/templates/cotizacion_template.pdf` (la plantilla debe existir y tener al menos 1 página).
- Llama al endpoint POST `http://localhost:8000/cotizar` con JSON que respete el siguiente esquema:

```json
{
  "client_name": "Carlos Daniel Duarte León",
  "client_email": "carlos.duarte@example.com",
  "client_phone": "6678192130",
  "client_address": "San Pedro 3638, San Benito",
  "items": [
    {
      "description": "Instalación de cámaras de seguridad",
      "qty": 2,
      "price": 1500.0
    },
    {
      "description": "Configuración de red",
      "qty": 1,
      "price": 800.0
    }
  ],
  "service_type": "mantenimiento",
  "notes": "El servicio incluye garantía de 6 meses."
}
```

Respuesta
```json
{
  "pdf_path": "C:\\...\\backend\\output\\20250927_cotizacionJuan_Perez.pdf"
}
```

Nomenclatura
- El fichero se guarda como `aaaammdd_cotizacionNombreCliente.pdf` (sin guion bajo entre "cotizacion" y el nombre).
- Si ya existe, se añade un número al final: `...NombreCliente1.pdf`, `...NombreCliente2.pdf`, etc.

Ajustes
- Las coordenadas donde se dibujan los textos están en `app.py`. Ajusta según tu plantilla.
