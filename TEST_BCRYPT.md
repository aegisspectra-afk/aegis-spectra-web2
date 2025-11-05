# 🔍 בדיקת bcryptjs - $2a$ vs $2b$

## הבעיה

ה-Hash שלך הוא `$2a$12$` אבל המערכת משתמשת ב-`bcryptjs`.

`bcryptjs` תומך גם ב-`$2a$` וגם ב-`$2b$`, אבל יש בעיות ידועות:

1. **bcryptjs** יכול לעבוד עם `$2a$`, אבל לפעמים יש בעיות
2. **המערכת** משתמשת ב-`bcrypt.genSalt(12)` שיוצר `$2b$12$` כברירת מחדל

## פתרון: צור Hash חדש עם $2b$ format

### דרך 1: דרך Node.js (אם יש לך bcryptjs)

```javascript
const bcrypt = require('bcryptjs');

const password = 's197678a';

bcrypt.hash(password, 12).then(hash => {
  console.log('Hash חדש ($2b$12$):');
  console.log(hash);
});
```

### דרך 2: דרך Online Tool (לא מומלץ)

אם אתה משתמש ב-Online Tool, ודא שהוא יוצר `$2b$` ולא `$2a$`.

### דרך 3: דרך Python (אם יש לך bcrypt)

```python
import bcrypt

password = b's197678a'
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
print(hashed.decode('utf-8'))
```

---

## פתרון מהיר: צור Hash חדש

הרץ את זה ב-Node.js (אם יש לך):

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('s197678a', 12).then(h => console.log(h));"
```

או אם יש לך `bcrypt` (לא bcryptjs):

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('s197678a', 12).then(h => console.log(h));"
```

---

## עדכון הסיסמה עם Hash חדש

אחרי שיצרת Hash חדש (עם `$2b$12$`), עדכן ב-DB:

```sql
UPDATE users 
SET password_hash = 'YOUR_NEW_HASH_HERE',
    updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com';
```

---

## בדיקה: האם bcryptjs תומך ב-$2a$?

`bcryptjs` **תומך** ב-`$2a$`, אבל לפעמים יש בעיות. מומלץ להשתמש ב-`$2b$` format.

---

## פתרון חלופי: שימוש ב-bcrypt במקום bcryptjs

אם הבעיה נמשכת, אפשר לשנות את המערכת להשתמש ב-`bcrypt` (לא `bcryptjs`), אבל זה דורש שינוי בקוד.

---

## מה לעשות עכשיו

1. צור Hash חדש עם `$2b$12$` format (ראה למעלה)
2. עדכן את הסיסמה ב-DB עם Hash החדש
3. נסה להתחבר שוב

