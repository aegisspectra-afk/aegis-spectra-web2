# Netlify DB Setup - Aegis Spectra

## מה זה Netlify DB?

Netlify DB הוא שירות PostgreSQL serverless דרך Neon - DB מובנה ב-Netlify ללא צורך בשרת נפרד.

## הגדרה ראשונית

### 1. יצירת טבלאות ב-DB

לך ל-**Netlify Dashboard → Database → SQL Editor**

העתק והרץ את הקוד מ-`schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100),
  message TEXT,
  product_sku VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
```

### 2. Environment Variables

Netlify מגדיר אוטומטית:
- `NETLIFY_DATABASE_URL` - כתובת ה-DB

**אין צורך להגדיר ידנית!**

### 3. איך זה עובד?

1. **הטופס שולח ל-** `/api/lead` (Next.js API Route)
2. **API Route שומר ב-DB** באמצעות `@netlify/neon`
3. **הלידים נשמרים** בטבלה `leads`

## שאילתות לדוגמה

### קבלת כל הלידים:

```typescript
import { neon } from '@netlify/neon';
const sql = neon();

const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
```

### קבלת לידים חדשים:

```typescript
const newLeads = await sql`
  SELECT * FROM leads 
  WHERE status = 'new' 
  ORDER BY created_at DESC
`;
```

### עדכון סטטוס ליד:

```typescript
await sql`
  UPDATE leads 
  SET status = 'contacted', notes = ${notes}
  WHERE id = ${leadId}
`;
```

## היתרונות:

- ✅ **Serverless** - אין צורך בשרת נפרד
- ✅ **PostgreSQL** - DB מלא וחזק
- ✅ **חינם** - עד 256MB storage
- ✅ **אוטומטי** - Netlify מטפל בהכל

## מה הלאה?

1. הרץ את ה-SQL ב-DB
2. בדוק שהטופס עובד
3. בדוק ב-Netlify Dashboard → Database → Query שהלידים נשמרים

