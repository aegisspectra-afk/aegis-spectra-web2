# 🔐 הגדרת reCAPTCHA v3

## ✅ מפתחות reCAPTCHA הוגדרו

### Site Key (Public):
```
6LezXQMsAAAAAJa14nF2G8znabIQ0SEudyFiwZ0i
```
**איפה להשתמש:** ב-`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (client-side)

### Secret Key (Private):
```
6LezXQMsAAAAAABUGKjkJLPIDIm5xHTTfWFdzX35
```
**איפה להשתמש:** ב-`RECAPTCHA_SECRET_KEY` (server-side only)

---

## 📝 הוראות הגדרה ב-Netlify

### שלב 1: היכנס ל-Netlify Dashboard
1. עבור ל: https://app.netlify.com
2. בחר את הפרויקט `aegis-spectra`
3. עבור ל: **Site settings** → **Environment variables**

### שלב 2: הוסף Environment Variables

#### Variable 1: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Key:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Value:** `6LezXQMsAAAAAJa14nF2G8znabIQ0SEudyFiwZ0i`
- **Scope:** All scopes (production, deploy previews, branch deploys)

#### Variable 2: `RECAPTCHA_SECRET_KEY`
- **Key:** `RECAPTCHA_SECRET_KEY`
- **Value:** `6LezXQMsAAAAAABUGKjkJLPIDIm5xHTTfWFdzX35`
- **Scope:** All scopes (production, deploy previews, branch deploys)

### שלב 3: Trigger New Deploy
1. לאחר הוספת ה-Variables, לחץ על **Trigger deploy**
2. או לחץ על **Deploys** → **Trigger deploy**
3. בחר **Deploy site**

---

## ✅ אימות שהכל עובד

### 1. בדוק בטופסים:
- **Lead Form** (דף הבית) - צריך לעבוד עם reCAPTCHA
- **Register** (`/register`) - צריך לעבוד עם reCAPTCHA
- **Contact** (`/contact`) - צריך לעבוד עם reCAPTCHA
- **Quote** (`/quote`) - צריך לעבוד עם reCAPTCHA

### 2. בדוק ב-Console:
- אין שגיאות reCAPTCHA
- אין אזהרות "reCAPTCHA not ready"

### 3. בדוק ב-Server Logs:
- אם יש שגיאות, תראה ב-Netlify Functions logs

---

## 🔍 Debugging

### אם reCAPTCHA לא עובד:

1. **בדוק Environment Variables:**
   - ודא שה-Variables נוספו ב-Netlify
   - ודא שה-Scope נכון (All scopes)
   - ודא שה-Deploy רץ אחרי הוספת ה-Variables

2. **בדוק בקוד:**
   ```typescript
   // ב-Console בrowser:
   console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
   // צריך להדפיס: 6LezXQMsAAAAAJa14nF2G8znabIQ0SEudyFiwZ0i
   ```

3. **בדוק Network Tab:**
   - צריך לראות בקשות ל-`https://www.google.com/recaptcha/api.js`
   - צריך לראות בקשות ל-`https://www.google.com/recaptcha/api/siteverify`

---

## 📚 מידע נוסף

- **reCAPTCHA Admin Console:** https://www.google.com/recaptcha/admin
- **reCAPTCHA Documentation:** https://developers.google.com/recaptcha/docs/v3

---

**תאריך עדכון:** ${new Date().toLocaleDateString('he-IL')}

