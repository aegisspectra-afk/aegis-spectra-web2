# 🔧 פתרון מהיר - איפוס סיסמה

## הבעיה

המשתמש מקבל 401 Unauthorized. יכול להיות:
1. ה-Hash לא תואם לסיסמה
2. המשתמש לא קיים ב-DB
3. בעיה ב-bcryptjs עם $2a$ format

## פתרון: צור Hash חדש עם bcryptjs

### שלב 1: צור Hash חדש

**אם יש לך Node.js:**

```bash
cd frontend
node GENERATE_HASH.js "s197678a"
```

או:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('s197678a', 12).then(h => console.log(h));"
```

**אם אין לך Node.js:**

1. לך ל-`https://bcrypt-generator.com/`
2. הכנס: `s197678a`
3. בחר: **12 rounds**
4. העתק את ה-Hash (אמור להיות `$2b$12$` או `$2a$12$`)

### שלב 2: עדכן את הסיסמה ב-DB

```sql
-- החלף את YOUR_HASH_HERE ב-Hash שיצרת
UPDATE users 
SET 
  password_hash = 'YOUR_HASH_HERE',
  role = 'super_admin',
  email_verified = true,
  updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com'
RETURNING id, name, email, role;
```

### שלב 3: בדוק שהעדכון הצליח

```sql
SELECT 
  id,
  name,
  email,
  role,
  LEFT(password_hash, 30) as hash_preview,
  CASE 
    WHEN password_hash IS NOT NULL THEN '✅ יש סיסמה'
    ELSE '❌ אין סיסמה'
  END as status
FROM users 
WHERE email = 'aegisspectra@gmail.com';
```

### שלב 4: התחבר

1. לך ל-`https://aegis-spectra.netlify.app/admin/login`
2. הכנס:
   - **אימייל:** `aegisspectra@gmail.com`
   - **סיסמה:** `s197678a`
3. לחץ **"התחבר"**

---

## פתרון חלופי: יצירת משתמש חדש

אם עדיין לא עובד, צור משתמש חדש:

```sql
-- מחק את המשתמש הישן (אם קיים)
DELETE FROM users WHERE email = 'aegisspectra@gmail.com';

-- צור משתמש חדש עם Hash חדש
-- (החלף את YOUR_HASH_HERE ב-Hash שיצרת)
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
  'YOUR_HASH_HERE',  -- Hash שיצרת
  encode(gen_random_bytes(32), 'hex'),
  true,
  'super_admin',
  NOW()
)
RETURNING id, name, email, role;
```

---

## בדיקה: האם bcryptjs עובד עם $2a$?

`bcryptjs` תומך ב-`$2a$` ו-`$2b$`, אבל מומלץ להשתמש ב-`$2b$` format.

אם ה-Hash שלך הוא `$2a$12$`, נסה ליצור Hash חדש עם `$2b$12$` format.

---

## אם עדיין לא עובד

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

4. **בדוק את ה-DB:**
   - הרץ את השאילתה בשלב 3
   - ודא שהמשתמש קיים וה-password_hash עודכן

---

## טיפים

1. **השתמש ב-bcryptjs** ליצירת Hash (לא bcrypt)
2. **השתמש ב-12 rounds** (כמו שהמערכת משתמשת)
3. **ודא שהאימייל נכון** - `aegisspectra@gmail.com` (לא `aegis-spectra@gmail.com`)

---

**תודה! 🚀**

