import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'ai-chat-sessions-v1';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getDefaultSession() {
  return {
    id: generateId(),
    title: '新会话',
    messages: [],
    createdAt: Date.now()
  };
}

export const useChat = () => {
  const [sessions, setSessions] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch {}
    }
    return [getDefaultSession()];
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr[0].id;
      } catch {}
    }
    return '';
  });
  const [isGenerating, setIsGenerating] = useState(false);

  
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  
  const createSession = useCallback(() => {
    const newSession = getDefaultSession();
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  
  const switchSession = useCallback((id) => {
    setCurrentSessionId(id);
  }, []);

  
  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      // 如果删除的是当前会话，切换到下一个或新建
      if (id === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          const newSession = getDefaultSession();
          setCurrentSessionId(newSession.id);
          return [newSession];
        }
      }
      return filtered;
    });
  }, [currentSessionId]);

  const clearMessages = useCallback(() => {
    setSessions(prev => prev.map(s =>
      s.id === currentSessionId ? { ...s, messages: [] } : s
    ));
  }, [currentSessionId]);

  
  const generateMessageId = generateId;

  
  const addMessage = useCallback((role, content, status = 'sent', image = null, targetSessionId = null) => {
    let msgContent = content;
    let msgImage = image;
    let msgType = null;
    let msgName = null;
    let msgSize = null;
    
    
    if (typeof content === 'object') {
      if (content.type === 'image' && content.content) {
        msgContent = '';
        msgImage = content.content;
        msgType = 'image';
      } else if (content.type === 'file' && content.content) {
        
        msgContent = content.content;
        msgType = 'file';
        msgName = content.name;
        msgSize = content.size;
      } else {
        msgContent = content.text || '';
        msgImage = content.image || image;
      }
    }
    
    const message = {
      id: generateMessageId(),
      role,
      content: msgContent,
      image: msgImage,
      type: msgType,
      name: msgName,
      size: msgSize,
      timestamp: new Date(),
      status
    };
    
    const sessionId = targetSessionId || currentSessionId;
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, messages: [...s.messages, message] } : s
    ));
    return message;
  }, [currentSessionId]);

  
  const sendMessage = useCallback(async (content, arg2 = null) => {
    let targetSessionId = null;
    let contextLimit = 'all';

    if (typeof arg2 === 'string') {
      targetSessionId = arg2;
    } else if (typeof arg2 === 'object' && arg2 !== null) {
      targetSessionId = arg2.sessionId;
      contextLimit = arg2.contextLimit || 'all';
    }

    if ((typeof content === 'string' && !content.trim()) || 
        (typeof content === 'object' && !content.text && !content.image && !content.content)) return;
    
    addMessage('user', content, 'sent', null, targetSessionId);
    setIsGenerating(true);
    const aiMessage = addMessage('assistant', '', 'loading', null, targetSessionId);
    aiMessage.userContent = content;
    
    
    console.log(`[Chat] Sending message with context limit: ${contextLimit}`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await simulateStreamingResponse(aiMessage, content, targetSessionId);
    } catch (e) {
      const sid = targetSessionId || currentSessionId;
      setSessions(prev => prev.map(s =>
        s.id === sid
          ? { ...s, messages: s.messages.map(msg =>
              msg.id === aiMessage.id
                ? { ...msg, status: 'error', content: 'AI回复失败，请重试。', error: e?.message || '' }
                : msg
            ) }
          : s
      ));
    } finally {
      setIsGenerating(false);
    }
  }, [addMessage, currentSessionId]);

  
  const simulateStreamingResponse = useCallback(async (aiMessage, userContent, targetSessionId = null) => {
    const sessionId = targetSessionId || currentSessionId;

    
    if (userContent === '名片') {
      const cardData = {
        type: 'card',
        content: {
          cardType: 'profile',
          title: 'ASSISTANT',
          description: '这是一个名片简介示例。',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgLz4KICA8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzIiAvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMiIC8+CiAgPHBhdGggZD0iTTM1IDY1IHEgMTUgMTUgMzAgMCIgLz4KPC9zdmc+',
          extra: {
            jobTitle: '高级虚拟工程师',
            tags: [ 'React', 'Node.js']
          }
        }
      };
      
      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: s.messages.map(msg =>
              msg.id === aiMessage.id ? { ...msg, ...cardData, status: 'sent' } : msg
            ) }
          : s
      ));
      return;
    }

    
    if (userContent === '文章') {
      const cardData = {
        type: 'card',
        content: {
          cardType: 'article',
          title: 'React 19 新特性预览',
          description: 'React 19 带来了全新的编译器 React Compiler，以及对 Server Components 的进一步增强。本文将带您深入了解这些激动人心的新变化。',
          image: 'https://react.dev/images/og-home.png',
          url: 'https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024',
          extra: {
            source: 'React Blog'
          }
        }
      };
      
      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: s.messages.map(msg =>
              msg.id === aiMessage.id ? { ...msg, ...cardData, status: 'sent' } : msg
            ) }
          : s
      ));
      return;
    }

    const responses = {
      '你好': "你好！我是ASSISTANT，很高兴为您服务。\n\n我可以帮您：\n- 回答问题\n- 提供信息\n- 生成代码示例\n\n有什么我可以帮您的吗？",
      '代码': "这是一个JavaScript代码示例：\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// 使用示例\nconsole.log(fibonacci(10)); // 输出 55\n```\n\n这段代码计算斐波那契数列的第n项。"
    };
    let response = responses[userContent] || `我理解您说的是：${userContent}\n\n这是一个**流式响应**示例，文字会逐个显示出来。\n\n\`\`\`python\nprint('Hello, World!')\n\`\`\`\n\n您可以通过输入'代码'、'名片'或'文章'来查看不同类型的消息示例。`;
    let displayedText = '';
    setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: s.messages.map(msg =>
              msg.id === aiMessage.id ? { ...msg, status: 'sent' } : msg
            ) }
          : s
      ));
    for (let i = 0; i < response.length; i++) {
      displayedText += response[i];
      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: s.messages.map(msg =>
              msg.id === aiMessage.id ? { ...msg, content: displayedText } : msg
            ) }
          : s
      ));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }, [currentSessionId]);

  return {
    messages,
    sendMessage,
    isGenerating,
    clearMessages,
    sessions,
    currentSessionId,
    createSession,
    switchSession,
    deleteSession
  };
}
