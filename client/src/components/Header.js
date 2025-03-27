import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">PredictBattle</span>
          </Link>
        </div>
        
        <nav className="nav">
          {user ? (
            <>
              <span className="username">مرحباً، {user.username}</span>
              <Link to="/dashboard" className="nav-link">
                لوحة التحكم
              </Link>
              <button onClick={handleLogout} className="btn btn-text">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="nav-link">
                إنشاء حساب
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;