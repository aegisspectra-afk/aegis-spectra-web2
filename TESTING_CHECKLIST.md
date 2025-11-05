# רשימת בדיקות לאתר - Aegis Spectra

## ✅ בדיקות בסיסיות (Priority A)

### 1. עמוד ראשי - חבילות
- [ ] **ביקור בעמוד הראשי** (`/`)
  - [ ] מוצגות רק 4 חבילות (Apartment Basic, Apartment Pro, House Pro, Business Starter)
  - [ ] כפתור "צפה בכל החבילות" מוביל ל-`/packages`
  - [ ] כפתור "השווה בין חבילות" מוביל ל-`/packages/compare`
  - [ ] כל חבילה מציגה: שם, מחיר, 5 תכונות עיקריות
  - [ ] כפתור "לפרטים" מוביל לעמוד החבילה
  - [ ] כפתור "בקשת הצעת מחיר" מוביל ל-`/quote?package=[slug]`

### 2. עמוד כל החבילות
- [ ] **ביקור ב-`/packages`**
  - [ ] מוצגות כל 8 החבילות
  - [ ] חיפוש עובד (נסה לחפש "דירה" או "apartment")
  - [ ] פילטרים לפי קטגוריה עובדים (מגזר פרטי/עסקי/ארגוני)
  - [ ] כל חבילה עם קישורים לפרטים ולבקשת הצעת מחיר

