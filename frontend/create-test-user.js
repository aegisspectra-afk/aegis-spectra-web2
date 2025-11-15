// Script to create a test user
// Run with: node create-test-user.js

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function createTestUser() {
  const name = 'משתמש בדיקה';
  const email = 'test@example.com';
  const phone = '0501234567';
  const password = 'Test123!@#';
  
  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  
  // Generate API key
  const randomBytes = crypto.randomBytes(32);
  const apiKey = `aegis_${randomBytes.toString('hex')}`;
  const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  console.log('\n✅ פרטי המשתמש שנוצר:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`שם: ${name}`);
  console.log(`אימייל: ${email}`);
  console.log(`טלפון: ${phone}`);
  console.log(`סיסמה: ${password}`);
  console.log(`תפקיד: customer`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 SQL Query ליצירת המשתמש:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`
INSERT INTO users (
  name, email, phone, password_hash, api_key_hash, 
  email_verified, role, created_at
)
VALUES (
  '${name}',
  '${email}',
  '${phone}',
  '${passwordHash}',
  '${apiKeyHash}',
  true,
  'customer',
  NOW()
)
RETURNING id, name, email, phone, role;
  `);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 הוראות:');
  console.log('1. העתק את ה-SQL Query למעלה');
  console.log('2. לך ל-Netlify Dashboard → Database → SQL Editor');
  console.log('3. הדבק והרץ את השאילתה');
  console.log('4. התחבר עם:');
  console.log(`   - אימייל: ${email}`);
  console.log(`   - סיסמה: ${password}`);
  console.log('\n');
}

createTestUser().catch(console.error);

