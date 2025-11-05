# 🔐 איפוס סיסמה למנהל - Aegis Spectra

## 📧 המייל שלך: `aegisspectra@gmail.com`

---

## 🚨 אם אתה לא זוכר את הסיסמה

אפשר לאפס את הסיסמה דרך SQL Editor. יש לך 2 אפשרויות:

---

## ✅ דרך 1: איפוס סיסמה דרך SQL (מומלץ)

### שלב 1: צור Hash לסיסמה החדשה

אתה צריך ליצור **bcrypt hash** לסיסמה החדשה שלך.

#### אפשרות A: דרך Node.js (אם יש לך Node.js מותקן)

פתח טרמינל והרץ:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_NEW_PASSWORD', 10).then(hash => console.log(hash));"
```

**החלף `YOUR_NEW_PASSWORD` בסיסמה החדשה שלך!**

#### אפשרות B: דרך Online Tool (פחות מומלץ לאבטחה)

1. לך ל-`https://bcrypt-generator.com/`
2. הכנס את הסיסמה החדשה שלך
3. בחר **10 rounds**
4. לחץ **"Generate Hash"**
5. העתק את ה-Hash שנוצר

**⚠️ אזהרה:** השתמש רק בכלים מהימנים! לא מומלץ להשתמש בכלים ציבוריים לסיסמאות רגישות.

#### אפשרות C: דרך Python (אם יש לך Python מותקן)

```python
import bcrypt

password = b'YOUR_NEW_PASSWORD'  # החלף בסיסמה החדשה
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=10))
print(hashed.decode('utf-8'))
```

---

### שלב 2: עדכן את הסיסמה ב-Database

1. לך ל-**Netlify Dashboard → Database → SQL Editor**
2. הרץ את השאילתה הבאה:

```sql
-- החלף את YOUR_HASH_HERE ב-Hash שיצרת בשלב 1
UPDATE users 
SET password_hash = 'YOUR_HASH_HERE',
    updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com';
```

**דוגמה:**
```sql
UPDATE users 
SET password_hash = '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTU',
    updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com';
```

---

## ✅ דרך 2: איפוס דרך הרשמה מחדש (אם אפשר)

אם אתה יכול להירשם מחדש עם אותו אימייל:

1. לך ל-`https://aegis-spectra.netlify.app/register`
2. הירשם עם:
   - **אימייל:** `aegisspectra@gmail.com`
   - **סיסמה:** הסיסמה החדשה שלך
   - **שם:** השם שלך
   - **טלפון:** הטלפון שלך
3. **⚠️ חשוב:** זה ימחק את המשתמש הקיים ויצור אחד חדש!
4. **אחר כך:** עדכן את ה-role ל-`super_admin` (ראה למטה)

---

## 🔄 עדכון Role ל-super_admin (אם יצרת משתמש חדש)

אם יצרת משתמש חדש דרך הרשמה, צריך לעדכן את ה-role:

```sql
UPDATE users 
SET role = 'super_admin'
WHERE email = 'aegisspectra@gmail.com';
```

---

## ✅ התחברות

לאחר איפוס הסיסמה:

1. לך ל-`https://aegis-spectra.netlify.app/admin/login`
2. הכנס:
   - **אימייל:** `aegisspectra@gmail.com`
   - **סיסמה:** הסיסמה החדשה שיצרת
3. לחץ **"התחבר"**

---

## 🛠️ כלי עזר: יצירת Hash דרך Node.js (מקומי)

אם יש לך Node.js מותקן, תוכל ליצור script פשוט:

### צור קובץ `generate-hash.js`:

```javascript
const bcrypt = require('bcrypt');

const password = process.argv[2] || 'your-password-here';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Hash שנוצר:');
  console.log(hash);
  console.log('\n📋 העתק את ה-Hash הזה והשתמש בו ב-SQL Editor\n');
}).catch(err => {
  console.error('❌ שגיאה:', err);
});
```

### הרץ:

```bash
npm install bcrypt
node generate-hash.js "YOUR_NEW_PASSWORD"
```

---

## 💡 טיפים

1. **בחר סיסמה חזקה:**
   - לפחות 12 תווים
   - אותיות גדולות וקטנות
   - מספרים
   - סמלים (`!@#$%^&*`)

2. **שמור את הסיסמה במקום בטוח:**
   - מנהל סיסמאות (Password Manager)
   - לא בשיתוף עם אחרים

3. **אם יש בעיות:**
   - בדוק שה-Hash נכון (תחיל עם `$2b$10$`)
   - ודא שה-email נכון (`aegisspectra@gmail.com`)
   - ודא שה-role הוא `super_admin`

---

## ❓ בעיות נפוצות

### "שגיאה בהתחברות" אחרי איפוס
- ודא שה-Hash נכון (עם `$2b$10$` בהתחלה)
- ודא שה-email נכון
- נסה ליצור Hash מחדש

### "אין הרשאות גישה"
- ודא שה-role הוא `super_admin`:
  ```sql
  SELECT email, role FROM users WHERE email = 'aegisspectra@gmail.com';
  ```

---

## 🎉 סיום

לאחר איפוס הסיסמה והתחברות, תוכל לגשת ל-`/admin` - דשבורד המנהל.

**תודה! 🚀**

