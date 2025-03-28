// هذا الملف سيعالج جميع طلبات /api/sessions/*

const express = require('express');
const mongoose = require('mongoose');
const { 
  createSession, 
  joinSession, 
  submitPrediction, 
  getSession, 
  getUserSessions 
} = require('../../server/controllers/sessionController');
const { protect } = require('../../server/middleware/authMiddleware');
require('dotenv').config();

// إنشاء تطبيق Express
const app = express();
app.use(express.json());

// حماية جميع المسارات
app.use(protect);

// مسارات جلسات التوقع
app.post('/api/sessions/create', createSession);
app.post('/api/sessions/join', joinSession);
app.post('/api/sessions/predict', submitPrediction);
app.get('/api/sessions/mysessions', getUserSessions);
app.get('/api/sessions/:id', getSession);

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
  // تأكد من الاتصال بقاعدة البيانات
  await connectDB();
  
  // تنسيق الطلب للتوافق مع Express
  return new Promise((resolve, reject) => {
    app(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = handler;