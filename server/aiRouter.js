import fetch from 'node-fetch';
import { 
  launchApplication, 
  openUrl, 
  setVolume, 
  captureScreenshot, 
  getRunningProcesses, 
  killProcess, 
  lockSystem, 
  emptyRecycleBin, 
  runTerminalCommand, 
  simulateTyping 
} from './desktopControl.js';

// Configuration for API Keys
let apiKeys = {
  gemini: process.env.GEMINI_API_KEY || '',
  openai: process.env.OPENAI_API_KEY || '',
  claude: process.env.ANTHROPIC_API_KEY || '',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434'
};

export function updateApiKeys(keys) {
  apiKeys = { ...apiKeys, ...keys };
  return { success: true, keysConfigured: Object.keys(apiKeys).filter(k => !!apiKeys[k]) };
}

export function getApiKeysStatus() {
  return {
    gemini: !!apiKeys.gemini,
    openai: !!apiKeys.openai,
    claude: !!apiKeys.claude,
    ollamaUrl: apiKeys.ollamaUrl
  };
}

/**
 * Natural language intent parser for desktop actions
 */
async function parseDesktopIntent(userPrompt) {
  const text = userPrompt.toLowerCase();
  
  // App launch intents
  if (text.includes('abrir') || text.includes('abra') || text.includes('iniciar') || text.includes('execute')) {
    if (text.includes('chrome') || text.includes('navegador')) return { action: 'launch', app: 'chrome' };
    if (text.includes('vscode') || text.includes('vs code') || text.includes('codigo')) return { action: 'launch', app: 'vscode' };
    if (text.includes('bloco de notas') || text.includes('notepad')) return { action: 'launch', app: 'notepad' };
    if (text.includes('calculadora')) return { action: 'launch', app: 'calculadora' };
    if (text.includes('explorador') || text.includes('pasta') || text.includes('arquivos')) return { action: 'launch', app: 'explorador' };
    if (text.includes('spotify')) return { action: 'launch', app: 'spotify' };
    if (text.includes('gerenciador de tarefas')) return { action: 'launch', app: 'gerenciador de tarefas' };
    if (text.includes('terminal') || text.includes('powershell') || text.includes('cmd')) return { action: 'launch', app: 'terminal' };
    if (text.includes('paint')) return { action: 'launch', app: 'paint' };
    if (text.includes('configurações') || text.includes('painel de controle')) return { action: 'launch', app: 'configurações' };
    
    // Extract app name after "abrir" / "abra"
    const match = text.match(/(?:abrir|abra|iniciar|execute)\s+(?:o|a|os|as)?\s*([a-zA-Z0-9_\s]+)/i);
    if (match && match[1]) {
      return { action: 'launch', app: match[1].trim() };
    }
  }

  // Volume intents
  if (text.includes('volume') || text.includes('som') || text.includes('audio')) {
    if (text.includes('aument') || text.includes('sub') || text.includes('mais')) return { action: 'volume', type: 'up', val: 10 };
    if (text.includes('diminu') || text.includes('baix') || text.includes('menos')) return { action: 'volume', type: 'down', val: 10 };
    if (text.includes('mudo') || text.includes('silenc') || text.includes('deslig')) return { action: 'volume', type: 'mute' };
  }

  // Screenshot intents
  if (text.includes('print') || text.includes('captura') || text.includes('screenshot') || text.includes('foto da tela')) {
    return { action: 'screenshot' };
  }

  // System lock / clean
  if (text.includes('bloquear') || text.includes('trancar') || text.includes('lock')) return { action: 'lock' };
  if (text.includes('lixeira') || text.includes('limpar lixeira')) return { action: 'clean_recycle' };

  // URL intents
  if (text.includes('site') || text.includes('acessar') || text.includes('pesquisar no google') || text.includes('http')) {
    const urlMatch = text.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/i);
    if (urlMatch) return { action: 'open_url', url: urlMatch[0] };
    if (text.includes('google')) {
      const query = text.replace(/.*google\s*(por|sobre)?\s*/i, '');
      return { action: 'open_url', url: `https://www.google.com/search?q=${encodeURIComponent(query)}` };
    }
  }

  // Process listing / killing
  if (text.includes('processos') || text.includes('quais apps estão rodando')) return { action: 'list_processes' };
  if (text.includes('fechar') || text.includes('encerrar') || text.includes('matar')) {
    const procMatch = text.match(/(?:fechar|encerrar|matar)\s+(?:o|a|os|as)?\s*([a-zA-Z0-9_\s]+)/i);
    if (procMatch && procMatch[1]) return { action: 'kill_process', target: procMatch[1].trim() };
  }

  // Direct PowerShell script execution intent
  if (text.startsWith('run:') || text.startsWith('cmd:') || text.startsWith('ps:')) {
    return { action: 'terminal', command: userPrompt.replace(/^(run|cmd|ps):/i, '').trim() };
  }

  return null;
}

