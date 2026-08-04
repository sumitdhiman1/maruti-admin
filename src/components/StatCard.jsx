import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass = '' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-number">{value}</div>
      </div>
      <div className={`stat-icon ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