### 3. עמוד חבילה פרטנית
- [ ] **ביקור ב-`/packages/[slug]`** (למשל: `/packages/apartment-basic`)
  - [ ] Hero section מוצג
  - [ ] Features list מוצג
  - [ ] Specifications table מוצג
  - [ ] **מחשבון מחיר עובד:**
    - [ ] סליידר מצלמות (CameraSelector) עובד - **מרגיש מקצועי עם אנימציות**
    - [ ] הערך מתעדכן בזמן אמת
    - [ ] תווית משתנה ("כיסוי בסיסי", "כיסוי מלא", "מערכת מתקדמת")
    - [ ] בחירת AI Detection (אם קיים)
    - [ ] בחירת Storage (אם קיים)
    - [ ] בחירת Addons (אם קיים)
    - [ ] מחיר מתעדכן בזמן אמת
    - [ ] Breakdown מוצג (מחיר בסיס, מצלמות נוספות, תוספות, וכו')
    - [ ] כפתור "הוסף לעגלה" עובד
  - [ ] Addons section מוצג

### 4. בקשה להצעת מחיר (Quote Builder)
- [ ] **ביקור ב-`/quote`**
  - [ ] 4 שלבים מוצגים
  - [ ] Progress indicator מוצג
  
- [ ] **שלב 1: פרטי מבנה**
  - [ ] שדות: גודל נכס, מיקום, דרישות מיוחדות, תקציב
  - [ ] כפתור "הבא" מוביל לשלב 2
  
- [ ] **שלב 2: בחירת חבילה**
  - [ ] אם הגעת מ-`/packages/[slug]` → החבילה נטענת אוטומטית
  - [ ] אפשר לבחור חבילה חדשה
  - [ ] אפשר להסיר חבילה נבחרת
  - [ ] מחיר משוער מוצג
  
- [ ] **שלב 3: התאמות** (אם חבילה נבחרת)
  - [ ] סליידר מצלמות עובד
  - [ ] בחירת AI Detection
  - [ ] בחירת Storage
  - [ ] בחירת Addons
  - [ ] מחיר מתעדכן בזמן אמת
  
- [ ] **שלב 4: סיכום**
  - [ ] כל הפרטים מוצגים
  - [ ] מחיר סופי מוצג
  - [ ] כפתור "שלח בקשה" עובד
  - [ ] **ולידציה בצד שרת** מתבצעת לפני שליחה
  - [ ] אם המחיר שונה - מוצגת אזהרה

- [ ] **Auto-save Draft**
  - [ ] התחל למילוא טופס
  - [ ] עזוב את העמוד
  - [ ] חזור ל-`/quote`
  - [ ] הטיוטה נטענת אוטומטית

### 5. Analytics Tracking
- [ ] **פתח Developer Tools → Network**
  - [ ] ביקור בעמוד חבילה → POST `/api/analytics/events` עם `eventType: 'package_view'`
  - [ ] שימוש במחשבון → POST עם `eventType: 'price_calc'`
  - [ ] התחלת quote → POST עם `eventType: 'quote_start'`
  - [ ] שליחת quote → POST עם `eventType: 'quote_submit'`

---

## 🔧 בדיקות Admin Panel (Priority A)

### 6. עמוד ניהול חבילות
- [ ] **ביקור ב-`/admin/packages`**
  - [ ] טבלת חבילות מוצגת
  - [ ] חיפוש עובד
  - [ ] פילטרים לפי קטגוריה עובדים
  - [ ] כפתור "חבילה חדשה" מוביל ל-`/admin/packages/new`
  - [ ] כפתור "ערוך" מוביל ל-`/admin/packages/[id]`
  - [ ] כפתור "גרסאות" מוביל ל-`/admin/packages/[id]/versions`

### 7. Analytics Dashboard
- [ ] **ביקור ב-`/admin/analytics`**
  - [ ] Funnel metrics מוצגים (ביקורים, התחלות, הצעות, המרות)
  - [ ] Top packages מוצגים
  - [ ] (בהמשך: תרשים גרפים)

---

## 🛒 בדיקות Cart & Checkout (Priority B)

### 8. עגלת קניות
- [ ] **הוספת חבילה לעגלה**
  - [ ] עמוד חבילה → מחשבון → "הוסף לעגלה"
  - [ ] החבילה נוספה לעגלה
  - [ ] פרטי החבילה נשמרים (slug, options)

- [ ] **צפייה בעגלה**
  - [ ] כפתור עגלה (אם קיים) מציג את החבילות
  - [ ] מחיר כולל מחושב נכון

- [ ] **Checkout**
  - [ ] כפתור "Checkout" מוביל לתהליך
  - [ ] (TODO: Payment integration)

---

## 🎫 בדיקות Promotions (Priority B)

### 9. קוד קופון
- [ ] **ביקור ב-`/api/promotions/validate`**
  - [ ] POST עם קוד קופון → מחזיר הנחה
  - [ ] קוד לא תקף → מחזיר שגיאה
  - [ ] (TODO: UI למבחן קופון)

---

## 🔗 בדיקות Integration (Priority B)

### 10. Share Functionality
- [ ] **ביקור ב-`/api/quotes/[id]/share/[token]`**
  - [ ] (TODO: יצירת share token)
  - [ ] (TODO: Preview של quote עם token)

### 11. CRM Integration
- [ ] **ביקור ב-`/api/integrations/crm/sendQuote`**
  - [ ] POST עם quoteId → (TODO: צריך CRM webhook URL)
  - [ ] (TODO: בדיקה שהצעת מחיר נשלחת ל-CRM)

---

## 📊 בדיקות נוספות (Priority C)

### 12. השוואת חבילות
- [ ] **ביקור ב-`/packages/compare`**
  - [ ] (TODO: אם יש UI להשוואה)
  - [ ] אפשר להשוות בין חבילות
  - [ ] Highlight differences עובד

### 13. PDF Generation
- [ ] **ביקור ב-`/api/quotes/[id]/pdf`**
  - [ ] GET עם quote ID → (TODO: צריך PDF library)
  - [ ] PDF נוצר ונשמר

---

## 🐛 בדיקות באגים נפוצים

### 14. בדיקות טעינה
- [ ] **עמוד ראשי** - טוען מהר
- [ ] **עמוד חבילה** - טוען מהר
- [ ] **מחשבון מחיר** - מחיר מחושב מיד

### 15. בדיקות responsive
- [ ] **Mobile** - הכל נראה טוב
- [ ] **Tablet** - הכל נראה טוב
- [ ] **Desktop** - הכל נראה טוב
- [ ] **סליידר מצלמות** - עובד במובייל (touch)

### 16. בדיקות ביצועים
- [ ] **Lighthouse Score**
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

---

## ✅ Checklist מהיר

### חיוני (חייב לעבוד):
- [ ] עמוד ראשי מציג 4 חבילות
- [ ] עמוד `/packages` מציג כל החבילות
- [ ] עמוד חבילה פרטנית עובד
- [ ] **מחשבון מחיר עובד** (סליידר מצלמות מקצועי!)
- [ ] Quote Builder עובד (4 שלבים)
- [ ] Auto-save draft עובד
- [ ] Server-side price validation עובד
- [ ] Analytics tracking עובד

### חשוב (Priority B):
- [ ] Admin panel עובד
- [ ] Cart integration עובד
- [ ] Checkout flow עובד

### נחמד (Priority C):
- [ ] Analytics dashboard מציג נתונים
- [ ] CRM integration (אם יש webhook)
- [ ] PDF generation (אם יש library)

---

## 🎯 בדיקות מומלצות ראשונות

1. **מחשבון מחיר** - זה החלק הכי חשוב!
   - בדוק שהסליידר מרגיש מקצועי
   - בדוק שהמחיר מתעדכן מיד
   - בדוק שהתווית משתנה ("כיסוי בסיסי", "כיסוי מלא", וכו')

2. **Quote Builder**
   - בדוק שהטיוטה נשמרת אוטומטית
   - בדוק שהמחיר מתעדכן בזמן אמת
   - בדוק שהלידציה בצד שרת עובדת

3. **Analytics**
   - בדוק ש-events נשלחים ל-`/api/analytics/events`

---

**הערות:**
- רוב הפיצ'רים עובדים, אבל יש TODO comments לחיבור ל-Database
- Authentication לא מומש עדיין (צריך להוסיף)
- PDF generation דורש library (pdfkit/puppeteer/jsPDF)
- CRM integration דורש webhook URL

