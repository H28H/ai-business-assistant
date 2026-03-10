// Message.jsx
// Renders a single chat message bubble — user or assistant

export default function Message({ role, content, isLoading }) {
  const isUser = role === 'user'

  if (isLoading) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/20
          flex items-center justify-center text-[10px] font-bold text-blue-400 flex-shrink-0 mt-0.5">
          AI
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm
          px-4 py-3">
          <div className="flex gap-1 items-center h-5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/25 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center
        text-[10px] font-bold flex-shrink-0 mt-0.5 ${
        isUser
          ? 'bg-white/[0.08] border border-white/[0.08] text-white/50'
          : 'bg-blue-500/20 border border-blue-500/20 text-blue-400'
      }`}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white rounded-tr-sm'
          : 'bg-white/[0.04] border border-white/[0.06] text-white/85 rounded-tl-sm'
      }`}>
        {formatContent(content)}
      </div>
    </div>
  )
}

function formatContent(text) {
  // Split by double newline for paragraphs
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, i) => {
    // Handle bullet points
    if (para.includes('\n- ') || para.startsWith('- ')) {
      const lines = para.split('\n')
      return (
        <div key={i} className="space-y-1">
          {lines.map((line, j) => (
            line.startsWith('- ')
              ? <div key={j} className="flex gap-2">
                  <span className="text-blue-400 mt-0.5">·</span>
                  <span>{formatInline(line.slice(2))}</span>
                </div>
              : line && <p key={j}>{formatInline(line)}</p>
          ))}
        </div>
      )
    }
    return <p key={i} className={i > 0 ? 'mt-2' : ''}>{formatInline(para)}</p>
  })
}

function formatInline(text) {
  // Bold text **like this**
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
      : part
  )
}