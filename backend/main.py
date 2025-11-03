# backend/main.py
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Aegis Spectra API", version="1.0.0")

# הרשאי CORS – לעדכן אחרי דיפלוי
origins = [
    "http://localhost:3000",
    "https://<your-netlify-site>.netlify.app",
    "https://aegisspectra.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

class Product(BaseModel):
    sku: str
    name: str
    price_regular: int
    price_sale: int | None = None
    currency: str = "ILS"
    short_desc: str

# מוצר ראשון – H-01
PRODUCTS = [
    Product(
        sku="H-01-2TB",
        name="Home Cam H-01 (2 TB)",
        price_regular=2590,
        price_sale=2290,
        short_desc="מערכת אבטחה חכמה: 2×4MP PoE + NVR 2TB + אפליקציה בעברית."
    )
]

@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/products")
def list_products():
    return [p.model_dump() for p in PRODUCTS]

@app.get("/api/products/{sku}")
def get_product(sku: str):
    for p in PRODUCTS:
        if p.sku == sku:
            return p.model_dump()
    return {"detail": "Not found"}

@app.post("/api/lead")
def lead(name: str = Form(...),
         phone: str = Form(...),
         city: str = Form(""),
         message: str = Form(""),
         product_sku: str = Form("")):
    # כאן אפשר לשמור DB / לשלוח מייל / webhook ל-CRM
    print("New lead:", name, phone, city, product_sku, message)
    return {"ok": True, "msg": "Lead received"}

