# 🔍 בדיקת בעיית התחברות מנהל - Aegis Spectra

## 📧 המייל: `aegisspectra@gmail.com`

---

## 🔍 שלב 1: בדיקת המשתמש ב-Database

הרץ את השאילתה הבאה ב-**Netlify Dashboard → Database → SQL Editor**:

```sql
-- בדוק אם המשתמש קיים ומה הפרטים שלו
SELECT 
  id, 
  name, 
  email, 
  role, 
  email_verified,
  CASE 
    WHEN password_hash IS NULL THEN '❌ אין סיסמה'
    WHEN password_hash = '' THEN '❌ סיסמה ריקה'
    ELSE '✅ יש סיסמה'
  END as password_status,
  LENGTH(password_hash) as password_hash_length,
  LEFT(password_hash, 20) as password_hash_preview,
  created_at,
  updated_at,
  last_login
FROM users 
WHERE email = 'aegisspectra@gmail.com';
```

---

## 🔍 שלב 2: בדיקת Hash של הסיסמה

אם ה-`password_hash` לא נראה תקין (לא מתחיל ב-`$2b$10$`), צריך ליצור hash חדש.

### איך ליצור Hash נכון:

**אפשרות 1: דרך Online Tool (מהיר)**
1. לך ל-`https://bcrypt-generator.com/`
2. הכנס את הסיסמה שלך
3. בחר **10 rounds** (לא 12!)
4. העתק את ה-Hash

**אפשרות 2: דרך Node.js**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 10).then(hash => console.log(hash));"
```

**⚠️ חשוב:** השתמש ב-**10 rounds** ולא 12, כי המערכת משתמשת ב-`bcryptjs` עם 10 rounds כברירת מחדל.

---

## 🔧 שלב 3: איפוס סיסמה (אם צריך)

אם ה-`password_hash` לא תקין, עדכן אותו:

```sql
-- החלף את YOUR_HASH_HERE ב-Hash שיצרת
UPDATE users 
SET password_hash = 'YOUR_HASH_HERE',
    updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com'
RETURNING id, name, email, role;
```

**דוגמה:**
```sql
UPDATE users 
SET password_hash = '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTU',
    updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com'
RETURNING id, name, email, role;
```

---

## ✅ שלב 4: בדיקת Role

ודא שה-role הוא `super_admin`:

```sql
-- בדוק את ה-role
SELECT email, role FROM users WHERE email = 'aegisspectra@gmail.com';

-- אם ה-role לא נכון, עדכן אותו:
UPDATE users 
SET role = 'super_admin'
WHERE email = 'aegisspectra@gmail.com';
```

---

## 🔍 שלב 5: בדיקת email_verified

ודא שה-`email_verified` הוא `true`:

```sql
-- בדוק את email_verified
SELECT email, email_verified FROM users WHERE email = 'aegisspectra@gmail.com';

-- אם email_verified הוא false, עדכן אותו:
UPDATE users 
SET email_verified = true
WHERE email = 'aegisspectra@gmail.com';
```

---

## 🛠️ שלב 6: בדיקה מלאה - כל הבעיות האפשריות

הרץ את השאילתה הזו כדי לבדוק את כל הבעיות:

```sql
-- בדיקה מלאה
SELECT 
  id,
  name,
  email,
  role,
  email_verified,
  CASE 
    WHEN password_hash IS NULL THEN '❌ אין סיסמה - צריך ליצור'
    WHEN password_hash = '' THEN '❌ סיסמה ריקה - צריך ליצור'
    WHEN password_hash NOT LIKE '$2b$10$%' THEN '❌ Hash לא תקין - צריך ליצור מחדש'
    ELSE '✅ Hash תקין'
  END as password_status,
  CASE 
    WHEN role NOT IN ('super_admin', 'admin', 'manager') THEN '❌ Role לא נכון - צריך לעדכן'
    ELSE '✅ Role תקין'
  END as role_status,
  CASE 
    WHEN email_verified = false THEN '⚠️ Email לא מאומת - לא חובה אבל מומלץ'
    ELSE '✅ Email מאומת'
  END as email_status
