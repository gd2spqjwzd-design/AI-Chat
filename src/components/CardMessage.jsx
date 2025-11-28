import React from 'react';

const CardMessage = ({ data }) => {
  const { cardType, title, description, image, url, extra } = data;

  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (cardType === 'profile') {
    return (
      <div className="message-card profile-card" onClick={handleCardClick}>
        <div className="profile-header">
          {image && <img src={image} alt={title} className="profile-avatar" />}
          <div className="profile-info">
            <div className="profile-name">{title}</div>
            <div className="profile-title">{extra?.jobTitle}</div>
          </div>
        </div>
        <div className="profile-description">{description}</div>
        {extra?.tags && (
          <div className="profile-tags">
            {extra.tags.map((tag, index) => (
              <span key={index} className="profile-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (cardType === 'article') {
    return (
      <div className="message-card article-card" onClick={handleCardClick}>
        {image && <div className="article-cover" style={{ backgroundImage: `url(${image})` }}></div>}
        <div className="article-content">
          <div className="article-title">{title}</div>
          <div className="article-summary">{description}</div>
          <div className="article-footer">
            <span className="article-source">{extra?.source || '阅读更多'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }
rd
  return (
    <div className="message-card generic-card" onClick={handleCardClick}>
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-title">{title}</div>
      <div className="card-description">{description}</div>
    </div>
  );
};

export default CardMessage;
