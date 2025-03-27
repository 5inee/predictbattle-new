import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AuthPages.css';

const GuestLoginPage = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user, guestLogin, error, setError } = useContext(UserContext);
  const navigate = useNavigate();
  
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
    setUsername(e.target.value);
    setErrorMessage('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال اسم المستخدم
    if (!username) {
      setErrorMessage('يرجى إدخال اسم المستخدم');
      return;
    }
    
    // محاولة تسجيل الدخول كضيف
    const result = await guestLogin(username);
    
    if (result.error) {
      setErrorMessage(result.error);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">الدخول كضيف</h2>
        
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">الاسم</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={onChange}
                placeholder="أدخل اسمك"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block mb-3">
            الدخول كضيف
          </button>
        </form>
        
        <div className="auth-links">
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

export default GuestLoginPage;