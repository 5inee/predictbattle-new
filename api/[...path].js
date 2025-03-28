// هذا ملف توجيه عام (catch-all) لجميع طلبات API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// استيراد المسارات
const userRoutes = require('../server/routes/userRoutes');
const sessionRoutes = require('../server/routes/sessionRoutes');

// إنشاء تطبيق Express
const app = express();
app.use(cors());
app.use(express.json());

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// مسار الفحص
app.get('/api/test', (req, res) => {
  res.json({ message: 'الخادم يعمل بنجاح!', timestamp: new Date().toISOString() });
});

// دالة الاتصال بقاعدة البيانات
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    const client = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = client;
    console.log('تم الاتصال بقاعدة البيانات');
    return client;
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    throw error;
  }
}

// معالج الطلبات
module.exports = async (req, res) => {
  try {
    // الاتصال بقاعدة البيانات
    await connectToDatabase();
    
    // تنسيق URL لتتناسب مع تنسيق Express
    // بما أن Vercel يعطي URL كاملة، نحتاج إلى استخراج المسار فقط
    req.url = req.url.replace(/^\/api\/[^\/]+\//, '/api/');
    
    console.log('طلب API:', req.url, req.method);
    
    // استخدام تطبيق Express لمعالجة الطلب
    app(req, res);
  } catch (error) {
    console.error('خطأ في معالجة الطلب:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
};