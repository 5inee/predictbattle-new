import React from 'react';
import { Link } from 'react-router-dom';
import './SessionCard.css';

const SessionCard = ({ session }) => {
  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  return (
    <div className="session-card">
      <div className="session-header">
        <h3 className="session-title">{session.title}</h3>
        <span className={`session-status ${session.isComplete ? 'complete' : 'active'}`}>
          {session.isComplete ? 'مكتملة' : 'نشطة'}
        </span>
      </div>
      
      <div className="session-details">
        <p className="session-info">
          <span className="info-label">كود الجلسة:</span> 
          <span className="session-code">{session.code}</span>
        </p>
        <p className="session-info">
          <span className="info-label">تاريخ الإنشاء:</span> 
          {formatDate(session.createdAt)}
        </p>
        <p className="session-info">
          <span className="info-label">المشاركون:</span> 
          {session.participants?.length || 0}/{session.maxPlayers}
        </p>
      </div>
      
      <div className="session-footer">
        <Link to={`/session/${session._id}`} className="btn btn-primary">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default SessionCard;