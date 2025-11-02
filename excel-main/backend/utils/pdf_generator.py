from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import base64
import io
from datetime import datetime

def generate_chart_pdf(image_data_url: str, title: str = "Chart") -> bytes:
    """
    Generate PDF from base64 image data URL.
    """
    try:
        # Remove data URL prefix
        if ',' in image_data_url:
            image_data = image_data_url.split(',')[1]
        else:
            image_data = image_data_url
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image_io = io.BytesIO(image_bytes)
        
        # Create PDF in memory
        pdf_buffer = io.BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        width, height = letter
        
        # Add title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, title)
        
        # Add timestamp
        c.setFont("Helvetica", 10)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        c.drawString(50, height - 70, f"Generated: {timestamp}")
        
        # Add image
        try:
            img = ImageReader(image_io)
            # Scale image to fit page
            img_width = width - 100
            img_height = height - 200
            c.drawImage(img, 50, 50, width=img_width, height=img_height, preserveAspectRatio=True)
        except Exception as e:
            c.drawString(50, height - 100, f"Error rendering image: {str(e)}")
        
        c.save()
        pdf_buffer.seek(0)
        return pdf_buffer.getvalue()
    
    except Exception as e:
        raise Exception(f"Failed to generate PDF: {str(e)}")
