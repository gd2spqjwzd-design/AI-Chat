import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const MarkdownRenderer = ({ content, className = '' }) => {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      const [hovered, setHovered] = React.useState(false);
      return (
        <div className="code-block-wrapper" style={{position:'relative'}} 
          onMouseEnter={() => setHovered(true)} 
          onMouseLeave={() => setHovered(false)}>
          {language && !hovered && (
            <div className="code-language-tag" style={{position:'absolute',right:'16px',top:'8px',left:'auto',textAlign:'right',zIndex:2}}>
              {language}
            </div>
          )}
          <pre className="code-block" style={{paddingTop:language? '2.5em':'1em'}}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
          {hovered && (
            <button 
              className="copy-code-btn"
              style={{zIndex:3}}
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
              }}
            >
              copy
            </button>
          )}
        </div>
      )
    },

    table({ children }) {
      return (
        <div className="table-container">
          <table className="markdown-table">
            {children}
          </table>
        </div>
      )
    },

    blockquote({ children }) {
      return (
        <blockquote className="markdown-blockquote">
          {children}
        </blockquote>
      )
    },

    a({ href, children }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
          {children}
        </a>
      )
    },

    img({ src, alt }) {
      return (
        <img 
          src={src} 
          alt={alt} 
          className="markdown-image"
          loading="lazy"
        />
      )
    }
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
