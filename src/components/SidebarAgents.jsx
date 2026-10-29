import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Code2, 
  Globe, 
  Cpu, 
  Sparkles, 
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const SUPPORT_AGENTS = [
  {
    id: 'desktop_controller',
    name: 'AURA Control',
    title: 'Controle de Desktop & Automação OS',
    description: 'Executa comandos do sistema, abre apps, ajusta volume, lixeira e PowerShell.',
    icon: ShieldCheck,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40',
    badge: 'Automação PC'
  },
  {
    id: 'vision_agent',
    name: 'AURA Vision',
    title: 'Especialista em Visão de Tela',
    description: 'Captura e analisa visualmente sua área de trabalho, janelas e erros em tempo real.',
    icon: Eye,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/40',
    badge: 'OCR & Visão'
  },
  {
    id: 'code_agent',
    name: 'AURA Code',
    title: 'Especialista em Programação & Scripts',
    description: 'Cria scripts PowerShell, Python, automações e depura erros no código.',
    icon: Code2,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/40',
    badge: 'Dev Agent'
  },
  {
    id: 'web_agent',
    name: 'AURA Web',
    title: 'Inteligência & Pesquisa Web',
    description: 'Realiza buscas na internet, sintetiza informações e traz notícias recentes.',
    icon: Globe,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/40',
    badge: 'Web Agent'
  },
  {
    id: 'ollama_local',
    name: 'AURA Local',
    title: 'Modelo Offline Local (Ollama)',
    description: 'Processamento 100% offline em sua máquina (Llama 3, DeepSeek, Mistral).',
    icon: Cpu,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/40',
    badge: '100% Privativo'
  },
  {
    id: 'general_agent',
    name: 'AURA Core',
    title: 'Assistente Mestre Multimodal',
    description: 'Orquestrador inteligente integrado com todas as IAs especialistas.',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/40',
    badge: 'Orquestrador'
  }
];

export default function SidebarAgents({ activeAgent, setActiveAgent }) {
  return (
    <aside className="w-72 glass-panel border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            IAs de Suporte Integradas
          </h2>
          <p className="text-[11px] text-slate-400">
            Selecione o especialista para guiar o controle ou suporte.
          </p>
        </div>

        <div className="space-y-2">
          {SUPPORT_AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isActive = activeAgent === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border flex items-start gap-3 relative group ${
                  isActive
                    ? `bg-slate-900/90 ${agent.borderColor} shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30`
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-white shadow-md shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                      {agent.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/50 shrink-0">
                      {agent.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                {isActive && (
                  <div className="absolute right-2 top-2 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Motor de Controle Ativo</span>
        </span>
        <span className="text-slate-400 font-mono">Win32 API</span>
      </div>
    </aside>
  );
}
