const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// إنشاء تطبيق Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware لتسجيل الطلبات - مفيد للتشخيص
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// تحديد المنفذ
const PORT = process.env.PORT || 5000;

// مسار الفحص الصحي للخادم - متاح دائمًا
app.get('/api/test', (req, res) => {
  res.json({ message: 'الخادم يعمل بنجاح!', timestamp: new Date().toISOString() });
});

// استيراد مسارات API
const userRoutes = require('./server/routes/userRoutes');
const sessionRoutes = require('./server/routes/sessionRoutes');

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// معالجة الملفات الثابتة
app.use(express.static(path.join(__dirname, '/client/build')));

// توجيه جميع المسارات الأخرى إلى تطبيق React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('خطأ عام في الخادم:', err);
  res.status(500).json({ 
    message: 'حدث خطأ في الخادم', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي' 
  });
});

// بدء تشغيل الخادم
const server = app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  
  // الاتصال بقاعدة البيانات
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح!'))
    .catch(error => console.error('خطأ في الاتصال بقاعدة البيانات:', error));
});

// معالجة الإغلاق الآمن
process.on('SIGTERM', () => {
  console.log('تم استلام إشارة إيقاف، سيتم إغلاق الخادم بشكل آمن...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('تم إغلاق اتصال قاعدة البيانات');
      process.exit(0);
    });
  });
});

module.exports = app; // تصدير التطبيق للاستخدام في بيئة Vercel