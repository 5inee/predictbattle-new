// هذا الملف سيعالج جميع طلبات /api/users/*
// مثل /api/users/login و /api/users/register و /api/users/guest

const express = require('express');
const mongoose = require('mongoose');
const { registerUser, loginUser, guestLogin, getUserProfile } = require('../../server/controllers/userController');
const { protect } = require('../../server/middleware/authMiddleware');
require('dotenv').config();

// إنشاء تطبيق Express
const app = express();
app.use(express.json());

// مسارات المستخدمين
app.post('/api/users/register', registerUser);
app.post('/api/users/login', loginUser);
app.post('/api/users/guest', guestLogin);
app.get('/api/users/profile', protect, getUserProfile);

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