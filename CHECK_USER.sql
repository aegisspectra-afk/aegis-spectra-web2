-- ============================================
-- בדיקת משתמש - aegisspectra@gmail.com
-- ============================================

-- בדוק אם המשתמש קיים ומה הפרטים שלו
SELECT 
  id,
  name,
  email,
  LOWER(email) as email_lower,
  role,
  email_verified,
  CASE 
    WHEN password_hash IS NULL THEN '❌ אין סיסמה'
    WHEN password_hash = '' THEN '❌ סיסמה ריקה'
    WHEN LENGTH(password_hash) < 50 THEN '❌ Hash קצר מדי'
    WHEN password_hash NOT LIKE '$2%' THEN '❌ Hash לא תקין (לא מתחיל ב-$2)'
    ELSE '✅ Hash נראה תקין'
  END as password_status,
  LENGTH(password_hash) as password_hash_length,
  LEFT(password_hash, 30) as password_hash_preview,
  SUBSTRING(password_hash, 1, 7) as hash_version, -- $2a$12$ או $2b$12$
  created_at,
  updated_at,
  last_login
FROM users 
WHERE LOWER(email) = LOWER('aegisspectra@gmail.com');

-- בדוק אם יש משתמשים אחרים עם email דומה
SELECT 
  id,
  name,
  email,
  role,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 30) as hash_preview
FROM users 
WHERE email ILIKE '%aegisspectra%'
ORDER BY created_at DESC;

