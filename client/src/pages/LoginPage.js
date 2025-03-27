import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user, loginUser, error, setError } = useContext(UserContext);
  const navigate = useNavigate();
  
  const { username, password } = formData;
  
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
    if (!username || !password) {
      setErrorMessage('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    // محاولة تسجيل الدخول
    const result = await loginUser({ username, password });
    
    if (result.error) {
      setErrorMessage(result.error);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">تسجيل الدخول</h2>
        
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
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block mb-3">
            تسجيل الدخول
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            ليس لديك حساب؟{' '}
            <Link to="/register" className="auth-link">
              اضغط هنا لإنشاء حساب
            </Link>
          </p>
          <p>
            <Link to="/" className="auth-link">
              العودة للصفحة الرئيسية
            </Link>
          </p>
          <p>
            <Link to="/guest" className="auth-link">
              الدخول كضيف
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;