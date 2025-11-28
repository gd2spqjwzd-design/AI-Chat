import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';

function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const timeNum = hour * 3600 + minute * 60 + second;
  if (timeNum >= 64860 || timeNum <= 21599) {
    return '晚上好';
  } else if (timeNum >= 21600 && timeNum <= 43199) {
    return '上午好';
  } else {
    return '下午好';
  }
}

const ChatApp = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mainInputValue, setMainInputValue] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewFile({
          name: file.name,
          size: file.size,
          content: ev.target.result,
          isImage: file.type.startsWith('image/')
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewFile({
          name: file.name,
          size: file.size,
          content: ev.target.result,
          isImage: file.type.startsWith('image/')
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const chatHook = useChat();
  const { messages, sendMessage, isGenerating, clearMessages, sessions, currentSessionId, createSession, switchSession, deleteSession } = chatHook;
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchDialogue = () => {
    setSearchDialogOpen(true);
    setSearchKeyword('');
    setSearchResults([]);
  };
  const handleSearchInput = (e) => {
    setSearchKeyword(e.target.value);
    if (e.target.value.trim()) {
      const keyword = e.target.value.trim().toLowerCase();
      const results = messages.filter(m => m.content && m.content.toLowerCase().includes(keyword));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  const closeSearchDialog = () => {
    setSearchDialogOpen(false);
    setSearchKeyword('');
    setSearchResults([]);
  };

  useEffect(() => {
    if (!isChatMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatMode]);

  const handleMainSend = () => {
    if (mainInputValue.trim() || previewFile) {
      let sessionId = currentSessionId;
      if (createSession) {
        sessionId = createSession();
      }
      if (mainInputValue.trim()) {
        sendMessage(mainInputValue.trim(), sessionId);
      }
      if (previewFile) {
        sendMessage({
          type: 'file',
          name: previewFile.name,
          size: previewFile.size,
          content: previewFile.content
        }, sessionId);
        setPreviewFile(null);
      }
      setIsChatMode(true);
      setMainInputValue('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }
  };

  const handleMainKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMainSend();
    }
  };

  const handleBackToHome = () => {
    setIsChatMode(false);
  };

  // 聊天模式
  if (isChatMode) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Sidebar 
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
            onBackToHome={handleBackToHome}
            showBackButton={true}
            onAddDialogue={() => {
              if (createSession) createSession();
              setIsChatMode(true);
            }}
            onSearchDialogue={handleSearchDialogue}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSwitchSession={(sessionId) => {
              console.log('切换会话:', sessionId);
              if (switchSession && typeof switchSession === 'function' && sessionId) {
                try {
                  switchSession(sessionId);
                  setIsChatMode(true); // 确保切换到聊天模式
                } catch (error) {
                  console.error('切换会话失败:', error);
                }
              }
            }}
            onDeleteSession={deleteSession}
          />
          <ChatInterface 
            messages={messages}
            onSendMessage={sendMessage}
            isGenerating={isGenerating}
            onBackToHome={handleBackToHome}
          />
          {searchDialogOpen && (
            <div className="search-dialogue-modal">
              <div className="search-dialogue-content">
                <div className="search-dialogue-header">
                  <span>查找对话</span>
                  <button className="search-dialogue-close" onClick={closeSearchDialog}>×</button>
                </div>
                <input
                  className="search-dialogue-input"
                  type="text"
                  placeholder="输入关键词..."
                  value={searchKeyword}
                  onChange={handleSearchInput}
                  autoFocus
                />
              {previewFile && (
                <div className="pending-file-preview" style={{ marginTop: '10px', marginRight: '60px' }}>
                  {previewFile.isImage ? (
                    <img 
                      src={previewFile.content} 
                      alt={previewFile.name} 
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '4px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="pending-file-info" style={{ marginLeft: '10px', flex: 1 }}>
                    <div className="pending-file-name" style={{ fontSize: '14px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {previewFile.name}
                    </div>
                    <div className="pending-file-size" style={{ fontSize: '12px', color: '#666' }}>
                      {Math.round(previewFile.size / 1024)}KB
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewFile(null)}
                    style={{ padding: '4px 8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    移除
                  </button>
                </div>
              )}
                <div className="search-dialogue-results">
                  {searchResults.length === 0 && searchKeyword && <div className="search-dialogue-empty">无匹配内容</div>}
                  {searchResults.map(msg => (
                    <div key={msg.id} className="search-dialogue-item">
                      <span className="search-dialogue-role">{msg.role === 'user' ? 'YOU' : 'ASSISTANT'}：</span>
                      <span className="search-dialogue-content-text">{msg.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 主页模式
  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar 
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
            onBackToHome={handleBackToHome}
            showBackButton={false}
            onAddDialogue={() => {
              if (createSession) createSession();
              setIsChatMode(true);
            }}
            onSearchDialogue={handleSearchDialogue}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSwitchSession={(sessionId) => {
              console.log('切换会话:', sessionId);
              if (switchSession && typeof switchSession === 'function' && sessionId) {
                try {
                  switchSession(sessionId);
                  setIsChatMode(true); 
                } catch (error) {
                  console.error('切换会话失败:', error);
                }
              }
            }}
            onDeleteSession={deleteSession}
          />

        <div className="content-area">
          <section className="content-card">
            <div className="card-background"></div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '10px' 
            }} onDrop={handleDrop} onDragOver={handleDragOver}>
              <input 
                type="text" 
                className="card-input" 
                placeholder="Please Chat Here To Start!" 
                value={mainInputValue}
                onChange={(e) => setMainInputValue(e.target.value)}
                onKeyDown={handleMainKeyDown}
                ref={inputRef}
              />
              <button 
                className="card-icon" 
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="上传文件"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="14" y1="5" x2="14" y2="23" stroke="#222" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="5" y1="14" x2="23" y2="14" stroke="#222" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </button>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                className="send-button" 
                onClick={handleMainSend}
              >
                Sent
              </button>
            </div>
            
            {previewFile && (
              <div style={{
                position: 'absolute',
                top: '100px',
                left: '57px',
                right: '80px', 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                zIndex: 20
              }}>
                {previewFile.isImage ? (
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <img 
                      src={previewFile.content} 
                      alt={previewFile.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#f0f0f0', 
                    borderRadius: '4px',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className="pending-file-info" style={{ marginLeft: '10px', flex: 1, overflow: 'hidden' }}>
                  <div className="pending-file-name" style={{ 
                    fontSize: '13px', 
                    color: '#333', 
                    fontWeight: 500,
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {previewFile.name}
                  </div>
                  <div className="pending-file-size" style={{ fontSize: '11px', color: '#888' }}>
                    {(previewFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewFile(null)}
                  style={{ 
                    padding: '4px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="移除"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </section>

          <h1 className="main-heading">
            {getGreeting()}<br/>
            <span>今天从哪里开始呢</span>
          </h1>

          <div className="user-actions">
            <div className="user-avatar"></div>
            <div className="login-button">
              <div className="login-background"></div>
              <span className="login-text">Log in</span>
            </div>
            <span className="signup-text">Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;