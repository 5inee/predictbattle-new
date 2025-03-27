import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './CreateSessionPage.css';

const CreateSessionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    maxPlayers: 5,
    secretCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const { title, maxPlayers, secretCode } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال العنوان
    if (!title.trim()) {
      setErrorMessage('يرجى إدخال سؤال التحدي');
      return;
    }
    
    // التحقق من الرمز السري
    if (secretCode !== '021') {
      setErrorMessage('الرمز السري غير صحيح');
      return;
    }
    
    try {
      setLoading(true);
      console.log('التوكن المستخدم:', user.token);
      console.log('البيانات المرسلة:', formData);
      
      // تكوين الهيدر
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // إرسال طلب إنشاء الجلسة
      console.log('إرسال طلب إنشاء الجلسة...');
      const response = await axios.post('/api/sessions/create', formData, config);
      console.log('استجابة الخادم:', response.data);
      
      setLoading(false);
      
      // التوجيه إلى صفحة الجلسة
      navigate(`/session/${response.data.session._id}`);
    } catch (error) {
      console.error('خطأ في إنشاء الجلسة:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'حدث خطأ أثناء إنشاء الجلسة، يرجى المحاولة مرة أخرى'
      );
      console.log('تفاصيل الخطأ:', error.response?.data);
      setLoading(false);
    }
  };
  
  return (
    <div className="create-session-page">
      <div className="page-header">
        <h1 className="page-title">إنشاء جلسة توقع جديدة</h1>
      </div>
      
      <div className="card form-card">
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">سؤال التحدي</label>
            <textarea
              id="title"
              name="title"
              className="form-control"
              value={title}
              onChange={onChange}
              placeholder="اكتب سؤال التحدي هنا... مثال: من سيفوز بكأس العالم 2026؟"
              rows={4}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="maxPlayers">عدد اللاعبين (2-20)</label>
            <input
              type="number"
              id="maxPlayers"
              name="maxPlayers"
              className="form-control"
              value={maxPlayers}
              onChange={onChange}
              min={2}
              max={20}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="secretCode">الرمز السري</label>
            <input
              type="text"
              id="secretCode"
              name="secretCode"
              className="form-control"
              value={secretCode}
              onChange={onChange}
              placeholder="أدخل الرمز السري (021)"
            />
            <small className="form-text">الرمز السري مطلوب لمنع إنشاء جلسات عشوائية</small>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'جارِ الإنشاء...' : 'ابدأ الجلسة'}
            </button>
            
            <Link to="/dashboard" className="btn btn-text">
              العودة
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;