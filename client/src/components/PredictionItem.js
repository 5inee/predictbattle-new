import React from 'react';
import './PredictionItem.css';

const PredictionItem = ({ prediction, isCurrentUser }) => {
  // تنسيق التاريخ والوقت
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  // توليد حرف أولي للمستخدم
  const getInitial = (username) => {
    return username.charAt(0).toUpperCase();
  };

  // توليد لون للصورة الرمزية باستخدام خوارزمية HSL للحصول على ألوان متباينة
  // HSL يتيح التحكم في تشبع ولمعان الألوان بينما نختلف في درجة اللون فقط
  const getAvatarColor = (username) => {
    // استخدام اسم المستخدم لتوليد قيمة فريدة
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // توليد زاوية اللون (Hue) من 0 إلى 360 بناءً على الهاش
    // نضرب بـ 137.508 (زاوية ذهبية) للحصول على توزيع جيد للألوان
    const hue = Math.floor((Math.abs(hash) * 137.508) % 360);
    
    // استخدام تشبع ولمعان ثابتين للحصول على ألوان مشرقة ومريحة للعين
    const saturation = 75;  // 75% تشبع
    const lightness = 60;   // 60% لمعان
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className={`prediction-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="prediction-header">
        <div className="user-info">
          <div 
            className="avatar" 
            style={{ backgroundColor: getAvatarColor(prediction.user.username) }}
          >
            {getInitial(prediction.user.username)}
          </div>
          <div className="user-details">
            <div className="username">
              {prediction.user.username}
              {isCurrentUser && <span className="user-badge">أنت</span>}
            </div>
            <div className="prediction-time">{formatDateTime(prediction.createdAt)}</div>
          </div>
        </div>
      </div>
      
      <div className="prediction-content">
        <p>{prediction.text}</p>
      </div>
    </div>
  );
};

export default PredictionItem;