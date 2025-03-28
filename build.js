const { execSync } = require('child_process');

console.log('====== معلومات البناء ======');
console.log('Node.js:', process.version);
console.log('المجلد الحالي:', process.cwd());
console.log('===========================');

try {
  console.log('🔄 تثبيت اعتماديات العميل...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  console.log('🔄 بناء تطبيق العميل...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  console.log('✅ تم الانتهاء من البناء بنجاح!');
} catch (error) {
  console.error('❌ فشل في عملية البناء:', error);
  process.exit(1);
}