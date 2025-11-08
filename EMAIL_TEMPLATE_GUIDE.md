# מדריך עריכת תבנית האימייל

## איפה לערוך את הטקסט של האימייל?

הקובץ: `frontend/src/app/api/auth/register/route.ts`  
שורות: 240-284

---

## חלקי האימייל שאפשר לשנות:

### 1. כותרת האימייל (Subject)
**שורה 221:**
```typescript
subject: 'ברוכים הבאים ל-Aegis Spectra - אימות אימייל',
```

**דוגמה לשינוי:**
```typescript
subject: 'ברוכים הבאים! אנא אמת את האימייל שלך',
```

---

### 2. כותרת ראשית (Header)
**שורות 234-235:**
```typescript
<h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: bold;">🛡️ Aegis Spectra</h1>
<p style="color: #ECECEC; margin: 10px 0 0 0; font-size: 16px;">ברוכים הבאים!</p>
```

**דוגמה לשינוי:**
```typescript
<h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: bold;">🛡️ Aegis Spectra Security</h1>
<p style="color: #ECECEC; margin: 10px 0 0 0; font-size: 16px;">ברוכים הבאים למשפחת Aegis Spectra!</p>
```

---

### 3. הודעת ברכה
**שורות 240-244:**
```typescript
<h2 style="color: #ECECEC; margin: 0 0 20px 0; font-size: 24px;">שלום ${name},</h2>

<p style="color: #ECECEC; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
  תודה על ההרשמה לאתר שלנו! אנחנו שמחים שהצטרפת אלינו.
</p>

<p style="color: #ECECEC; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
  כדי להשלים את ההרשמה ולאמת את האימייל שלך, אנא לחץ על הכפתור הבא:
</p>
```

**דוגמה לשינוי:**
```typescript
<h2 style="color: #ECECEC; margin: 0 0 20px 0; font-size: 24px;">שלום ${name},</h2>

<p style="color: #ECECEC; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
  תודה שהצטרפת ל-Aegis Spectra! אנחנו שמחים להיות כאן בשבילך.
</p>

<p style="color: #ECECEC; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
  כדי להשלים את ההרשמה ולאמת את האימייל שלך, אנא לחץ על הכפתור הבא:
</p>
```

---

### 4. טקסט הכפתור
**שורה 253:**
```typescript
✅ אמת אימייל עכשיו
```

**דוגמה לשינוי:**
```typescript
✅ לחץ כאן לאימות אימייל
```

---

### 5. הוראות חשובות
**שורות 267-272:**
```typescript
<p style="color: #ECECEC; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">⚠️ חשוב לדעת:</p>
<ul style="color: #ECECEC; margin: 0; padding-right: 20px; font-size: 14px; line-height: 1.8;">
  <li>הקישור יפוג בעוד 24 שעות</li>
  <li>האימייל שלך לא יאומת עד שתלחץ על הקישור</li>
  <li>אם לא ביצעת הרשמה, אנא התעלם מהאימייל הזה</li>
</ul>
```

**דוגמה לשינוי:**
```typescript
<p style="color: #ECECEC; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">⚠️ הוראות חשובות:</p>
<ul style="color: #ECECEC; margin: 0; padding-right: 20px; font-size: 14px; line-height: 1.8;">
  <li>הקישור יפוג בעוד 24 שעות - אנא אמת את האימייל בהקדם</li>
  <li>האימייל שלך לא יאומת עד שתלחץ על הקישור</li>
  <li>אם לא ביצעת הרשמה, אנא התעלם מהאימייל הזה</li>
  <li>לאחר אימות, תוכל להתחבר לחשבון שלך</li>
</ul>
```

---

### 6. פרטי יצירת קשר
**שורות 277-283:**
```typescript
<p style="color: #999; margin: 0 0 15px 0; font-size: 14px;">יש לך שאלות? אנחנו כאן לעזור:</p>
<p style="color: #ECECEC; margin: 5px 0; font-size: 14px;">
  📞 טלפון: <a href="tel:+972559737025" style="color: #D4AF37; text-decoration: none;">+972-55-973-7025</a>
</p>
<p style="color: #ECECEC; margin: 5px 0; font-size: 14px;">
  📧 אימייל: <a href="mailto:aegisspectra@gmail.com" style="color: #D4AF37; text-decoration: none;">aegisspectra@gmail.com</a>
</p>
```

**דוגמה לשינוי:**
```typescript
<p style="color: #999; margin: 0 0 15px 0; font-size: 14px;">יש לך שאלות? אנחנו כאן לעזור:</p>
<p style="color: #ECECEC; margin: 5px 0; font-size: 14px;">
  📞 טלפון: <a href="tel:+972559737025" style="color: #D4AF37; text-decoration: none;">055-973-7025</a>
</p>
<p style="color: #ECECEC; margin: 5px 0; font-size: 14px;">
  📧 אימייל: <a href="mailto:aegisspectra@gmail.com" style="color: #D4AF37; text-decoration: none;">aegisspectra@gmail.com</a>
</p>
<p style="color: #ECECEC; margin: 5px 0; font-size: 14px;">
  💬 WhatsApp: <a href="https://wa.me/972559737025" style="color: #D4AF37; text-decoration: none;">שלח הודעה</a>
</p>
```

---

## איך לערוך:

1. פתח את הקובץ: `frontend/src/app/api/auth/register/route.ts`
2. גלול לשורה 240 (אזור ה-HTML של האימייל)
3. שנה את הטקסט שאתה רוצה
4. שמור את הקובץ
5. העלה ל-GitHub (אם צריך)

---

## טיפים:

- ✅ שמור על עיצוב HTML (style attributes)
- ✅ השתמש ב-`${name}` כדי להציג את שם המשתמש
- ✅ השתמש ב-`${verificationUrl}` כדי להציג את קישור האימות
- ✅ בדוק שהטקסט בעברית (direction: rtl)
- ✅ שמור על עיצוב מקצועי

---

## דוגמה מלאה לשינוי:

אם אתה רוצה לשנות את כל הטקסט, פשוט ערוך את החלקים הרלוונטיים בקובץ.

**למשל, אם אתה רוצה להוסיף טקסט נוסף:**
```typescript
<p style="color: #ECECEC; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
  תודה על ההרשמה לאתר שלנו! אנחנו שמחים שהצטרפת אלינו.
</p>

<!-- הוסף כאן טקסט נוסף -->
<p style="color: #ECECEC; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
  לאחר אימות האימייל, תוכל לגשת לכל התכונות של האתר, כולל:
</p>
<ul style="color: #ECECEC; margin: 0 0 20px 0; padding-right: 20px; font-size: 16px; line-height: 1.8;">
  <li>מעקב אחר הזמנות</li>
  <li>ניהול חשבון</li>
  <li>תמיכה טכנית</li>
</ul>

<p style="color: #ECECEC; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
  כדי להשלים את ההרשמה ולאמת את האימייל שלך, אנא לחץ על הכפתור הבא:
</p>
```

---

## הערות חשובות:

- ⚠️ אל תמחק את `${verificationUrl}` - זה הקישור לאימות!
- ⚠️ אל תמחק את `${name}` - זה שם המשתמש!
- ⚠️ שמור על מבנה HTML תקין
- ✅ אתה יכול להוסיף/לשנות/למחוק טקסטים כרצונך

