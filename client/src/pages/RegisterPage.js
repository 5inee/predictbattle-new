import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user, registerUser, error, setError } = useContext(UserContext);
  const navigate = useNavigate();
  
  const { username, password, confirmPassword } = formData;
  
  // إذا كان المستخدم مسجلاً، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    
    // مسح أي أخطاء سابقة
    return () => {
      if (error) {
        setError(null);
      }
    };
  }, [user, navigate, error, setError]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال جميع البيانات
    if (!username || !password || !confirmPassword) {
      setErrorMessage('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }
    
    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين');
      return;
    }
    
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }
    
    // محاولة إنشاء الحساب
    const result = await registerUser({ username, password });
    
    if (result.error) {
      setErrorMessage(result.error);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">إنشاء حساب</h2>
        
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={username}
                onChange={onChange}
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={onChange}
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={onChange}
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block mb-3">
            إنشاء حساب
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="auth-link">
              اضغط هنا لتسجيل الدخول
            </Link>
          </p>
          <p>
            <Link to="/" className="auth-link">
              العودة للصفحة الرئيسية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;