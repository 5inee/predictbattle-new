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

// Middleware لتسجيل الطلبات
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers.authorization ? 
    { ...req.headers, authorization: req.headers.authorization.substring(0, 20) + '...' } : 
    req.headers);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  
  next();
});

// توصيل بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    process.exit(1); // إيقاف التطبيق في حالة فشل الاتصال بقاعدة البيانات
  });

// مسار للتحقق من عمل الخادم
app.get('/api/test', (req, res) => {
  res.json({ message: 'الخادم يعمل بنجاح!' });
});

// استيراد مسارات API
const userRoutes = require('./server/routes/userRoutes');
const sessionRoutes = require('./server/routes/sessionRoutes');

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('خطأ عام في الخادم:', err);
  res.status(500).json({ 
    message: 'حدث خطأ في الخادم', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي' 
  });
});

// تحديد المنفذ
const PORT = process.env.PORT || 5000;

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`للوصول إلى الخادم: http://localhost:${PORT}`);
});