import React, { useState } from 'react';
import { X, Key, CheckCircle, Sparkles, Server, Shield, ExternalLink } from 'lucide-react';

export default function ApiKeysModal({ isOpen, onClose, onSaveKeys, currentKeysStatus }) {
  const [keys, setKeys] = useState({
    gemini: '',
    openai: '',
    claude: '',
    ollamaUrl: 'http://localhost:11434'
  });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveKeys(keys);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Configurar IAs de Suporte</h3>
              <p className="text-[11px] text-slate-400">Insira suas chaves para habilitar respostas avançadas em nuvem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Google Gemini API Key</span>
                {currentKeysStatus?.gemini && (
                  <span className="text-[10px] text-emerald-400 font-mono">● Ativo</span>
                )}
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Obter Chave</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={keys.gemini}
              onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
              placeholder={currentKeysStatus?.gemini ? '•••••••••••••••• (Já configurada)' : 'AIzaSy...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>OpenAI API Key (GPT-4o)</span>
                {currentKeysStatus?.openai && (
                  <span className="text-[10px] text-emerald-400 font-mono">● Ativo</span>
                )}
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Obter Chave</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={keys.openai}
              onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
              placeholder={currentKeysStatus?.openai ? '•••••••••••••••• (Já configurada)' : 'sk-proj-...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Anthropic Claude API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block">
              Anthropic Claude API Key
            </label>
            <input
              type="password"
              value={keys.claude}
              onChange={(e) => setKeys({ ...keys, claude: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Ollama Local URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-pink-400" />
              <span>Ollama Local Server URL</span>
            </label>
            <input
              type="text"
              value={keys.ollamaUrl}
              onChange={(e) => setKeys({ ...keys, ollamaUrl: e.target.value })}
              placeholder="http://localhost:11434"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Suas chaves são salvas localmente apenas na sessão do seu computador e nunca são compartilhadas externamente.</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
