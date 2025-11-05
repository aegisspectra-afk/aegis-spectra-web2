# 📋 מדריך התקנת SQL - Aegis Spectra

## 🚀 איך להריץ את ה-SQL ב-Netlify

### שלב 1: פתח את Netlify Dashboard
1. היכנס ל-[Netlify Dashboard](https://app.netlify.com)
2. בחר את הפרויקט שלך (Aegis Spectra)
3. עבור ל-**Database** → **SQL Editor**

### שלב 2: הרץ את קובץ ה-SQL
1. פתח את הקובץ: **`frontend/complete-schema.sql`**
2. העתק את כל התוכן (Ctrl+A, Ctrl+C)
3. הדבק ב-SQL Editor של Netlify
4. לחץ על **Run** או **Execute**

**⚠️ חשוב:** הרץ את הקובץ **פעם אחת בלבד**! הקובץ משתמש ב-`IF NOT EXISTS` כדי למנוע שגיאות.

---

## 📝 מה הקובץ כולל?

הקובץ `complete-schema.sql` כולל את כל הטבלאות והפונקציות:

1. ✅ **מערכת ניהול מלאי** - `inventory_alerts`, `stock_history`, פונקציות עדכון מלאי
2. ✅ **מערכת ביקורות ודירוגים** - `reviews`, `review_helpful_votes`, טריגרים
3. ✅ **מערכת נאמנות ותגמולים** - `loyalty_points`, `loyalty_transactions`, `loyalty_coupons`
4. ✅ **מערכת שירות לקוחות** - `support_tickets`, `support_ticket_messages`, `faqs`
5. ✅ **מערכת הזמנות מתקדמת** - `order_status_history`, `order_notifications`, `recurring_orders`
6. ✅ **מערכת מולטי-וונדור** - `vendors`, `vendor_payments`, `vendor_sales_summary`

---

## ✅ אימות שהכל עבד

לאחר הרצת הקובץ, בדוק שהטבלאות נוצרו:

```sql
-- בדוק שהטבלאות קיימות
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'inventory_alerts',
    'stock_history',
    'reviews',
    'review_helpful_votes',
    'loyalty_points',
    'loyalty_transactions',
    'loyalty_coupons',
    'support_tickets',
    'support_ticket_messages',
    'faqs',
    'order_status_history',
    'order_notifications',
    'recurring_orders',
    'vendors',
    'vendor_payments',
    'vendor_sales_summary'
  );
```

אם כל הטבלאות מופיעות - **הכל עבד!** ✅

---

## 🔧 אם יש שגיאות

אם יש שגיאות, בדוק:

1. **טבלת `products` קיימת?** - צריך ליצור אותה קודם
2. **טבלת `orders` קיימת?** - צריך ליצור אותה קודם
3. **טבלת `users` קיימת?** - אופציונלי (אם לא קיימת, חלק מהקודים יכשלו)

אם חסרות טבלאות, הרץ את `frontend/products-schema.sql` קודם.

---

## 📚 קבצים נוספים

אם אתה רוצה להריץ את הקבצים בנפרד (לא מומלץ), הנה הסדר:

1. `frontend/products-schema.sql` - טבלת מוצרים (אם עוד לא קיימת)
2. `frontend/inventory-schema.sql` - מערכת מלאי
3. `frontend/reviews-schema.sql` - מערכת ביקורות
4. `frontend/loyalty-schema.sql` - מערכת נאמנות
5. `frontend/support-schema.sql` - מערכת תמיכה
6. `frontend/advanced-orders-schema.sql` - הזמנות מתקדמות
7. `frontend/vendors-schema.sql` - מערכת ספקים

**אבל מומלץ להריץ את `complete-schema.sql` בלבד!**

---

## ✅ סיכום

1. **פתח** Netlify Dashboard → Database → SQL Editor
2. **העתק** את כל התוכן מ-`frontend/complete-schema.sql`
3. **הדבק** ב-SQL Editor
4. **הרץ** (Run/Execute)
5. **סיימת!** ✅

---

*נוצר על ידי: AI Assistant*  
*תאריך: 2024*

