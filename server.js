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

// تحديد المنفذ
const PORT = process.env.PORT || 5000;

// Middleware لتسجيل الطلبات
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (req.headers.authorization) {
    console.log('Headers:', { 
      ...req.headers, 
      authorization: req.headers.authorization.substring(0, 20) + '...' 
    });
  } else {
    console.log('Headers:', req.headers);
  }
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  
  next();
});

// مسار الفحص الصحي للخادم - متاح دائمًا حتى قبل الاتصال بقاعدة البيانات
app.get('/api/test', (req, res) => {
  res.json({ message: 'الخادم يعمل بنجاح!', timestamp: new Date().toISOString() });
});

// استيراد مسارات API
const userRoutes = require('./server/routes/userRoutes');
const sessionRoutes = require('./server/routes/sessionRoutes');

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// التعامل مع الملفات الثابتة في الإنتاج
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  // تعيين مجلد المبنى الثابت
  app.use(express.static(path.join(__dirname, '/client/build')));

  // أي مسار غير موجود في المسارات المحددة سابقاً يتم توجيهه للتطبيق الأمامي
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('الخادم يعمل في وضع التطوير...');
  });
}

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('خطأ عام في الخادم:', err);
  res.status(500).json({ 
    message: 'حدث خطأ في الخادم', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي' 
  });
});

// بدء تشغيل الخادم أولاً، ثم الاتصال بقاعدة البيانات
const server = app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`للوصول إلى الخادم: http://localhost:${PORT}`);
  
  // الاتصال بقاعدة البيانات بعد بدء تشغيل الخادم
  connectToDatabase();
});

// دالة الاتصال بقاعدة البيانات
async function connectToDatabase() {
  try {
    console.log('جاري محاولة الاتصال بقاعدة البيانات...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('تم الاتصال بقاعدة البيانات بنجاح!');
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    console.log('سيستمر الخادم في العمل، لكن قد لا تعمل بعض الوظائف التي تتطلب قاعدة البيانات');
    
    // إعادة المحاولة بعد فترة (اختياري)
    setTimeout(connectToDatabase, 5000);
  }
}

// معالجة الإغلاق الآمن
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('تم استلام إشارة إيقاف، سيتم إغلاق الخادم بشكل آمن...');
  server.close(() => {
    console.log('تم إغلاق جميع الاتصالات');
    mongoose.connection.close(false, () => {
      console.log('تم إغلاق اتصال قاعدة البيانات');
      process.exit(0);
    });
  });
}