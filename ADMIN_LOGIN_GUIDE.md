# 🔐 מדריך התחברות למנהל - Aegis Spectra

## 📍 דף התחברות

**URL:** `https://aegis-spectra.netlify.app/admin/login`

---

## 🚀 יצירת מנהל ראשון

אם עדיין אין לך מנהל במערכת, צריך ליצור אחד דרך ה-SQL Editor:

### דרך 1: יצירת מנהל דרך SQL Editor

1. לך ל-**Netlify Dashboard → Database → SQL Editor**
2. הרץ את השאילתה הבאה (החלף את הפרטים):

```sql
-- הוסף משתמש מנהל חדש
INSERT INTO users (
  name, 
  email, 
  phone, 
  password_hash, 
  api_key_hash, 
  email_verified, 
  role, 
  created_at
)
VALUES (
  'שם המנהל',  -- החלף בשם שלך
  'your-email@example.com',  -- החלף באימייל שלך
  '0501234567',  -- החלף בטלפון שלך
  '$2b$10$...',  -- ראה למטה איך ליצור hash לסיסמה
  'api_key_hash_here',  -- ראה למטה
  true,
  'super_admin',  -- או 'admin' או 'manager'
  NOW()
)
RETURNING id, name, email, role;
```

### דרך 2: יצירת מנהל דרך הרשמה רגילה + עדכון תפקיד

1. הרשם באתר כלקוח רגיל דרך `/register`
2. לך ל-**Netlify Dashboard → Database → SQL Editor**
3. עדכן את התפקיד של המשתמש:

```sql
-- מצא את המשתמש לפי אימייל
UPDATE users 
SET role = 'super_admin'  -- או 'admin' או 'manager'
WHERE email = 'your-email@example.com';
```

---

## 🔑 יצירת Hash לסיסמה

### דרך 1: שימוש ב-Node.js (מקומי)

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 10).then(hash => console.log(hash));"
```

או אם יש לך `bcrypt` מותקן:

```javascript
const bcrypt = require('bcrypt');
const password = 'your-password-here';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

### דרך 2: שימוש ב-Online Tool

**⚠️ אזהרה:** השתמש רק בכלים מהימנים! לא מומלץ להשתמש בכלים ציבוריים לסיסמאות רגישות.

1. לך ל-`https://bcrypt-generator.com/` או כלי דומה
2. הכנס את הסיסמה שלך
3. בחר 10 rounds
4. העתק את ה-Hash

### דרך 3: דרך האתר (הרשמה)

אם אתה רושם משתמש דרך `/register`, המערכת יוצרת את ה-Hash אוטומטית.

---

## 🎯 יצירת API Key Hash

```sql
-- צור API key hash (אפשר להשתמש ב-UUID או כל מחרוזת ייחודית)
-- לדוגמה:
INSERT INTO users (..., api_key_hash, ...)
VALUES (..., encode(gen_random_bytes(32), 'hex'), ...);
```

או פשוט:

```sql
-- צור API key hash פשוט
UPDATE users 
SET api_key_hash = encode(gen_random_bytes(32), 'hex')
WHERE email = 'your-email@example.com';
```

---

## ✅ התחברות

לאחר יצירת המשתמש:

1. לך ל-`https://aegis-spectra.netlify.app/admin/login`
2. הכנס:
   - **אימייל:** האימייל שרשמת ב-`users` table
   - **סיסמה:** הסיסמה המקורית (לפני ה-Hash)
3. לחץ **"התחבר"**

---

## 🔐 תפקידים (Roles)

המערכת תומכת ב-5 תפקידים:

1. **`super_admin`** - מנהל עליון (גישה מלאה לכל)
2. **`admin`** - מנהל (גישה מלאה)
3. **`manager`** - מנהל חלקי (גישה מוגבלת)
4. **`support`** - תמיכה (גישה לתמיכה בלבד)
5. **`customer`** - לקוח (גישה רגילה)

### איזה תפקיד לבחור?

- **`super_admin`** - למנהל הראשי
- **`admin`** - למנהלים אחרים
- **`manager`** - למנהלים עם הרשאות מוגבלות

---

## 📝 דוגמה מלאה - יצירת מנהל

```sql
-- 1. צור משתמש חדש (החלף את הפרטים)
INSERT INTO users (
  name, 
  email, 
  phone, 
  password_hash, 
  api_key_hash, 
  email_verified, 
  role, 
  created_at
)
VALUES (
  'מנהל ראשי',
  'admin@aegis-spectra.com',
  '0501234567',
  '$2b$10$YourBcryptHashHere',  -- החלף ב-Hash של הסיסמה שלך
  encode(gen_random_bytes(32), 'hex'),
  true,
  'super_admin',
  NOW()
)
RETURNING id, name, email, role;
```

---

## ❓ בעיות נפוצות

### "שגיאה בהתחברות"
- ודא שהאימייל קיים ב-`users` table
- ודא שה-`password_hash` נכון
- ודא שה-`role` הוא `super_admin`, `admin`, או `manager`
- ודא ש-`email_verified` הוא `true`

### "אין הרשאות גישה לדשבורד מנהל"
- ודא שה-`role` הוא `super_admin`, `admin`, או `manager`
- אם ה-`role` הוא `customer`, צריך לעדכן אותו

### "שגיאה ב-SQL"
- ודא שכל הטבלאות קיימות (הרץ `complete-schema.sql` אם צריך)
- ודא שה-`email` הוא ייחודי (UNIQUE constraint)

---

## 🔒 אבטחה

1. **אל תשתף** את פרטי ההתחברות שלך
2. **שנה סיסמה** לאחר יצירת המשתמש הראשוני
3. **השתמש בסיסמה חזקה** (לפחות 12 תווים, אותיות, מספרים, סמלים)
4. **הגבל גישה** - רק אנשים מהימנים עם תפקיד `super_admin`

---

## 📞 תמיכה

אם יש בעיות, בדוק:
1. **Netlify Dashboard → Functions → Logs** - לראות שגיאות
2. **Browser Console** - לראות שגיאות JavaScript
3. **Network Tab** - לראות את ה-API requests

---

## 🎉 סיום

לאחר יצירת המשתמש והתחברות, תועבר אוטומטית ל-`/admin` - דשבורד המנהל.

**תודה! 🚀**

