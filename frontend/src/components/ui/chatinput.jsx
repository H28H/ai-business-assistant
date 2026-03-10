// ChatInput.jsx
// The message input bar at the bottom of the chat

import { useRef, useEffect } from 'react'

export default function ChatInput({ onSend, disabled, activeTool, onCancelTool }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const value = textareaRef.current?.value.trim()
    if (!value || disabled) return
    onSend(value)
    textareaRef.current.value = ''
    textareaRef.current.style.height = 'auto'
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }

  const toolLabels = {
    email: '✉  Email Generator — describe the email you need',
    research: '⌖  Company Research — enter a company name',
  }

  return (
    <div className="px-6 pb-6 pt-3">

      {/* Tool indicator */}
      {activeTool && toolLabels[activeTool] && (
        <div className="flex items-center justify-between mb-2 px-4 py-2
          rounded-lg border border-blue-500/20 bg-blue-500/[0.07]">
          <span className="text-xs text-blue-400 font-medium">
            {toolLabels[activeTool]}
          </span>
          <button
            onClick={onCancelTool}
            className="text-white/30 hover:text-white/60 text-xs ml-3 transition-colors"
          >
            ✕ cancel
          </button>
        </div>
      )}

      {/* Input box */}
      <div className="flex gap-3 items-end p-3 rounded-2xl border border-white/[0.08]
        bg-white/[0.03] focus-within:border-blue-500/40 focus-within:bg-white/[0.04]
        transition-all duration-200">

        <textarea
          ref={textareaRef}
          rows={1}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            activeTool === 'email' ? 'Describe the email you need...'
            : activeTool === 'research' ? 'Enter a company name...'
            : 'Ask anything...'
          }
          className="flex-1 bg-transparent resize-none outline-none text-sm
            text-white/85 placeholder-white/20 leading-relaxed py-1
            disabled:opacity-50 font-sans"
          style={{ maxHeight: '180px' }}
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500
            disabled:bg-white/[0.06] disabled:cursor-not-allowed
            flex items-center justify-center transition-all duration-150
            active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" className="text-white -translate-y-px translate-x-px">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <p className="text-center text-[11px] text-white/15 mt-2.5 font-mono">
        AI responses may be inaccurate — verify critical information
      </p>
    </div>
  )
}