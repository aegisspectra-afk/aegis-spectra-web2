-- ============================================
-- עדכון סיסמה סופי - aegisspectra@gmail.com
-- Hash: $2b$12$Ab6tn7GkoUu2zqYDMiG6Suy1QehzwVaE8ZuT4yIHzvEBRQST5yWRq
-- סיסמה: s197678a
-- ============================================

-- עדכן את הסיסמה והתפקיד
UPDATE users 
SET 
  password_hash = '$2b$12$Ab6tn7GkoUu2zqYDMiG6Suy1QehzwVaE8ZuT4yIHzvEBRQST5yWRq',
  role = 'super_admin',
  email_verified = true,
  updated_at = NOW()
WHERE LOWER(email) = LOWER('aegisspectra@gmail.com')
RETURNING id, name, email, role, email_verified;

-- בדוק את התוצאה
SELECT 
  id,
  name,
  email,
  role,
  email_verified,
  CASE 
    WHEN password_hash = '$2b$12$Ab6tn7GkoUu2zqYDMiG6Suy1QehzwVaE8ZuT4yIHzvEBRQST5yWRq' THEN '✅ הסיסמה עודכנה נכון'
    ELSE '❌ הסיסמה לא עודכנה'
  END as password_status,
  CASE 
    WHEN role = 'super_admin' THEN '✅ התפקיד תקין'
    ELSE '❌ התפקיד לא תקין'
  END as role_status,
  LEFT(password_hash, 30) as hash_preview
FROM users 
WHERE LOWER(email) = LOWER('aegisspectra@gmail.com');

-- אם המשתמש לא קיים, צור אותו
INSERT INTO users (
  name, 
  email, 
  phone, 
  password_hash, 
  api_key_hash, 
  email_verified, 
  role, 
  created_at
)
SELECT 
  'מנהל ראשי',
  'aegisspectra@gmail.com',
  '0501234567',  -- החלף בטלפון שלך אם צריך
  '$2b$12$Ab6tn7GkoUu2zqYDMiG6Suy1QehzwVaE8ZuT4yIHzvEBRQST5yWRq',
  encode(gen_random_bytes(32), 'hex'),
  true,
  'super_admin',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE LOWER(email) = LOWER('aegisspectra@gmail.com')
)
RETURNING id, name, email, role;

