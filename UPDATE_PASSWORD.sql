-- ============================================
-- עדכון סיסמה למנהל - aegisspectra@gmail.com
-- ============================================

-- עדכן את הסיסמה והתפקיד
UPDATE users 
SET 
  password_hash = '$2a$12$e4vgs7QPU5cdpN0DnMxvlu6FqEasxL5p12lsrF.PYChCxTKGaIF0i',
  role = 'super_admin',
  email_verified = true,
  updated_at = NOW()
WHERE email = 'aegisspectra@gmail.com'
RETURNING id, name, email, role, email_verified;

-- בדוק את התוצאה
SELECT 
  id,
  name,
  email,
  role,
  email_verified,
  CASE 
    WHEN password_hash = '$2a$12$e4vgs7QPU5cdpN0DnMxvlu6FqEasxL5p12lsrF.PYChCxTKGaIF0i' THEN '✅ הסיסמה עודכנה'
    ELSE '❌ הסיסמה לא עודכנה'
  END as password_status,
  CASE 
    WHEN role = 'super_admin' THEN '✅ התפקיד תקין'
    ELSE '❌ התפקיד לא תקין'
  END as role_status
FROM users 
WHERE email = 'aegisspectra@gmail.com';

