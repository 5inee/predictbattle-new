// نقطة وصول رئيسية لمسارات API

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// إنشاء تطبيق Express
const app = express();
app.use(express.json());

// مسار الفحص للتأكد من أن API يعمل
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API يعمل بنجاح!', 
    timestamp: new Date().toISOString() 
  });
});

// دالة للاتصال بقاعدة البيانات
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB متصلة');
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    throw error;
  }
};

// معالج الطلبات
const handler = async (req, res) => {
  // التعامل مع مسار الفحص بدون الاتصال بقاعدة البيانات
  if (req.url === '/api/test') {
    return app(req, res);
  }
  
  // الاتصال بقاعدة البيانات لبقية المسارات
  try {
    await connectDB();
    
    return new Promise((resolve, reject) => {
      app(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  } catch (error) {
    console.error('خطأ في معالجة الطلب:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

module.exports = handler;