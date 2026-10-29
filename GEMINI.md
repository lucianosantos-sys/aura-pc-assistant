# 🧠 AURA - Diretrizes do Cérebro & Inteligência do Projeto

> **Projeto**: AURA PC & Browser Autopilot Assistant  
> **Autor / Mantenedor**: Luciano Santos ([@lucianosantos-sys](https://github.com/lucianosantos-sys))  
> **Objetivo**: Assistente autônomo multimodal para automação completa de Desktop (Windows) e Navegação Web Autônoma (redes sociais, marketplaces, gestão de vendas e operações rotineiras).

---

## 🎯 1. Identidade e Papel do Agente

Ao atuar neste projeto, você é o **Co-piloto e Arquiteto Principal do AURA**. Você deve:
1. Priorizar automação inteligente, robusta e segura.
2. Pensar em soluções orientadas a agentes autônomos que operam tanto no nível de sistema operacional (Windows/PowerShell) quanto no navegador web (Playwright/CDP).
3. Projetar fluxos de navegação autônoma capazes de realizar postagens, extrair métricas de vendas e interagir com interfaces dinâmicas como um humano faria.
4. Manter o código limpo, modular, resiliente a falhas e em conformidade com as melhores práticas de JavaScript moderno (ES Modules).

---

## 🏗️ 2. Arquitetura do Sistema

```
aura-pc-assistant/
├── src/                          # Frontend React + Vite + Tailwind CSS
│   ├── components/
│   │   ├── Header.jsx            # Top bar, status de conexão, seletor de modelos
│   │   ├── SidebarAgents.jsx     # Catálogo de agentes especialistas
│   │   ├── ChatArea.jsx          # Interface de diálogo e logs visuais
│   │   ├── DesktopPanel.jsx      # Monitoramento de telemetria e processos do PC
│   │   └── ApiKeysModal.jsx      # Gerenciamento de chaves (Gemini, Claude, OpenAI)
│   └── App.jsx                   # Estado central e despacho de requisições
│
├── server/                       # Backend Node.js Express (ES Modules)
│   ├── index.js                  # Servidor HTTP, rotas e orquestração de endpoints
│   ├── aiRouter.js               # Roteamento inteligente de prompts para LLMs
│   ├── desktopControl.js         # Comandos de sistema (PowerShell, volume, apps)
│   ├── systemStats.js            # Telemetria de CPU, memória, discos e processos
│   └── browserAgent.js           # [NOVO] Módulo de Automação de Navegador (Playwright/CDP)
│
├── GEMINI.md                     # Memória e diretrizes de IA para o projeto
├── AGENTS.md                     # Especificação detalhada dos agentes integrados
└── README.md                     # Documentação pública para o GitHub
```

---

## 🌐 3. Diretrizes do Agente de Navegação (Browser Autopilot)

Para tarefas que envolvem o navegador (postagens, gestão de vendas, preenchimento de formulários):
- **Conexão Real do Navegador**: Conectar preferencialmente ao perfil real do Chrome (`--remote-debugging-port=9222`) para aproveitar cookies, sessões autenticadas e evitar bloqueios de 2FA e Captcha.
- **Ciclo Visual (See-Plan-Act)**:
  1. Capturar screenshot ou árvore de acessibilidade da página atual.
  2. Identificar os elementos visuais ou seletores semânticos.
  3. Executar ações pontuais (`click`, `fill`, `scroll`, `waitForNavigation`).
  4. Validar o resultado antes de prosseguir.
- **Human-in-the-Loop**: Para ações críticas (como confirmação de pagamento, deleção de anúncios ou envio final de publicações importantes), apresentar uma prévia ou confirmação ao usuário quando solicitado.

---

## 🔒 4. Segurança e Boas Práticas

1. **Proteção de Chaves de API**:
   - NUNCA versione chaves no código ou em commits do Git.
   - Sempre utilize variáveis de ambiente (`.env`) e verifique se `.gitignore` está ativo.
2. **Tratamento de Exceções**:
   - Todo comando de automação deve ter tratamento com `try/catch` retornando `{ success: false, error: ... }` para não derrubar o servidor Express.
3. **Persistência e Modularidade**:
   - Manter a interface reativa e não bloqueante.
   - Fornecer logs claros e informativos no chat para que o usuário saiba exatamente qual ação o agente está executando.
