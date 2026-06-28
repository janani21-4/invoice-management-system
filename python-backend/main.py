from fastapi import FastAPI, UploadFile, File
import pdfplumber
import shutil
import os
import re

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -----------------------------
# CLEAN FIELD EXTRACTION
# -----------------------------
def extract_fields(text: str):

    def search(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    invoice_number = search(r"Invoice Number\s*([A-Z0-9\-]+)")
    invoice_date = search(r"Invoice Date\s*(.*)")
    due_date = search(r"Due Date\s*(.*)")

    # FIXED: better total detection
    total_amount = (
        search(r"Total Due\s*\$?([\d.]+)") or
        search(r"Total\s*\$?([\d.]+)")
    )

    # FIXED: better vendor extraction
    vendor_name = search(r"From:\s*(.*)")

    return {
        "invoiceNumber": invoice_number,
        "invoiceDate": invoice_date,
        "dueDate": due_date,
        "totalAmount": total_amount,
        "vendorName": vendor_name
    }


# -----------------------------
# MAIN API
# -----------------------------
@app.post("/extract-pdf/")
async def extract_pdf(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""

    # extract PDF text
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    fields = extract_fields(text)

    return {
        "success": True,
        "filename": file.filename,
        "text": text.strip(),
        "fields": fields
    }