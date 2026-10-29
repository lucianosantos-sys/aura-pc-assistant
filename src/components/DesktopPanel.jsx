import React, { useState } from 'react';
import { 
  Monitor, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Lock, 
  Trash2, 
  Terminal, 
  XCircle, 
  Play, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DesktopPanel({ 
  screenshotUrl, 
  onRefreshScreenshot, 
  onLaunchApp, 
  onVolumeControl, 
  onLockSystem, 
  onCleanRecycle, 
  processes, 
  onRefreshProcesses, 
  onKillProcess, 
  onRunTerminal 
}) {
  const [terminalCmd, setTerminalCmd] = useState('');
  const [terminalOutput, setTerminalOutput] = useState(null);
  const [isExecutingCmd, setIsExecutingCmd] = useState(false);
  const [activeTab, setActiveTab] = useState('apps'); // 'apps', 'processes', 'terminal'

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!terminalCmd.trim()) return;
    setIsExecutingCmd(true);
    const res = await onRunTerminal(terminalCmd);
    setTerminalOutput(res);
    setIsExecutingCmd(false);
  };

  return (
    <aside className="w-80 glass-panel border-l border-slate-800 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
          <Monitor className="w-4 h-4 text-cyan-400" />
          Painel de Controle do PC
        </h3>
        <button
          onClick={onRefreshScreenshot}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs transition-all"
          title="Atualizar Captura de Tela"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Live Screen Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Visão em Tempo Real</span>
            <span className="text-[10px] text-emerald-400 font-mono">● Conectado</span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-md group">
            {screenshotUrl ? (
              <img 
                src={screenshotUrl} 
                alt="Desktop Preview" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
                <Monitor className="w-6 h-6 mb-1 text-slate-400 animate-pulse" />
                <span className="text-[10px]">Clique em atualizar para ver a tela</span>
              </div>
            )}
            <button
              onClick={onRefreshScreenshot}
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/90 text-slate-200 text-[10px] border border-slate-700 hover:border-cyan-400 transition-all flex items-center gap-1 shadow-lg"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>Capturar</span>
            </button>
          </div>
        </div>

        {/* System Quick Controls (Volume, Lock, Clean) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ações Rápidas de Sistema
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onVolumeControl('up')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px]">Vol +</span>
            </button>

            <button
              onClick={() => onVolumeControl('down')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px]">Vol -</span>
            </button>

            <button
              onClick={() => onVolumeControl('mute')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <VolumeX className="w-4 h-4 text-purple-400" />
              <span className="text-[10px]">Mudo</span>
            </button>

            <button
              onClick={onCleanRecycle}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px]">Limpar Lixeira</span>
            </button>

            <button
              onClick={onLockSystem}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-[10px]">Bloquear PC</span>
            </button>

            <button
              onClick={onRefreshProcesses}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex flex-col items-center gap-1"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px]">Atualizar</span>
            </button>
          </div>
        </div>

        {/* Tabbed Drawer: Apps / Processos / Terminal */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveTab('apps')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'apps' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lançador Apps
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'processes' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Processos
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'terminal' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PowerShell
            </button>
          </div>

          {/* TAB 1: Quick Launcher Grid */}
          {activeTab === 'apps' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'Chrome', icon: '🌐' },
                { name: 'VS Code', icon: '💻' },
                { name: 'Bloco de Notas', icon: '📝' },
                { name: 'Calculadora', icon: '🧮' },
                { name: 'Explorador', icon: '📁' },
                { name: 'Spotify', icon: '🎵' },
                { name: 'Terminal', icon: '🖥️' },
                { name: 'Configurações', icon: '⚙️' },
                { name: 'Paint', icon: '🎨' },
                { name: 'Gerenciador de Tarefas', icon: '📊' }
              ].map((app) => (
                <button
                  key={app.name}
                  onClick={() => onLaunchApp(app.name)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-left transition-all flex items-center gap-2 group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{app.icon}</span>
                  <span className="font-medium text-[11px] truncate">{app.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 2: Process Manager Table */}
          {activeTab === 'processes' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Processos em Execução ({processes.length})</span>
                <button
                  onClick={onRefreshProcesses}
                  className="text-cyan-400 hover:underline text-[10px]"
                >
                  Atualizar
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {processes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-4">Nenhum processo carregado.</p>
                ) : (
                  processes.slice(0, 10).map((proc, i) => (
                    <div
                      key={proc.Id || i}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] hover:border-slate-700"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-200 truncate">
                          {proc.ProcessName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          PID: {proc.Id} | RAM: {proc.Memory_MB} MB
                        </div>
                      </div>

                      <button
                        onClick={() => onKillProcess(proc.Id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
                        title={`Encerrar processo ${proc.ProcessName}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Direct PowerShell Terminal Execution */}
          {activeTab === 'terminal' && (
            <div className="space-y-2">
              <form onSubmit={handleTerminalSubmit} className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Executar Comando PowerShell:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={terminalCmd}
                    onChange={(e) => setTerminalCmd(e.target.value)}
                    placeholder="Get-Process, ipconfig, etc..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={isExecutingCmd || !terminalCmd.trim()}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs disabled:opacity-40 transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {terminalOutput && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1 overflow-x-auto max-h-48">
                  <div className="text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1">
                    <span>Saída da Execução</span>
                    <span className={terminalOutput.success ? 'text-emerald-400' : 'text-rose-400'}>
                      {terminalOutput.success ? ' Sucesso' : ' Erro'}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap">{terminalOutput.output}</pre>
                  {terminalOutput.error && (
                    <div className="text-rose-400 pt-1 border-t border-slate-900">
                      {terminalOutput.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
