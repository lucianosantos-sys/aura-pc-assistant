import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarAgents, { SUPPORT_AGENTS } from './components/SidebarAgents';
import ChatArea from './components/ChatArea';
import DesktopPanel from './components/DesktopPanel';
import ApiKeysModal from './components/ApiKeysModal';

export default function App() {
  const [activeAgentId, setActiveAgentId] = useState('desktop_controller');
  const [currentProvider, setCurrentProvider] = useState('gemini');
  const [currentModel, setCurrentModel] = useState('gemini-1.5-flash');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [keysStatus, setKeysStatus] = useState({ gemini: false, openai: false, claude: false });
  const [metrics, setMetrics] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [processes, setProcesses] = useState([]);

  // Fetch telemetry & initial system state
  useEffect(() => {
    fetchSystemMetrics();
    fetchKeysStatus();
    fetchProcesses();
    fetchScreenshot();

    // Telemetry polling interval (every 4s)
    const interval = setInterval(() => {
      fetchSystemMetrics();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const res = await fetch('/api/system/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {}
  };

  const fetchKeysStatus = async () => {
    try {
      const res = await fetch('/api/ai/keys/status');
      if (res.ok) {
        const data = await res.json();
        setKeysStatus(data);
      }
    } catch (e) {}
  };

  const fetchProcesses = async () => {
    try {
      const res = await fetch('/api/desktop/processes');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.processes) {
          setProcesses(data.processes);
        }
      }
    } catch (e) {}
  };

  const fetchScreenshot = async () => {
    try {
      const res = await fetch('/api/desktop/screenshot');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dataUrl) {
          setScreenshotUrl(data.dataUrl);
          return data.dataUrl;
        }
      }
    } catch (e) {}
    return null;
  };

  // Handle message processing & desktop execution
  const handleSendMessage = async (promptText, includeScreenshot = false) => {
    const userMsg = {
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const activeAgent = SUPPORT_AGENTS.find(a => a.id === activeAgentId);

      const res = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgentId,
          provider: currentProvider,
          model: currentModel,
          prompt: promptText,
          includeScreenshot
        })
      });

      if (res.ok) {
        const data = await res.json();

        // Update screenshot preview if action captured screen
        if (data.screenshotUrl) {
          setScreenshotUrl(data.screenshotUrl);
        }

        const aiMsg = {
          role: 'assistant',
          agentId: activeAgentId,
          agentName: activeAgent?.name || 'AURA AI',
          provider: data.provider,
          text: data.response,
          actionResult: data.actionResult,
          screenshotUrl: data.screenshotUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
        fetchProcesses(); // Refresh processes list in case app was launched/killed
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          agentName: 'AURA System Error',
          text: `⚠️ Falha ao comunicar com o servidor AURA PC: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Desktop Action Helpers
  const handleLaunchApp = async (appName) => {
    handleSendMessage(`Abra o aplicativo ${appName}`);
  };

  const handleVolumeControl = async (action) => {
    const actMap = { up: 'Aumentar volume', down: 'Diminuir volume', mute: 'Ativar mudo' };
    handleSendMessage(actMap[action] || 'Ajustar volume');
  };

  const handleLockSystem = () => {
    handleSendMessage('Bloquear a estação de trabalho');
  };

  const handleCleanRecycle = () => {
    handleSendMessage('Limpar a lixeira');
  };

  const handleKillProcess = async (target) => {
    handleSendMessage(`Encerrar o processo com PID ${target}`);
  };

  const handleRunTerminal = async (command) => {
    try {
      const res = await fetch('/api/desktop/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleSaveKeys = async (keys) => {
    try {
      const res = await fetch('/api/ai/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys)
      });
      if (res.ok) {
        fetchKeysStatus();
      }
    } catch (e) {}
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header Telemetry & Controls Bar */}
      <Header
        metrics={metrics}
        currentProvider={currentProvider}
        setCurrentProvider={setCurrentProvider}
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        onOpenKeysModal={() => setIsKeysModalOpen(true)}
        onCaptureScreenshot={fetchScreenshot}
        keysStatus={keysStatus}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Support AI Specialist Selector */}
        <SidebarAgents
          activeAgent={activeAgentId}
          setActiveAgent={setActiveAgentId}
        />

        {/* Center: Command Center & Chat Stream */}
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          activeAgentId={activeAgentId}
          onClearHistory={() => setMessages([])}
          onQuickAction={(cmd) => handleSendMessage(cmd)}
        />

        {/* Right Drawer: Desktop Live View & Quick Controls */}
        <DesktopPanel
          screenshotUrl={screenshotUrl}
          onRefreshScreenshot={fetchScreenshot}
          onLaunchApp={handleLaunchApp}
          onVolumeControl={handleVolumeControl}
          onLockSystem={handleLockSystem}
          onCleanRecycle={handleCleanRecycle}
          processes={processes}
          onRefreshProcesses={fetchProcesses}
          onKillProcess={handleKillProcess}
          onRunTerminal={handleRunTerminal}
        />
      </div>

      {/* API Key Config Modal */}
      <ApiKeysModal
        isOpen={isKeysModalOpen}
        onClose={() => setIsKeysModalOpen(false)}
        onSaveKeys={handleSaveKeys}
        currentKeysStatus={keysStatus}
      />
    </div>
  );
}
