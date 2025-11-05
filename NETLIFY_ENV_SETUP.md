# 🔧 הוראות הגדרת Environment Variables ב-Netlify

## 📝 חשוב: הוסף את המפתחות ב-Netlify!

המפתחות ב-`ENV_EXAMPLE` הם רק דוגמה. **אתה חייב להוסיף אותם ב-Netlify Environment Variables** כדי שהאתר יעבוד.

---

## 🚀 שלב 1: היכנס ל-Netlify Dashboard

1. עבור ל: https://app.netlify.com
2. בחר את הפרויקט `aegis-spectra`
3. עבור ל: **Site settings** → **Environment variables**

---

## 🔐 שלב 2: הוסף Environment Variables

### Variable 1: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

**הגדרות:**
- **Key:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Value:** `6LezXQMsAAAAAJa14nF2G8znabIQ0SEudyFiwZ0i`
- **Scope:** All scopes (production, deploy previews, branch deploys)

**לחץ על:** "Add variable" → הוסף את הערכים → "Save"

---

### Variable 2: `RECAPTCHA_SECRET_KEY`

**הגדרות:**
- **Key:** `RECAPTCHA_SECRET_KEY`
- **Value:** `6LezXQMsAAAAAABUGKjkJLPIDIm5xHTTfWFdzX35`
- **Scope:** All scopes (production, deploy previews, branch deploys)

**לחץ על:** "Add variable" → הוסף את הערכים → "Save"

---

## 🔄 שלב 3: Trigger New Deploy

**חשוב:** לאחר הוספת ה-Variables, אתה **חייב** להפעיל Deploy חדש!

1. לחץ על **Deploys** (בתפריט העליון)
2. לחץ על **Trigger deploy**
3. בחר **Deploy site**
4. חכה שה-Deploy יסתיים

---

## ✅ אימות שהכל עובד

### 1. בדוק את הטופסים:
- דף הבית - Lead Form
- `/register` - טופס הרשמה
- `/contact` - טופס צור קשר
- `/quote` - טופס הצעת מחיר

### 2. בדוק ב-Console (F12):
- אין שגיאות reCAPTCHA
- אין אזהרות "reCAPTCHA not ready"

### 3. בדוק ב-Netlify Functions Logs:
- אם יש שגיאות, תראה ב-Logs

---

## 🔍 Debugging

### אם reCAPTCHA לא עובד:

1. **בדוק Environment Variables:**
   - ודא שה-Variables נוספו ב-Netlify
   - ודא שה-Scope נכון (All scopes)
   - ודא שה-Deploy רץ אחרי הוספת ה-Variables

2. **בדוק בקוד:**
   - פתח Console ב-Browser (F12)
   - הקלד: `console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)`
   - צריך להדפיס: `6LezXQMsAAAAAJa14nF2G8znabIQ0SEudyFiwZ0i`

3. **בדוק Network Tab:**
   - צריך לראות בקשות ל-`https://www.google.com/recaptcha/api.js`
   - צריך לראות בקשות ל-`https://www.google.com/recaptcha/api/siteverify`

---

## 📚 מידע נוסף

- **reCAPTCHA Admin Console:** https://www.google.com/recaptcha/admin
- **reCAPTCHA Documentation:** https://developers.google.com/recaptcha/docs/v3

---

**⚠️ חשוב:** בלי ה-Environment Variables ב-Netlify, reCAPTCHA לא יעבוד!

---

**תאריך עדכון:** ${new Date().toLocaleDateString('he-IL')}

