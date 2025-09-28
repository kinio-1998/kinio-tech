import logging
from logging.handlers import RotatingFileHandler
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import os, io, re, smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter

load_dotenv()

# -------------------- APP --------------------
app = FastAPI(title="Cotizaciones API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# -------------------- MODELOS --------------------
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

# -------------------- FUNCIONES --------------------
def sanitize_name(name: str) -> str:
    s = re.sub(r"[^A-Za-z0-9 ]+", "", name).strip()
    return re.sub(r"\s+", "_", s)

def setup_logger(pdf_name: str):
    os.makedirs("logs", exist_ok=True)
    date = datetime.now().strftime("%Y%m%d")
    log_filename = os.path.join("logs", f"{date}_LogCotizar.log")

    logger = logging.getLogger(pdf_name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        handler = RotatingFileHandler(log_filename, maxBytes=5*1024*1024, backupCount=3)
        formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger

def create_quote_pdf(data: QuoteData, template_path: str, output_dir: str, logger) -> str:
    os.makedirs(output_dir, exist_ok=True)
    reader = PdfReader(template_path)
    if not reader.pages:
        raise RuntimeError("La plantilla PDF no tiene páginas")

    template_page = reader.pages[0]
    width = float(template_page.mediabox.width)
    height = float(template_page.mediabox.height)

    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    font_name = "Helvetica"
    c.setFont(font_name, 10)
    c.setFillColorRGB(0, 0, 0)

    # Datos cliente
    c.drawString(135, height - 175, data.client_name)
    c.drawString(135, height - 187, data.client_email or "")
    c.drawString(135, height - 200, data.client_phone or "")

    # Datos empresa
    c.drawString(375, height - 177, "Carlos Daniel Duarte León")
    c.drawString(375, height - 188, "San Pedro 3638, San Benito")
    c.drawString(375, height - 200, "DULC980506MV0")

    # Fecha
    today = datetime.now().strftime("%d/%m/%Y")
    c.drawString(135, height - 270, today)

    # Tabla items
    start_y = height - 320
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

            c.drawString(85, y, desc)
            c.drawRightString(330, y, str(qty))
            c.drawRightString(430, y, f"${price:,.2f}")
            c.drawRightString(520, y, f"${line_total:,.2f}")

            c.setStrokeColorRGB(0.7, 0.7, 0.7)
            c.setLineWidth(0.5)
            c.line(80, y - 3, 525, y - 3)

    # Mano de obra
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
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(80, y - 3, 525, y - 3)

    # Total
    y -= 1 * row_height
    c.setFont(font_name, 11)
    c.drawRightString(520, y, f"TOTAL: ${total_sum:,.2f}")

    # Notas
    c.setFont(font_name, 10)
    c.drawString(85, height - 550, f"Notas: Esta cotización es válida por 7 días.")
    c.drawString(117, height - 560, f"Los equipos reparados deberán recogerse en un plazo máximo de 30 días. En caso contrario,")
    c.drawString(117, height - 570, f"se pondrán a la venta")

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

    logger.info(f"PDF generado correctamente: {filepath}")
    return os.path.abspath(filepath)

def send_email(pdf_path: str, recipient_email: str, logger):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))

    if not EMAIL_USER or not EMAIL_PASS:
        logger.error("No se han configurado las credenciales de correo (EMAIL_USER/EMAIL_PASS)")
        raise RuntimeError("Faltan credenciales de correo electrónico.")

    logger.info(f"Intentando enviar correo a {recipient_email} usando {EMAIL_USER}@{EMAIL_HOST}:{EMAIL_PORT}")
    msg = MIMEMultipart()
    msg["From"] = EMAIL_USER
    msg["To"] = recipient_email
    msg["Subject"] = "Cotización Kinio Tech"
    msg.attach(MIMEText("Hola, adjunto la cotización solicitada, favor de confirmar de recibido", "plain"))

    try:
        with open(pdf_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(pdf_path)}")
            msg.attach(part)

        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        logger.info("Correo enviado correctamente.")
        return True
    except Exception as e:
        logger.exception("Error enviando el correo")
        return False

# -------------------- ENDPOINT --------------------
@app.post("/cotizar")
async def cotizar(data: QuoteData):
    base_dir = os.path.dirname(__file__)
    template_path = os.path.join(base_dir, "templates", "cotizacion_template.pdf")

    if not os.path.exists(template_path):
        logger.error(f"Plantilla no encontrada: {template_path}")
        raise HTTPException(status_code=500, detail=f"Plantilla no encontrada en {template_path}")

    out_path = create_quote_pdf(data, template_path, os.path.join(base_dir, "output"))

    
    if data.client_email:
        enviado = send_email(out_path, data.client_email)
        mensaje = "Correo enviado correctamente." if enviado else "No se pudo enviar el correo."
    else:
        logger.warning("No se proporcionó correo del cliente, no se envió email.")
        mensaje = "PDF generado, pero no se proporcionó correo del cliente."

    return {
        "pdf_path": out_path,
        "mensaje": mensaje
    }