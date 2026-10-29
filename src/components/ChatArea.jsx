import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Camera, 
  Sparkles, 
  Terminal, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Volume2, 
  Play, 
  Lock, 
  RefreshCw,
  Zap,
  Globe,
  Monitor
} from 'lucide-react';
import { SUPPORT_AGENTS } from './SidebarAgents';

export default function ChatArea({ 
  messages, 
  onSendMessage, 
  isLoading, 
  activeAgentId, 
  onClearHistory,
  onQuickAction 
}) {
  const [input, setInput] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const activeAgent = SUPPORT_AGENTS.find(a => a.id === activeAgentId) || SUPPORT_AGENTS[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input, includeScreenshot);
    setInput('');
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/40 relative overflow-hidden">
      {/* Active Agent Banner */}
      <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${activeAgent.color} text-white shadow-md`}>
            <activeAgent.icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              {activeAgent.name} &mdash; <span className="text-cyan-400 font-normal">{activeAgent.title}</span>
            </h3>
            <p className="text-[11px] text-slate-400">{activeAgent.description}</p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-all text-xs flex items-center gap-1.5"
          title="Limpar Histórico de Mensagens"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Limpar</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4 select-none">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-2xl">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-bold text-slate-200">
                AURA PC Assistant Pronto
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Digite comandos em linguagem natural para controlar o Windows, abrir aplicativos, ajustar volume, capturar tela ou consultar as IAs de suporte integradas.
              </p>
            </div>

            {/* Quick Starter Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl text-left pt-2">
              <button
                onClick={() => onQuickAction('Abra o navegador Chrome')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>"Abra o navegador Chrome"</span>
              </button>

              <button
                onClick={() => onQuickAction('Tirar um print da tela e analisar')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-purple-400 shrink-0" />
                <span>"Tirar um print da tela e analisar"</span>
              </button>

              <button
                onClick={() => onQuickAction('Aumentar o volume do som')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>"Aumentar o volume do som"</span>
              </button>

              <button
                onClick={() => onQuickAction('Criar um script de limpeza em PowerShell')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>"Criar script PowerShell"</span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1 select-none">
                <span className="font-semibold text-slate-400">
                  {msg.role === 'user' ? 'Você' : msg.agentName || 'AURA AI'}
                </span>
                <span>•</span>
                <span>{msg.timestamp || 'Agora'}</span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium rounded-br-none'
                    : 'glass-card text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Screenshot Attached Display */}
                {msg.screenshotUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-700/60 shadow-lg">
                    <img 
                      src={msg.screenshotUrl} 
                      alt="Captura de Tela" 
                      className="w-full object-cover max-h-60 hover:max-h-none transition-all cursor-zoom-in"
                    />
                    <div className="p-1.5 bg-slate-950/80 text-[10px] text-slate-400 flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-cyan-400" />
                      <span>Captura de Tela do Desktop Anexada</span>
                    </div>
                  </div>
                )}

                {/* Desktop Action Result Tag */}
                {msg.actionResult && (
                  <div className={`mt-3 p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                    msg.actionResult.success
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  }`}>
                    {msg.actionResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-xs">
                        {msg.actionResult.message || (msg.actionResult.success ? 'Ação Executada' : 'Falha na Ação')}
                      </div>
                      {msg.actionResult.output && (
                        <pre className="mt-1 p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] text-slate-300 overflow-x-auto max-h-36">
                          {msg.actionResult.output}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {/* Copy Action Button */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-slate-400">{msg.provider || 'AURA Engine'}</span>
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 glass-card rounded-2xl max-w-sm border border-slate-800 select-none">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium animate-pulse">
              Processando comando e consultando suporte IA...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Macros Bar */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/30 flex items-center gap-2 overflow-x-auto select-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          Atalhos Rápidos:
        </span>

        <button
          onClick={() => onQuickAction('Abra o Chrome')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 shrink-0 transition-all hover:border-cyan-500/40"
        >
          🚀 Abrir Chrome
        </button>

        <button
          onClick={() => onQuickAction('Aumentar volume')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 shrink-0 transition-all hover:border-cyan-500/40"
        >
          🔊 Aumentar Volume
        </button>

        <button
          onClick={() => onQuickAction('Tirar um print da tela')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 shrink-0 transition-all hover:border-cyan-500/40"
        >
          📸 Tirar Print
        </button>

        <button
          onClick={() => onQuickAction('Limpar a lixeira')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 shrink-0 transition-all hover:border-cyan-500/40"
        >
          🧹 Limpar Lixeira
        </button>

        <button
          onClick={() => onQuickAction('Bloquear o PC')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 shrink-0 transition-all hover:border-cyan-500/40"
        >
          🔒 Bloquear PC
        </button>
      </div>

      {/* Main Input Form */}
      <div className="p-4 glass-panel border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Screenshot Toggle */}
          <button
            type="button"
            onClick={() => setIncludeScreenshot(!includeScreenshot)}
            className={`p-3 rounded-xl border transition-all ${
              includeScreenshot
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title={includeScreenshot ? 'Inspecionar tela ativado' : 'Anexar captura de tela ao comando'}
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Prompt Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Peça ao ${activeAgent.name} para abrir apps, ajustar volume, criar scripts ou tirar print...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 shrink-0"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
