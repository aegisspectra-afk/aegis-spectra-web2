# Admin System Database Setup

## סכימת DB מלאה למערכת ה-ADMIN

הקובץ `admin-system-schema.sql` כולל את כל הטבלאות הנדרשות למערכת ה-ADMIN:

### טבלאות שנוצרות:

1. **audit_logs** - יומן פעילות מלא
   - מעקב אחר כל הפעולות במערכת
   - שדות: user_id, user_email, action, resource_type, resource_id, details, ip_address, user_agent

2. **notifications** - התראות למנהלים
   - התראות על פעולות חשובות
   - שדות: user_id, type, title, message, action_url, read, read_at

3. **settings** - הגדרות מערכת
   - הגדרות כלליות, אימייל, תשלום, משלוח
   - שדות: id, data (JSONB), created_at, updated_at

4. **orders** - הזמנות
   - ניהול הזמנות מלא
   - שדות: order_id, customer_name, customer_email, items, total, order_status, payment_status

5. **order_items** - פריטי הזמנות
   - פריטים בכל הזמנה
   - שדות: order_id, sku, name, price, quantity

6. **leads** - לידים (CRM)
   - ניהול לידים מלא
   - שדות: name, phone, email, city, status, score, tags

7. **products** - מוצרים
   - ניהול מוצרים מלא
   - שדות: sku, name, price_regular, price_sale, stock, active

8. **users** - משתמשים
   - ניהול משתמשים מלא
   - שדות: name, email, phone, role, password_hash

## איך להריץ:

1. לך ל-**Netlify Dashboard → Database → SQL Editor**
2. העתק את כל התוכן מ-`admin-system-schema.sql`
3. הרץ את השאילתה
4. כל הטבלאות יווצרו אוטומטית

## הערות:

- כל הטבלאות נוצרות עם `IF NOT EXISTS` כדי למנוע שגיאות
- כל האינדקסים נוצרים עם `IF NOT EXISTS` כדי למנוע שגיאות
- אם טבלה כבר קיימת, היא לא תוחלף

## בדיקה:

לאחר הרצת הסכימה, בדוק שהטבלאות נוצרו:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('audit_logs', 'notifications', 'settings', 'orders', 'order_items', 'leads', 'products', 'users');
```

אם כל הטבלאות מופיעות, הסכימה הורצה בהצלחה!

