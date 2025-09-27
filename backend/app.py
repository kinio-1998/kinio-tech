from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import re
import os
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter
from fastapi.middleware.cors import CORSMiddleware


class QuoteItem(BaseModel):
    description: str | None = None
    qty: int | None = None
    price: float | None = None


class QuoteData(BaseModel):
    client_name: str
    client_email: str | None = None
    client_phone: str | None = None
    client_address: str | None = ""
    items: list[QuoteItem] | None = []
    service_type: str | None = None
    labor_fee: float | None = None
    notes: str | None = ""


app = FastAPI(title="Cotizaciones API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def sanitize_name(name: str) -> str:
    # keep letters, numbers and spaces, then replace spaces with underscore
    s = re.sub(r"[^A-Za-z0-9 ]+", "", name).strip()
    return re.sub(r"\s+", "_", s)


def create_quote_pdf(data: QuoteData, template_path: str, output_dir: str) -> str:
    os.makedirs(output_dir, exist_ok=True)

    reader = PdfReader(template_path)
    if not reader.pages:
        raise RuntimeError("La plantilla PDF no tiene páginas")

    template_page = reader.pages[0]
    width = float(template_page.mediabox.width)
    height = float(template_page.mediabox.height)

    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))

    # Fuente
    font_name = "Helvetica"
    c.setFont(font_name, 10)
    c.setFillColorRGB(0, 0, 0)

    # ==== DATOS DEL CLIENTE ====
    # Coordenadas medidas contra tu PDF
    c.drawString(135, height - 175, data.client_name)          # Nombre
    c.drawString(135, height - 187, data.client_email or "")   # Correo
    c.drawString(135, height - 200, data.client_phone or "")   # Teléfono
   
    # ==== DATOS DEL EMPRESA ====
    # Coordenadas medidas contra tu PDF
    c.drawString(375, height - 177, "Carlos Daniel Duarte León")          # Nombre
    c.drawString(375, height - 188, "San Pedro 3638, San Benito" )   # Direccion
    c.drawString(375, height - 200, "DULC980506MV0")   # RFC

    # ==== FECHA ====
    today = datetime.now().strftime("%d/%m/%Y")
    c.drawString(135, height - 270, today)

    # ==== TABLA DE ITEMS ====
    start_y = height - 320  # punto inicial de la tabla en tu template
    row_height = 18
    total_sum = 0.0

    if data.items:
        for idx, it in enumerate(data.items):
            y = start_y - idx * row_height
            qty = int(it.qty or 0)
            price = float(it.price or 0.0)
            line_total = qty * price
            total_sum += line_total

            desc = it.description or ""
            if len(desc) > 50:
                desc = desc[:47] + "..."

            # Dibujar los textos
            c.drawString(85, y, desc)
            c.drawRightString(330, y, str(qty))
            c.drawRightString(430, y, f"${price:,.2f}")
            c.drawRightString(520, y, f"${line_total:,.2f}")

            # === DIBUJAR LÍNEA SEPARADORA ===
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # gris clarito
            c.setLineWidth(0.5)
            c.line(80, y - 3, 525, y - 3)  # x1, y1, x2, y2

    # ==== MANO DE OBRA ====
    LABOR_PRICING = {
        "instalacion": 120.0,
        "mantenimiento": 80.0,
        "reparacion": 100.0,
        "default": 90.0,
    }
    labor_fee = None
    if data.labor_fee is not None:
        labor_fee = float(data.labor_fee)
    elif data.service_type:
        labor_fee = LABOR_PRICING.get(data.service_type.lower(), LABOR_PRICING["default"])

    if labor_fee is not None:
        y = start_y - (len(data.items or [])) * row_height
        c.drawString(85, y, f"Mano de obra: {data.service_type or 'Servicio'}")
        c.drawRightString(325, y, "1")
        c.drawRightString(430, y, f"${labor_fee:,.2f}")
        c.drawRightString(520, y, f"${labor_fee:,.2f}")
        total_sum += labor_fee

    # === DIBUJAR LÍNEA SEPARADORA ===
        c.setStrokeColorRGB(0.7, 0.7, 0.7)  # gris clarito
        c.setLineWidth(0.5)
        c.line(80, y - 3, 525, y - 3)  # x1, y1, x2, y2

    # ==== TOTAL ====
    y -= 1 * row_height
    c.setFont(font_name, 11)
    c.drawRightString(520, y, f"TOTAL: ${total_sum:,.2f}")

    # ==== NOTAS ====
    if data.notes:
        y -= 2 * row_height
        c.setFont(font_name, 10)
        c.drawString(85, y, f"Notas: {data.notes}")

    c.save()
    packet.seek(0)

    overlay_reader = PdfReader(packet)
    writer = PdfWriter()
    page = reader.pages[0]
    page.merge_page(overlay_reader.pages[0])
    writer.add_page(page)

    date = datetime.now().strftime("%Y%m%d")
    name_s = sanitize_name(data.client_name) or "cliente"
    filename = f"{date}_cotizacion{name_s}.pdf"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, "wb") as f:
        writer.write(f)

    return os.path.abspath(filepath)


@app.post("/cotizar")
async def cotizar(data: QuoteData):
    """
    Recibe los datos de la cotización en JSON y devuelve la ruta del PDF generado.
    - Espera que exista `backend/templates/cotizacion_template.pdf`.
    """
    base_dir = os.path.dirname(__file__)
    template_path = os.path.join(base_dir, "templates", "cotizacion_template.pdf")

    if not os.path.exists(template_path):
        raise HTTPException(status_code=500, detail=f"Plantilla no encontrada en {template_path}. Coloque su PDF de plantilla en esa ruta.")

    try:
        out_path = create_quote_pdf(data, template_path, os.path.join(base_dir, "output"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"pdf_path": out_path}