/**
 * Handle AI Agent Request
 */
export async function processAgentRequest({ agentId, provider, model, prompt, includeScreenshot, conversation = [] }) {
  // Step 1: Check for direct desktop control intents if using Desktop Agent
  let executedAction = null;

  if (agentId === 'desktop_controller') {
    const intent = await parseDesktopIntent(prompt);
    if (intent) {
      if (intent.action === 'launch') {
        executedAction = await launchApplication(intent.app);
      } else if (intent.action === 'volume') {
        executedAction = await setVolume(intent.type, intent.val);
      } else if (intent.action === 'screenshot') {
        executedAction = await captureScreenshot();
      } else if (intent.action === 'lock') {
        executedAction = await lockSystem();
      } else if (intent.action === 'clean_recycle') {
        executedAction = await emptyRecycleBin();
      } else if (intent.action === 'open_url') {
        executedAction = await openUrl(intent.url);
      } else if (intent.action === 'list_processes') {
        executedAction = await getRunningProcesses();
      } else if (intent.action === 'kill_process') {
        executedAction = await killProcess(intent.target);
      } else if (intent.action === 'terminal') {
        executedAction = await runTerminalCommand(intent.command);
      }
    }
  }

  // Capture screen if requested for Vision Agent or UI inspection
  let screenData = null;
  if (includeScreenshot || agentId === 'vision_agent') {
    screenData = await captureScreenshot();
  }

  // System Prompt based on Agent Specialty
  const systemPrompts = {
    desktop_controller: `Você é o AURA Control, a IA mestre de automação e controle do Windows Desktop. Você pode abrir aplicativos, controlar volume, capturar tela, listar/encerrar processos e executar comandos do PowerShell. Seja preciso, prestativo e forneça feedback sobre a ação realizada.`,
    vision_agent: `Você é o AURA Vision, especialista em análise visual de tela e suporte ao usuário. Analise o estado da tela do sistema, identifique janelas abertas, erros visuais, botões e forneça orientações detalhadas.`,
    code_agent: `Você é o AURA Code, especialista em programação, scripts PowerShell, Node.js, Python e automação de sistemas. Forneça respostas com código limpo, formatado e explicações passo a passo.`,
    web_agent: `Você é o AURA Web, especialista em pesquisa, síntese de informações, últimas notícias e inteligência online.`,
    ollama_local: `Você é o AURA Local, assistente rodando 100% offline em modelo local (Ollama). Focado em privacidade e agilidade.`,
    general_agent: `Você é o AURA Core, assistente principal do sistema operacional com acesso a múltiplos especialistas de inteligência artificial.`
  };

  const activeSystemPrompt = systemPrompts[agentId] || systemPrompts.general_agent;

  // Attempt real LLM API request if provider API key is present
  let responseText = '';

  if (provider === 'gemini' && apiKeys.gemini) {
    try {
      responseText = await callGeminiAPI(apiKeys.gemini, model || 'gemini-1.5-flash', activeSystemPrompt, prompt, screenData);
    } catch (e) {
      responseText = `[Aviso de Conexão Gemini]: ${e.message}. Alternando para resposta assistida de contingência.`;
    }
  } else if (provider === 'openai' && apiKeys.openai) {
    try {
      responseText = await callOpenAI(apiKeys.openai, model || 'gpt-4o', activeSystemPrompt, prompt, screenData);
    } catch (e) {
      responseText = `[Aviso OpenAI]: ${e.message}`;
    }
  } else if (provider === 'ollama') {
    try {
      responseText = await callOllama(apiKeys.ollamaUrl, model || 'llama3', activeSystemPrompt, prompt);
    } catch (e) {
      responseText = `[Aviso Ollama]: Não foi possível conectar ao servidor Ollama local em ${apiKeys.ollamaUrl}. Verifique se o serviço 'ollama serve' está em execução.`;
    }
  }

  // Fallback smart response synthesis if no API response returned
  if (!responseText) {
    responseText = generateSmartFallbackResponse(agentId, prompt, executedAction, screenData);
  }

  return {
    agentId,
    provider,
    model: model || 'Default-AI',
    response: responseText,
    actionResult: executedAction,
    screenshotCaptured: !!screenData?.success,
    screenshotUrl: screenData?.dataUrl || null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Gemini API Handler
 */
async function callGeminiAPI(apiKey, model, systemPrompt, userPrompt, screenData) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const contents = [
    {
      parts: [
        { text: `${systemPrompt}\n\nSolicitação do Usuário: ${userPrompt}` }
      ]
    }
  ];

  if (screenData && screenData.dataUrl) {
    const base64Data = screenData.dataUrl.replace(/^data:image\/\w+;base64,/, '');
    contents[0].parts.push({
      inline_data: {
        mime_type: "image/png",
        data: base64Data
      }
    });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errText}`);
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma resposta retornada do modelo Gemini.';
}

/**
 * OpenAI API Handler
 */
async function callOpenAI(apiKey, model, systemPrompt, userPrompt, screenData) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  if (screenData && screenData.dataUrl) {
    messages[1].content = [
      { type: 'text', text: userPrompt },
      { type: 'image_url', image_url: { url: screenData.dataUrl } }
    ];
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${errText}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'Sem resposta do OpenAI.';
}

/**
 * Ollama Local API Handler
 */
async function callOllama(baseUrl, model, systemPrompt, userPrompt) {
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'llama3',
      system: systemPrompt,
      prompt: userPrompt,
      stream: false
    })
  });

  if (!res.ok) {
    throw new Error(`Ollama HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.response || 'Sem resposta do Ollama.';
}

/**
 * Smart Local AI Engine for rich responsive behavior
 */
function generateSmartFallbackResponse(agentId, prompt, actionResult, screenData) {
  if (actionResult) {
    if (actionResult.success) {
      return `✨ **Ação de Controle Concluída**: ${actionResult.message || 'Comando de sistema executado com sucesso no Windows.'}`;
    } else {
      return `⚠️ **Resultado do Sistema**: ${actionResult.message || actionResult.error || 'Ação solicitada falhou.'}`;
    }
  }

  const lower = prompt.toLowerCase();

  if (agentId === 'desktop_controller') {
    return `⚡ **AURA Control Engine**:
Comando recebido: "${prompt}".
Você pode me pedir para:
- 🚀 *Abrir aplicativos* (ex: "Abra o Chrome", "Abra o VS Code", "Abra a Calculadora")
- 🔊 *Ajustar áudio* (ex: "Aumentar volume", "Diminuir volume", "Mudo")
- 📸 *Analisar tela* (ex: "Tire um print da tela")
- 🔒 *Segurança* (ex: "Bloquear PC", "Limpar lixeira")
- 🌐 *Navegação* (ex: "Pesquisar no Google sobre Inteligência Artificial")`;
  }

  if (agentId === 'vision_agent') {
    if (screenData?.success) {
      return `👁️ **AURA Vision System**: Captura de tela realizada com sucesso! A imagem da sua área de trabalho foi anexada para análise visual. Se houver alguma mensagem de erro ou janela específica para inspecionar, forneça mais detalhes.`;
    }
    return `👁️ **AURA Vision**: Para analisar sua tela, solicite "Tirar um print da tela" ou habilite a opção de captura de tela.`;
  }

  if (agentId === 'code_agent') {
    return `💻 **AURA Code Specialist**:
Aqui está um exemplo de script PowerShell para automação rápida no Windows:

\`\`\`powershell
# Script de verificação de integridade do sistema
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 ProcessName, CPU, WS
Write-Host "Verificação de processos de alto consumo concluída!" -ForegroundColor Green
\`\`\`
Como posso ajudar no desenvolvimento de novos scripts ou integração de APIs?`;
  }

  if (agentId === 'web_agent') {
    return `🔍 **AURA Web Search Agent**:
Pronto para realizar pesquisas avançadas na web e resumir relatórios. Você pode me pedir para buscar notícias atualizadas, documentações técnicas ou tendências do mercado.`;
  }

  return `🤖 **AURA Core Multi-IA System**:
Solicitação processada com sucesso. Para respostas geradas diretamente pelos modelos de nuvem (Gemini, GPT-4o, Claude) ou locais (Ollama), configure suas chaves de API no painel de configurações acima.`;
}
