import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import { isImageMessage, formatSize } from '../utils/fileUtils.jsx';
import CardMessage from './CardMessage'
import { parseCardMessage, renderCard } from '../utils/markdown'

const MessageBubble = ({ message, onRetry }) => {
  const { role, content, status, timestamp, id, error, image, type } = message

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )
    }
    if (status === 'error') {
      return (
        <div className="message-text" style={{ color: 'red', fontWeight: 600 }}>
          {error || content || 'AI回复失败'}
          <button style={{ marginLeft: 8 }} onClick={() => onRetry && onRetry(message)}>
            重试
          </button>
        </div>
      )
    }

    if (type === 'card' && typeof content === 'object') {
      return <CardMessage data={content} />
    }

    const cardData = parseCardMessage(content)
    if (cardData) {
      return (
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: renderCard(cardData) }}
        />
      )
    }

    if (isImageMessage({ type, image })) {
      return (
        <div className="message-text">
          <div className="message-image-wrapper"><img src={image || content} alt="图片消息" className="message-image" /></div>
          {content && content !== image && <MarkdownRenderer content={content} />}
        </div>
      );
    }
    const renderFileDisplay = () => {
      const isUserRole = role === 'user';
      const bgColor = isUserRole ? 'rgba(255, 255, 255, 0.2)' : 'rgba(240, 240, 240, 0.7)';
      const iconBgColor = isUserRole ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)';
      const textColor = isUserRole ? '#fff' : '#333';
      const iconStrokeColor = isUserRole ? 'rgba(255, 255, 255, 0.8)' : '#666';
      
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: bgColor, 
          borderRadius: '8px', 
          padding: '8px 12px', 
          marginTop: content && type !== 'file' ? '8px' : '0',
          gap: '12px'
        }}>
          {content.startsWith('data:image') ? (
            <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
              <img 
                src={content} 
                alt={message.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: iconBgColor, 
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke={iconStrokeColor} strokeWidth="1.4" fill="none"/>
                <path d="M10 6v4M10 11l-2-2m2 2l2-2" stroke={iconStrokeColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: textColor, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <a 
                href={content} 
                download={message.name} 
                style={{ 
                  color: textColor, 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {message.name}
              </a>
            </div>
            {message.size && (
              <div style={{ fontSize: '12px', color: isUserRole ? 'rgba(255, 255, 255, 0.8)' : '#666', marginTop: '2px' }}>
                {formatSize(message.size)}
              </div>
            )}
          </div>
        </div>
      );
    };

    const hasFile = type === 'file' || (message.name && message.size !== undefined);
    const isUserRole = role === 'user';
    
    if (isUserRole) {
      return (
        <div className="message-text">
          {content && type !== 'file' && <MarkdownRenderer content={content} />}
          {hasFile && message.name && renderFileDisplay()}
        </div>
      );
    }
    
    // Assistant 消息
    return (
      <div className="message-text" style={{ position: 'relative', paddingBottom: status === 'sent' && !hasFile ? '32px' : undefined }}>
        {content && type !== 'file' && <MarkdownRenderer content={content} />}
        {hasFile && message.name && renderFileDisplay()}
        
        {status === 'sent' && !hasFile && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <button onClick={() => navigator.clipboard.writeText(content)} title="复制内容" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="12" rx="2" stroke="#555" strokeWidth="1.5"/><rect x="8" y="3" width="7" height="12" rx="2" fill="#fff" stroke="#555" strokeWidth="1.5"/></svg>
            </button>
            {onRetry && <button onClick={() => onRetry(message)} title="重新生成" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v2.5M10 14.5V17M5.5 10H3M17 10h-2.5M6.36 6.36l-1.77-1.77M15.41 15.41l-1.77-1.77M6.36 13.64l-1.77 1.77M15.41 4.59l-1.77 1.77" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>}
          </div>
        )}
      </div>
    );
    return null
  }

  const roleName = role === 'user' ? 'You' : 'Assistant'

  return (
    <div className={`message-bubble ${role}`}>
      <div className={`message-avatar ${role}-avatar`}></div>
      <div className="message-content">
        <div className="message-role">{roleName}</div>
        <div className={`bubble-inner ${role}`}>{renderContent()}</div>
        <div className="message-time">
          {(() => {
            if (!timestamp) return '';
            if (typeof timestamp === 'string' || typeof timestamp === 'number') {
              const dateObj = new Date(timestamp);
              if (!isNaN(dateObj.getTime())) return dateObj.toLocaleTimeString();
              return '';
            }
            if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
              return timestamp.toLocaleTimeString();
            }
            return '';
          })()}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble