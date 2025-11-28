import React, { useState } from 'react'

const Sidebar = ({
  expanded,
  onToggle,
  onBackToHome,
  showBackButton = false,
  onAddDialogue,
  onSearchDialogue,
  sessions = [],
  currentSessionId,
  onSwitchSession,
  onDeleteSession
}) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  const icons = {
    catalogue: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="20" height="3" rx="1.5" fill="#222"/>
        <rect x="4" y="13" width="20" height="3" rx="1.5" fill="#222"/>
        <rect x="4" y="20" width="20" height="3" rx="1.5" fill="#222"/>
      </svg>
    ),
    add: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#222" strokeWidth="3.5" fill="none"/>
        <line x1="14" y1="10" x2="14" y2="18" stroke="#222" strokeWidth="3" strokeLinecap="round"/>
        <line x1="10" y1="14" x2="18" y2="14" stroke="#222" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    search: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="13" r="7" stroke="#222" strokeWidth="3.5" fill="none"/>
        <line x1="19.071" y1="19.071" x2="25" y2="25" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    ),
    browser: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="20" height="14" rx="3" stroke="#222" strokeWidth="3.5" fill="none"/>
        <rect x="4" y="7" width="20" height="4" rx="2" fill="#222" opacity="0.15"/>
        <circle cx="8" cy="9" r="1.8" fill="#222"/>
        <circle cx="12" cy="9" r="1.8" fill="#222"/>
      </svg>
    ),
    back: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L10 14L18 22" stroke="#222" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  const menuItems = [
    {
      id: 'catalogue',
      icon: icons.catalogue,
      text: '打开边栏',
      onClick: onToggle
    },
    {
      id: 'add',
      icon: icons.add,
      text: '添加对话',
      onClick: onAddDialogue || (() => {})
    },
    {
      id: 'search',
      icon: icons.search,
      text: '查找对话',
      onClick: onSearchDialogue || (() => {})
    },
    ...(showBackButton ? [
      {
        id: 'back',
        icon: icons.back,
        text: '返回主页',
        onClick: onBackToHome
      }
    ] : [])
  ]

  const renderHistory = () => (
    <div className="sidebar-history-section">
      <div className="history-title">历史记录</div>
      <div className="history-list">
        {sessions.length === 0 && (
          <div className="empty-history">暂无历史记录</div>
        )}
        {sessions.map(s => {
          let firstUserMsg = '';
          if (Array.isArray(s.messages)) {
            const first = s.messages.find(m => m.role === 'user' && m.content);
            if (first) firstUserMsg = typeof first.content === 'string' ? first.content : (first.content?.text || '');
          }
          return (
            <div
              key={s.id}
              className={`history-item ${s.id === currentSessionId ? 'active' : ''}`}
              title={firstUserMsg || '新会话'}
              onClick={() => onSwitchSession && onSwitchSession(s.id)}
              onMouseEnter={() => setHoveredItem(s.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="history-item-text">{firstUserMsg || '新会话'}</span>
              {hoveredItem === s.id && (
                <button
                  className="history-delete-btn"
                  title="删除对话"
                  onClick={e => {
                    e.stopPropagation();
                    if (typeof onDeleteSession === 'function') onDeleteSession(s.id);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L12 12M12 4L4 12" stroke="#d00" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`sidebar ${expanded ? 'expanded' : ''}`}>
      <div className="sidebar-background"></div>
      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="menu-item"
            onClick={item.onClick}
            onMouseEnter={() => !expanded && setHoveredItem(item.id)}
            onMouseLeave={() => !expanded && setHoveredItem(null)}
            style={{ top: `${index * 105.84}px` }}
          >
            <div className={`menu-item-background ${expanded ? 'expanded-menu-item-background' : ''}`}></div>
            <div className="menu-item-icon">
              {item.icon}
            </div>
            <span className="menu-text">{item.text}</span>
            {!expanded && hoveredItem === item.id && (
              <div className="sidebar-tooltip">
                {item.text}
              </div>
            )}
          </div>
        ))}
        
        <div className="history-container">
          {renderHistory()}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar;