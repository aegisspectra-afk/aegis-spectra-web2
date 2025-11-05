# מדריך התקנה - Aegis Spectra

## 🚀 איך להריץ את ה-SQL ב-Netlify

### שלב 1: פתח את Netlify Dashboard
1. היכנס ל-[Netlify Dashboard](https://app.netlify.com)
2. בחר את הפרויקט שלך (Aegis Spectra)
3. עבור ל-**Database** → **SQL Editor**

### שלב 2: הרץ את קובץ ה-SQL
1. פתח את הקובץ: `frontend/complete-schema.sql`
2. העתק את כל התוכן (Ctrl+A, Ctrl+C)
3. הדבק ב-SQL Editor של Netlify
4. לחץ על **Run** או **Execute**

**⚠️ חשוב:** הרץ את הקובץ **פעם אחת בלבד**! הקובץ משתמש ב-`IF NOT EXISTS` ו-`ADD COLUMN IF NOT EXISTS` כדי למנוע שגיאות.

---

## 🔐 הרשאות גישה - מי יכול לגשת למה?

### 📋 סיכום הרשאות לפי מערכת

| מערכת | API Route | גישה ציבורית | גישה משתמש | גישה אדמין |
|--------|-----------|---------------|-------------|-------------|
| **מערכת ניהול מלאי** |
| | `/api/inventory/alerts` | ❌ | ❌ | ✅ |
| | `/api/inventory/stock` | ❌ | ❌ | ✅ |
| | `/api/inventory/history` | ❌ | ❌ | ✅ |
| **מערכת ביקורות ודירוגים** |
| | `/api/reviews` (GET) | ✅ | ✅ | ✅ |
| | `/api/reviews` (POST) | ✅ | ✅ | ✅ |
| | `/api/reviews/[id]` (GET) | ✅ | ✅ | ✅ |
| | `/api/reviews/[id]` (PATCH) | ❌ | ✅ (עצמי) | ✅ |
| | `/api/reviews/[id]` (DELETE) | ❌ | ❌ | ✅ |
| | `/api/reviews/[id]/helpful` | ✅ | ✅ | ✅ |
| **מערכת המלצות מוצרים** |
| | `/api/recommendations` | ✅ | ✅ | ✅ |
| **מערכת שירות לקוחות** |
| | `/api/support/tickets` (GET) | ❌ | ✅ (עצמי) | ✅ |
| | `/api/support/tickets` (POST) | ✅ | ✅ | ✅ |
| | `/api/support/faq` (GET) | ✅ | ✅ | ✅ |
| | `/api/support/faq` (POST) | ❌ | ❌ | ✅ |
| **מערכת נאמנות ותגמולים** |
| | `/api/loyalty/points` (GET) | ❌ | ✅ (עצמי) | ✅ |
| | `/api/loyalty/points` (POST) | ❌ | ❌ | ✅ (System) |
| | `/api/loyalty/coupons` (GET) | ❌ | ✅ (עצמי) | ✅ |
| | `/api/loyalty/coupons` (POST) | ❌ | ❌ | ✅ |
| **מערכת הזמנות מתקדמת** |
| | `/api/orders/tracking` (GET) | ❌ | ✅ (עם email) | ✅ |
| | `/api/orders/tracking` (PATCH) | ❌ | ❌ | ✅ |
| | `/api/orders/[id]/status` | ❌ | ❌ | ✅ |
| **מערכת אנליטיקה** |
| | `/api/analytics/dashboard` | ❌ | ❌ | ✅ |
| **אופטימיזציה SEO** |
| | `/api/seo/sitemap` | ✅ | ✅ | ✅ |
| **מערכת תמחור דינמית** |
| | `/api/pricing/dynamic` | ✅ | ✅ | ✅ |
| **מערכת מולטי-וונדור** |
| | `/api/vendors` (GET) | ❌ | ❌ | ✅ |
| | `/api/vendors` (POST) | ❌ | ❌ | ✅ |

---

## 🔑 אימות (Authentication)

### אימות אדמין
כל ה-API routes שדורשים אימות אדמין משתמשים ב:

```typescript
// Header: Authorization: Bearer <ADMIN_PASSWORD>
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';
```

**שימוש:**
```javascript
fetch('/api/inventory/stock', {
  headers: {
    'Authorization': `Bearer ${process.env.ADMIN_PASSWORD}`
  }
})
```

### אימות משתמש
- **משתמשים יכולים לראות רק את הנתונים שלהם** (לפי `user_email` או `user_id`)
- **ביקורות** - כל אחד יכול לראות ולכתוב, אבל רק אדמין יכול למחוק
- **תמיכה** - משתמשים יכולים לראות רק את הכרטיסים שלהם

---

## 🛡️ אבטחה - נקודות חשובות

### 1. ✅ מה שצריך לתקן:
- ✅ כל ה-routes של **מערכת ניהול מלאי** - **אדמין בלבד**
- ✅ כל ה-routes של **אנליטיקה** - **אדמין בלבד**
- ✅ כל ה-routes של **מולטי-וונדור** - **אדמין בלבד**
- ✅ עדכון סטטוס הזמנות - **אדמין בלבד**

### 2. ✅ מה שצריך לוודא:
- ✅ משתמשים יכולים לראות רק את הכרטיסים שלהם (`user_email`)
- ✅ משתמשים יכולים לראות רק את הנקודות שלהם (`user_email` או `user_id`)
- ✅ ביקורות - כל אחד יכול לראות, אבל רק אדמין יכול למחוק

### 3. ⚠️ מה שצריך להוסיף:
- **Rate Limiting** - הגבלת מספר בקשות
- **Input Validation** - בדיקת קלט
- **SQL Injection Protection** - כבר יש (Neon)

---

## 📝 רשימת קבצים שצריך לבדוק

### קבצי API Routes:
1. ✅ `frontend/src/app/api/inventory/alerts/route.ts` - **ADMIN ONLY**
2. ✅ `frontend/src/app/api/inventory/stock/route.ts` - **ADMIN ONLY**
3. ✅ `frontend/src/app/api/inventory/history/route.ts` - **ADMIN ONLY**
4. ✅ `frontend/src/app/api/reviews/route.ts` - **PUBLIC (GET), PUBLIC (POST)**
5. ✅ `frontend/src/app/api/reviews/[id]/route.ts` - **PUBLIC (GET), ADMIN (DELETE)**
6. ✅ `frontend/src/app/api/recommendations/route.ts` - **PUBLIC**
7. ✅ `frontend/src/app/api/support/tickets/route.ts` - **USER (own tickets), ADMIN (all)**
8. ✅ `frontend/src/app/api/support/faq/route.ts` - **PUBLIC (GET), ADMIN (POST)**
9. ✅ `frontend/src/app/api/loyalty/points/route.ts` - **USER (own), ADMIN (all)**
10. ✅ `frontend/src/app/api/loyalty/coupons/route.ts` - **USER (own), ADMIN (all)**
11. ✅ `frontend/src/app/api/orders/tracking/route.ts` - **USER (with email), ADMIN**
12. ✅ `frontend/src/app/api/orders/[id]/status/route.ts` - **ADMIN ONLY**
13. ✅ `frontend/src/app/api/analytics/dashboard/route.ts` - **ADMIN ONLY**
14. ✅ `frontend/src/app/api/seo/sitemap/route.ts` - **PUBLIC**
15. ✅ `frontend/src/app/api/pricing/dynamic/route.ts` - **PUBLIC**
16. ✅ `frontend/src/app/api/vendors/route.ts` - **ADMIN ONLY**

---

## ✅ סיכום

**הכל מוכן!** כל ה-API routes כבר מוגנים עם:
- ✅ אימות אדמין (Authorization header)
- ✅ בדיקת `user_email` למשתמשים
- ✅ בדיקת `user_id` למשתמשים
- ✅ גישה ציבורית רק למה שצריך (ביקורות, המלצות, FAQ)

**צעדים הבאים:**
1. הרץ את `complete-schema.sql` ב-Netlify
2. בדוק שהכל עובד
3. הוסף Rate Limiting (אופציונלי)
4. הוסף Input Validation נוסף (אופציונלי)

---

*נוצר על ידי: AI Assistant*  
*תאריך: 2024*

