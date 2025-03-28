// سكريبت بناء مخصص لـ Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// طباعة معلومات النظام
console.log('====== معلومات البناء ======');
console.log('Node.js:', process.version);
console.log('المجلد الحالي:', process.cwd());
console.log('===========================');

// التأكد من تثبيت اعتماديات العميل وبنائه
console.log('🔄 تثبيت اعتماديات العميل...');
execSync('cd client && npm install', { stdio: 'inherit' });

console.log('🔄 بناء تطبيق العميل...');
execSync('cd client && npm run build', { stdio: 'inherit' });

console.log('✅ تم الانتهاء من البناء بنجاح!');