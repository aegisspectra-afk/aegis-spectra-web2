# מדריך הגדרת שליחת אימיילים

## אופציה 1: Resend API (מומלץ ל-Production)

### שלבים:
1. הירשם ל-Resend: https://resend.com
2. צור API Key חדש
3. הוסף ב-Netlify Environment Variables:
   - `RESEND_API_KEY` = ה-API Key שלך מ-Resend

### יתרונות:
- ✅ קל להגדרה
- ✅ אמין ויציב
- ✅ חינמי עד 3,000 אימיילים/חודש
- ✅ עובד טוב ב-Production

---

## אופציה 2: Gmail SMTP (חלופה)

### שלבים:

#### 1. הפעל "App Password" ב-Gmail:
1. לך ל: https://myaccount.google.com/apppasswords
2. בחר "אפליקציה" → "דואר" → "מכשיר אחר"
3. הזן שם: "Aegis Spectra"
4. לחץ "צור"
5. העתק את ה-App Password (16 תווים)

#### 2. הוסף ב-Netlify Environment Variables:
   - `GMAIL_USER` = האימייל שלך (למשל: aegisspectra@gmail.com)
   - `GMAIL_APP_PASSWORD` = ה-App Password שיצרת (16 תווים)

### יתרונות:
- ✅ חינמי
- ✅ עובד עם Gmail קיים
- ✅ אין צורך בשירות חיצוני

### חסרונות:
- ⚠️ מוגבל ל-500 אימיילים/יום
- ⚠️ דורש App Password

---

## איזה אופציה לבחור?

- **Production (Netlify)**: Resend API (מומלץ)
- **Development/Testing**: Gmail SMTP (קל להגדרה)

---

## בדיקה שהאימיילים נשלחים:

1. הרשם משתמש חדש באתר
2. בדוק את ה-console logs:
   - `✅ Email sent via Resend:` = נשלח בהצלחה דרך Resend
   - `✅ Email sent via Gmail SMTP:` = נשלח בהצלחה דרך Gmail
   - `⚠️ No email service configured` = לא מוגדר - צריך להוסיף משתני סביבה

3. בדוק את תיבת הדואר של המשתמש שנרשם

---

## תוכן האימייל:

האימייל כולל:
- ✅ הודעת ברכה
- ✅ קישור לאימות אימייל (כפתור + קישור טקסט)
- ✅ הוראות ברורות
- ✅ עיצוב מקצועי עם HTML

---

## פתרון בעיות:

### האימייל לא נשלח:
1. בדוק שה-Environment Variables מוגדרים ב-Netlify
2. בדוק את ה-logs ב-Netlify Functions
3. ודא שה-App Password תקין (Gmail)
4. ודא שה-API Key תקין (Resend)

### האימייל נשלח אבל לא מגיע:
1. בדוק את תיבת הספאם
2. בדוק שהאימייל נכון
3. בדוק את ה-logs לפרטים נוספים

