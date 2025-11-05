// Script ליצירת Hash עם bcryptjs
// הרץ: node GENERATE_HASH.js "s197678a"

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 's197678a';

console.log('\n🔐 יוצר Hash לסיסמה:', password);
console.log('⏳ זה יכול לקחת כמה שניות...\n');

bcrypt.hash(password, 12).then(hash => {
  console.log('✅ Hash שנוצר (עם bcryptjs):');
  console.log(hash);
  console.log('\n📋 SQL Query לעדכון:');
  console.log(`UPDATE users SET password_hash = '${hash}', updated_at = NOW() WHERE email = 'aegisspectra@gmail.com';`);
  console.log('\n✅ סיום!\n');
}).catch(err => {
  console.error('❌ שגיאה:', err);
  process.exit(1);
});