FROM users 
WHERE email = 'aegisspectra@gmail.com';
```

---

## 🔧 פתרון מהיר - הכל בבת אחת

אם אתה רוצה לאפס הכל בבת אחת (החלף את הפרטים):

```sql
-- 1. בדוק אם המשתמש קיים
SELECT id, name, email, role FROM users WHERE email = 'aegisspectra@gmail.com';

-- 2. אם המשתמש לא קיים, צור אותו:
-- (החלף את הפרטים)
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
  'aegisspectra@gmail.com',
  '0501234567',  -- החלף בטלפון שלך
  '$2b$10$YOUR_HASH_HERE',  -- החלף ב-Hash של הסיסמה שלך
  encode(gen_random_bytes(32), 'hex'),
  true,
  'super_admin',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  email_verified = true,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW()
RETURNING id, name, email, role;
```

---

## ❓ בעיות נפוצות

### 1. "אימייל או סיסמה שגויים"
**סיבות אפשריות:**
- המשתמש לא קיים ב-Database
- הסיסמה שגויה
- ה-`password_hash` לא תקין
- האימייל לא תואם בדיוק (case-sensitive)

**פתרון:**
```sql
-- בדוק אם המשתמש קיים
SELECT * FROM users WHERE LOWER(email) = LOWER('aegisspectra@gmail.com');
```

### 2. "אין הרשאות גישה לדשבורד מנהל"
**סיבות אפשריות:**
- ה-`role` הוא `customer` ולא `super_admin`/`admin`/`manager`

**פתרון:**
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'aegisspectra@gmail.com';
```

### 3. Hash לא תקין
**סיבות אפשריות:**
- השתמשת ב-12 rounds במקום 10
- השתמשת ב-`bcrypt` במקום `bcryptjs`
- ה-Hash לא נוצר נכון

**פתרון:**
צור Hash חדש עם 10 rounds דרך `https://bcrypt-generator.com/` (בחר 10 rounds)

---

## 🎯 בדיקה מהירה - SQL Query אחד

הרץ את זה כדי לראות את כל המידע:

```sql
SELECT 
  '✅ המשתמש קיים' as status,
  id,
  name,
  email,
  role,
  CASE 
    WHEN password_hash IS NULL THEN '❌ אין סיסמה'
    WHEN password_hash NOT LIKE '$2b$10$%' THEN '❌ Hash לא תקין'
    ELSE '✅ יש סיסמה תקינה'
  END as password_status,
  CASE 
    WHEN role IN ('super_admin', 'admin', 'manager') THEN '✅ Role תקין'
    ELSE '❌ Role לא תקין - צריך לעדכן'
  END as role_status
FROM users 
WHERE LOWER(email) = LOWER('aegisspectra@gmail.com');
```

---

## 📝 סיכום - מה לעשות

1. **בדוק את המשתמש** - הרץ את השאילתה בשלב 1
2. **אם אין סיסמה או Hash לא תקין** - צור Hash חדש (10 rounds) ועדכן
3. **אם ה-role לא נכון** - עדכן ל-`super_admin`
4. **נסה להתחבר שוב** - `https://aegis-spectra.netlify.app/admin/login`

---

## 🆘 אם עדיין לא עובד

1. **בדוק את ה-Logs:**
   - Netlify Dashboard → Functions → Logs
   - חפש `admin/login` או `Authentication error`

2. **בדוק את ה-Browser Console:**
   - F12 → Console
   - חפש שגיאות

3. **בדוק את ה-Network Tab:**
   - F12 → Network
   - לחץ על `/api/auth/admin/login`
   - בדוק את ה-Response

---

**תודה! 🚀**

