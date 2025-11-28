export const renderMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code><button class="copy-code-btn">复制</button></pre>`
    })
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br>')
}

export const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const parseCardMessage = (text) => {
  if (!text.startsWith('[card]')) return null
  
  const parts = text.replace('[card]', '').split('|')
  return {
    title: parts[0] || '卡片标题',
    description: parts[1] || '卡片描述',
    action: parts[2] || 'default'
  }
}

export const renderCard = (cardData) => {
  return `
    <div class="message-card">
      <div class="card-title">${cardData.title}</div>
      <div class="card-description">${cardData.description}</div>
    </div>
  `
}
