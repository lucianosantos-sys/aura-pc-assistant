import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Clock, 
  Settings, 
  Camera, 
  Sparkles, 
  Monitor,
  ShieldAlert,
  Bot
} from 'lucide-react';

export default function Header({ 
  metrics, 
  currentProvider, 
  setCurrentProvider, 
  currentModel,
  setCurrentModel,
  onOpenKeysModal,
  onCaptureScreenshot,
  keysStatus 
}) {
  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 animate-pulse-glow">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AURA PC
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-full">
                v2.5 DESKTOP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Controle de Desktop & Central de Suporte Multi-IA
            </p>
          </div>
        </div>

        {/* Live System Telemetry Metrics */}
        {metrics && (
          <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-slate-800 text-xs">
            <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">CPU:</span>
              <span className="font-mono font-semibold text-cyan-300">{metrics.cpuUsage}%</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">RAM:</span>
              <span className="font-mono font-semibold text-indigo-300">
                {metrics.ramUsedGB}GB / {metrics.ramTotalGB}GB ({metrics.ramPercent}%)
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">Disco C:</span>
              <span className="font-mono font-semibold text-purple-300">{metrics.diskFreeGB}GB livre</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Uptime:</span>
              <span className="font-mono text-slate-300">{metrics.uptime}</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Model & Controls Header Bar */}
      <div className="flex items-center gap-3">
        {/* Quick Screenshot Button */}
        <button
          onClick={onCaptureScreenshot}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all hover:border-cyan-500/50"
          title="Capturar Tela Atual do Windows"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Print Tela</span>
        </button>

        {/* AI Provider Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <Bot className="w-3.5 h-3.5 text-indigo-400 ml-1" />
          <select
            value={currentProvider}
            onChange={(e) => setCurrentProvider(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-0.5 px-1"
          >
            <option value="gemini" className="bg-slate-900 text-slate-200">Google Gemini</option>
            <option value="openai" className="bg-slate-900 text-slate-200">OpenAI GPT-4o</option>
            <option value="claude" className="bg-slate-900 text-slate-200">Anthropic Claude</option>
            <option value="ollama" className="bg-slate-900 text-slate-200">Ollama (Offline Local)</option>
          </select>
        </div>

        {/* API Settings Trigger Button */}
        <button
          onClick={onOpenKeysModal}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
            keysStatus?.gemini || keysStatus?.openai
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-400 hover:bg-amber-900/50'
          }`}
          title="Configurações de Chaves de API das IAs"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px] font-semibold">
            {keysStatus?.gemini || keysStatus?.openai ? 'APIs Conectadas' : 'Configurar Chaves'}
          </span>
        </button>
      </div>
    </header>
  );
}
