// App.jsx
// Root component — wires everything together

import { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Sidebar from '@/components/Sidebar'
import Message from '@/components/Message'
import ChatInput from '@/components/ChatInput'

const WELCOME = {
  role: 'assistant',
  content: `Hello — I'm your AI Business Automation Assistant.\n\nI can help you with:\n- **PDF summarisation** — upload a document for instant insights\n- **CSV analysis** — upload data for automated business analysis\n- **Email generation** — describe what you need and I'll draft it\n- **Company research** — get a structured intelligence report on any company\n- **General business questions** — ask me anything\n\nHow can I help you today?`
}

export default function App() {
  const [messages, setMessages] = useState([WELCOME])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTool, setActiveTool] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }])
  }

  const handleSend = async (text) => {
    let processedText = text

    if (activeTool === 'email') {
      processedText = `Generate a professional business email: ${text}`
      setActiveTool(null)
    } else if (activeTool === 'research') {
      processedText = `Research this company and provide a detailed business intelligence report: ${text}`
      setActiveTool(null)
    }

    addMessage('user', text)
    const newHistory = [...history, { role: 'user', content: processedText }]
    setHistory(newHistory)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      })
      const data = await res.json()
      const reply = data.response

      addMessage('assistant', reply)
      setHistory(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      addMessage('assistant', `⚠ Connection error: ${err.message}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return

    addMessage('user', `Uploading ${file.name}...`)
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`/api/upload/${type}`, { method: 'POST', body: formData })
      const data = await res.json()
      const result = type === 'pdf' ? data.summary : data.analysis

      addMessage('assistant', result)
      setHistory(prev => [
        ...prev,
        { role: 'user', content: `I uploaded "${file.name}"` },
        { role: 'assistant', content: result }
      ])
    } catch (err) {
      addMessage('assistant', `⚠ Upload failed: ${err.message}`)
    } finally {
      setIsLoading(false)
      e.target.value = ''
    }
  }

  const handleNewChat = () => {
    setMessages([WELCOME])
    setHistory([])
    setActiveTool(null)
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

      {/* Subtle background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(221 83% 53%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(221 83% 53%) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <Sidebar
        onToolSelect={setActiveTool}
        onFileUpload={handleFileUpload}
        onNewChat={handleNewChat}
        activeTool={activeTool}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4
          border-b border-white/[0.06]">
          <div>
            <h1 className="text-sm font-semibold text-white/80">
              AI Business Automation Assistant
            </h1>
            <p className="text-[11px] text-white/25 font-mono mt-0.5">
              Powered by DeepSeek · Full conversation memory
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-white/25 font-mono">online</span>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && <Message role="assistant" isLoading />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            activeTool={activeTool}
            onCancelTool={() => setActiveTool(null)}
          />
        </div>
      </div>
    </div>
  )
}