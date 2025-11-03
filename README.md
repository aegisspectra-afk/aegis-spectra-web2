# Aegis Spectra - מערכת אבטחה חכמה

פרויקט מלא ב-Next.js (React + TypeScript) ו-FastAPI (Python) עם דיפלוי דרך GitHub.

## 📁 מבנה הפרויקט (Monorepo)

```
aegis-spectra/
├─ frontend/        # Next.js 14 + TS + Tailwind (RTL)
├─ backend/         # FastAPI + Uvicorn
├─ README.md
```

---

## 🚀 התקנה והרצה מקומית

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

ה-API יעבוד בכתובת: `http://localhost:8000`

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
# ערוך את .env.local והגדר את NEXT_PUBLIC_API_URL
npm run dev
```

הפרונט יעבוד בכתובת: `http://localhost:3000`

---

## 🌐 דיפלוי

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/aegisspectra-afk/aegis-spectra-web2.git
git push -u origin main
```

### 2. Backend - Render/Railway/Fly.io

**Render:**
1. היכנס ל-Render → New Web Service
2. חבר את הריפו מ-GitHub
3. הגדר Path: `backend/`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. קבל URL לדוגמה: `https://aegis-api.onrender.com`
6. **חשוב:** עדכן את `backend/main.py` - הוסף את כתובת ה-Render לרשימת ה-CORS:

```python
origins = [
    "http://localhost:3000",
    "https://your-site.netlify.app",
    "https://aegisspectra.com"
]
```

### 3. Frontend - Netlify

1. היכנס ל-Netlify → New Site from Git
2. בחר את הריפו
3. הגדר:
   - **Base directory:** `frontend/`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (Netlify מזהה אוטומטית עם ה-Next Plugin)
4. הוסף Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://aegis-api.onrender.com` (הכתובת מה-backend)

---

## 📝 קבצי תצורה

### Backend

- `main.py` - FastAPI app עם endpoints
- `requirements.txt` - תלויות Python

### Frontend

- `tailwind.config.ts` - תצורת Tailwind עם צבעים מותאמים
- `netlify.toml` - תצורת דיפלוי Netlify
- `.env.local` - משתני סביבה (לא נדחף ל-Git)

---

## 🎨 תכונות

- ✅ RTL (עברית)
- ✅ Dark Noir theme
- ✅ מוצר H-01 עם מחירים
- ✅ טופס לידים (Lead Form)
- ✅ CORS מוגדר
- ✅ דפי מוצרים דינמיים
- ✅ גופן Heebo בעברית

---

## 📞 API Endpoints

- `GET /api/health` - בדיקת בריאות
- `GET /api/products` - רשימת מוצרים
- `GET /api/products/{sku}` - פרטי מוצר לפי SKU
- `POST /api/lead` - שליחת ליד חדש

---

## 🔧 פיתוח

### הוספת מוצר חדש

ערוך את `backend/main.py` והוסף לרשימת `PRODUCTS`:

```python
Product(
    sku="H-02-4TB",
    name="Home Cam H-02 (4 TB)",
    price_regular=3290,
    price_sale=2990,
    short_desc="מערכת אבטחה מורחבת..."
)
```

### שינוי עיצוב

ערוך את `frontend/src/app/globals.css` ו-`tailwind.config.ts`

---

## 📄 רישיון

© 2024 Aegis Spectra — יבנה, ישראל

