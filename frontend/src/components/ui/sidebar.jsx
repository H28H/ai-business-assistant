// Sidebar.jsx
// Left panel containing the logo, tool buttons, and new chat button

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const tools = [
  { id: 'email', icon: '✉', label: 'Email Generator', desc: 'Draft professional emails' },
  { id: 'research', icon: '⌖', label: 'Company Research', desc: 'Business intelligence' },
  { id: 'pdf', icon: '↑', label: 'Upload PDF', desc: 'Summarise documents', isUpload: true },
  { id: 'csv', icon: '⊞', label: 'Upload CSV', desc: 'Analyse data', isUpload: true },
]

export default function Sidebar({ onToolSelect, onFileUpload, onNewChat, activeTool }) {
  return (
    <aside className="w-64 flex flex-col border-r border-white/[0.06] bg-black/20 backdrop-blur-sm">

      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 leading-none">Business Assistant</p>
            <p className="text-[10px] text-white/30 mt-0.5 font-mono">v1.0 · DeepSeek</p>
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Tools */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 mb-3 text-[10px] font-semibold tracking-widest text-white/25 uppercase">
          Tools
        </p>

        {tools.map(tool => (
          tool.isUpload ? (
            <label key={tool.id} className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
              text-white/50 hover:text-white/80 hover:bg-white/[0.05]
              transition-all duration-150 group
            `}>
              <span className="text-base w-4 text-center text-white/30 group-hover:text-blue-400 transition-colors">
                {tool.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{tool.label}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{tool.desc}</p>
              </div>
              <input
                type="file"
                accept={tool.id === 'pdf' ? '.pdf' : '.csv'}
                className="hidden"
                onChange={(e) => onFileUpload(e, tool.id)}
              />
            </label>
          ) : (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-150 group text-left
                ${activeTool === tool.id
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                }
              `}
            >
              <span className={`text-base w-4 text-center transition-colors ${
                activeTool === tool.id ? 'text-blue-400' : 'text-white/30 group-hover:text-blue-400'
              }`}>
                {tool.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{tool.label}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{tool.desc}</p>
              </div>
              {activeTool === tool.id && (
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px] px-1.5 py-0">
                  Active
                </Badge>
              )}
            </button>
          )
        ))}
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full py-2.5 px-4 rounded-lg border border-white/[0.08]
            text-white/50 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.03]
            text-sm font-medium transition-all duration-150"
        >
          + New Chat
        </button>
      </div>
    </aside>
  )
}