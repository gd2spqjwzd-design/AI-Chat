// src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { formatSize, getFileTypeIcon, isImage } from '../utils/fileUtils.jsx';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  isGenerating, 
  onBackToHome 
}) => {
  const [inputValue, setInputValue] = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const [contextLimit, setContextLimit] = useState('all')
  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPendingFile(file);
    }
    e.target.value = '';
  };

  const handleRemovePendingFile = () => setPendingFile(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    })
  }

  const isUserScrolledToBottom = () => {
    if (!messageListRef.current) return true;
    const messageContainer = messageListRef.current;
    return messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight < 40;
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'sent') {
      scrollToBottom();
    } else if (isUserScrolledToBottom()) {
      scrollToBottom();
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom();
  }, [messages.length])

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        if (document.body.contains(inputRef.current)) {
          inputRef.current.focus();
          const focusEvent = new Event('focus', { bubbles: true });
          inputRef.current.dispatchEvent(focusEvent);
        }
      }
    }, 100);
    
    return () => clearTimeout(focusTimer);
  }, [])

  const handleSend = () => {
    if (isGenerating) return;
    if (pendingFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fileMessage = {
          type: 'file',
          name: pendingFile.name,
          size: pendingFile.size,
          content: ev.target.result,
          text: inputValue.trim() || ''
        };
        onSendMessage(fileMessage, { contextLimit });
        setPendingFile(null);
        setInputValue('');
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      };
      reader.readAsDataURL(pendingFile);
    } else if (inputValue.trim()) {
      onSendMessage(inputValue.trim(), { contextLimit });
      setInputValue('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    const handleCopyClick = (e) => {
      if (e.target.classList.contains('copy-code-btn')) {
        const code = e.target.previousElementSibling.textContent
        navigator.clipboard.writeText(code).then(() => {
          const originalText = e.target.textContent
          e.target.textContent = '已复制!'
          setTimeout(() => {
            e.target.textContent = originalText
          }, 2000)
        })
      }
    }

    document.addEventListener('click', handleCopyClick)

    return () => {
      document.removeEventListener('click', handleCopyClick)
    }
  }, [])

  const handleRetry = (msg) => {
    if (msg && msg.role === 'assistant') {
      const idx = messages.findIndex(m => m.id === msg.id);
      let userContent = '';
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          userContent = messages[i].content;
          break;
        }
      }
      if (userContent) {
        onSendMessage(userContent);
      }
    }
  };

  return (
    <div className="content-area chat-mode">
      <div className="chat-header-main">
        <h1>Chat With AI</h1>
      </div>



      <div className="message-list-main" ref={messageListRef}>
        {messages.map((message, idx) => (
          <MessageBubble key={message.id} message={message} onRetry={handleRetry} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-add-image-tip-row" style={{marginLeft: '24px', marginBottom: 8}}>
        <span className="chat-add-image-tip-box" style={{cursor:'pointer', marginLeft: 0}} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          <span className="chat-add-icon" style={{display:'inline-flex',width:'20px',height:'20px',verticalAlign:'middle',marginRight:'6px',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="8" y1="3.5" x2="8" y2="12.5" stroke="#222" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="#222" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </span>
          添加文件
        </span>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <div className="context-selector" style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#666', height: '32px' }}>
          <span style={{ marginRight: '8px' }}>携带历史:</span>
          <select 
            value={contextLimit} 
            onChange={(e) => setContextLimit(e.target.value)}
            style={{
              height: '32px',
              border: '1px solid #d0d0d0',
              borderRadius: '16px',
              padding: '0 12px',
              fontSize: '14px',
              color: '#666',
              outline: 'none',
              backgroundColor: '#fafbfc',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="all">全部</option>
            <option value="10">最近10条</option>
            <option value="5">最近5条</option>
            <option value="0">无</option>
          </select>
        </div>
      </div>
      {pendingFile && (
        <div className="pending-file-preview">
          <div className="pending-file-icon">{getFileTypeIcon(pendingFile)}</div>
          <div className="pending-file-info">
            <div className="pending-file-name">{pendingFile.name}</div>
            <div className="pending-file-size">{formatSize(pendingFile.size)}</div>
          </div>
          <button className="pending-file-remove" onClick={handleRemovePendingFile} title="移除文件">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'block'}} xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
      <div className="chat-input-area-main">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Please Chat With Me!"
          disabled={isGenerating}
          rows={3}
          className="chat-input-main"
          ref={inputRef}
        />
        <button 
          className="send-message-btn-main"
          onClick={handleSend}
          disabled={!inputValue.trim() && !pendingFile || isGenerating}
          aria-label="发送消息"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatInterface