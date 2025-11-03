# 🔐 ניהול דף Admin והגנה

## 🔒 הגנה על דף Admin

דף `/admin` מוגן בסיסמה כדי למנוע גישה לא מורשית.

### סיסמה ברירת מחדל:
- **סיסמה:** `aegis2024`

### שינוי הסיסמה ב-Netlify:

1. לך ל-**Netlify Dashboard → Site Settings → Environment Variables**
2. הוסף משתנה חדש:
   - **Key:** `ADMIN_PASSWORD`
   - **Value:** הסיסמה החדשה שלך
3. שמור
4. **חשוב:** בצע Deploy מחדש כדי שהשינוי ייכנס לתוקף

---

## 📊 צפייה בלידים ב-DB ישירות

### דרך 1: Netlify Dashboard → Database

1. לך ל-**Netlify Dashboard**
2. בחר את האתר שלך
3. לך ל-**Database** (בתפריט השמאלי)
4. לחץ על **SQL Editor** או **Query**
5. הרץ את השאילתה:

```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

### דרך 2: Netlify Dashboard → Database → Table View

1. לך ל-**Netlify Dashboard → Database**
2. לחץ על **Tables**
3. בחר את הטבלה `leads`
4. תראה את כל הלידים בטבלה עם אפשרות לעריכה

### דרך 3: דרך דף Admin באתר

1. לך ל-`https://your-site.netlify.app/admin`
2. הזן את הסיסמה
3. תראה את כל הלידים עם פרטים מלאים

---

## 🔧 איך לראות את הלידים ב-DB - צעד אחר צעד

### לפני הכל - ודא שהטבלה קיימת:

1. לך ל-**Netlify Dashboard → Database → SQL Editor**
2. הרץ את הקוד הזה (אם עדיין לא רץ):

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

3. לחץ **Run** או **Execute**

### שאילתות שימושיות:

**כל הלידים:**
```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

**לידים חדשים בלבד:**
```sql
SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC;
```

**לידים מהיום:**
```sql
SELECT * FROM leads WHERE DATE(created_at) = CURRENT_DATE ORDER BY created_at DESC;
```

**ספירת לידים:**
```sql
SELECT COUNT(*) as total_leads FROM leads;
```

**עדכון סטטוס ליד:**
```sql
UPDATE leads SET status = 'contacted' WHERE id = 1;
```

---

## 🛡️ אבטחה - חשוב לדעת

1. **סיסמה לא מוצפנת:** הסיסמה נשלחת ב-Header אך לא מוצפנת. זה בסיסי להגנה בסיסית.
2. **לשימוש פנימי:** זה מספיק להגנה בסיסית מפני גישה אקראית, אבל לא מספיק לאפליקציה רגישה מאוד.
3. **HTTPS:** Netlify מספק HTTPS אוטומטית, כך שהסיסמה נשלחת באופן מאובטח.

### אפשרויות נוספות לאבטחה מתקדמת:

- **Netlify Identity:** שירות Authentication מובנה של Netlify
- **Auth0 / Clerk:** שירותי Authentication חיצוניים
- **Basic Auth:** שימוש ב-Netlify's Basic Auth (פשוט יותר)
- **IP Whitelist:** הגבלת גישה לפי IP (דרך Netlify Functions)

---

## 📝 הערות

- הסיסמה נשמרת ב-`localStorage` בדפדפן (לא מוצפנת)
- אם תסיר את ה-`localStorage` או תשתמש בדפדפן אחר, תצטרך להתחבר מחדש
- הסיסמה נשלחת בכל קריאה ל-`/api/leads` ב-Header

---

## 🚨 בעיות נפוצות

### "Unauthorized - Invalid password"
- ודא שהסיסמה נכונה (ברירת מחדל: `aegis2024`)
- אם שינית ב-Environment Variables, ודא שעשית Deploy מחדש

### "Database table not found"
- לך ל-**Netlify Dashboard → Database → SQL Editor**
- הרץ את הקוד מ-`schema.sql`

### לא רואה לידים ב-DB
- ודא שהטבלה `leads` קיימת
- ודא שהטופס באתר נשלח בהצלחה
- בדוק ב-**SQL Editor** עם `SELECT * FROM leads;`

