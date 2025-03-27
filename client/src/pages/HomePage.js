import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // إذا كان المستخدم مسجلاً، توجيهه إلى لوحة التحكم
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="welcome-card">
          <div className="welcome-header">
            <h1 className="welcome-title">مرحبًا بك في PredictBattle</h1>
            <p className="welcome-subtitle">منصة توقعات تفاعلية للمجموعات</p>
          </div>
          
          <div className="welcome-content">
            <p>
              شارك مع أصدقائك وزملائك في تحديات تتنبأ فيها بالمستقبل في مختلف المجالات.
              قم بإنشاء جلسات توقع، وادعو المشاركين، وقارن توقعاتكم.
            </p>
          </div>
          
          <div className="welcome-actions">
            <Link to="/login" className="btn btn-primary btn-block mb-2">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn btn-secondary btn-block mb-2">
              إنشاء حساب
            </Link>
            <Link to="/guest" className="btn btn-text btn-block">
              الدخول كضيف
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="section-title">ماذا يمكنك أن تفعل؟</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">إنشاء جلسات</h3>
            <p className="feature-description">
              أنشئ جلسات توقع حول أي موضوع تهتم به
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">دعوة الأصدقاء</h3>
            <p className="feature-description">
              شارك رمز الجلسة المكون من 6 أحرف لدعوة الآخرين
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔮</div>
            <h3 className="feature-title">قدم توقعاتك</h3>
            <p className="feature-description">
              أدخل توقعاتك في مختلف المواضيع والتحديات
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">قارن الآراء</h3>
            <p className="feature-description">
              اطلع على توقعات الآخرين وقارنها بتوقعاتك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;