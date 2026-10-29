# 🚀 AURA - PC & Browser Autopilot Assistant

<p align="center">
  <b>Assistente Inteligente Multimodal para Automação Completa de Desktop e Navegação Web Autônoma.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-blue" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green" alt="Backend" />
  <img src="https://img.shields.io/badge/IA-Gemini%20%7C%20Claude%20%7C%20OpenAI%20%7C%20Ollama-purple" alt="AI Providers" />
  <img src="https://img.shields.io/badge/Browser-Playwright%20Autopilot-orange" alt="Browser Autopilot" />
</p>

---

## 🌟 Visão Geral

O **AURA** é uma central unificada de inteligência artificial desenhada para executar tarefas reais no seu computador e no seu navegador web. Em vez de apenas responder perguntas em texto, o AURA **age por você**:
- **Automação de Desktop:** Abre e gerencia programas, ajusta configurações do Windows, monitora telemetria de CPU/RAM e roda comandos de sistema.
- **Navegador Autônomo (Browser Autopilot):** Conecta-se ao seu navegador real para realizar postagens, gerenciar pedidos e anúncios em marketplaces, preencher cadastros e navegar por você.
- **Visão Computacional Multimodal:** Enxerga a tela do computador ou páginas da web, localizando elementos, botões e informações visuais.
- **Multi-Provedor:** Suporta Google Gemini, Anthropic Claude, OpenAI e modelos locais offline via Ollama.

---

## 📂 Estrutura do Projeto

```
aura-pc-assistant/
├── src/                          # Interface Web (React + Vite + Tailwind CSS)
│   ├── components/               # Header, Chat, Painel Desktop, Gestor de Chaves
│   └── App.jsx                   # Componente central e orquestração de estado
│
├── server/                       # Backend Node.js (Express)
│   ├── index.js                  # Servidor HTTP e endpoints REST
│   ├── aiRouter.js               # Roteamento inteligente de IA e chamadas de API
│   ├── desktopControl.js         # Integração com Windows OS e PowerShell
│   ├── systemStats.js            # Telemetria em tempo real (CPU, RAM, Discos)
│   └── browserAgent.js           # Motor de automação de navegador
│
├── GEMINI.md                     # Diretrizes de IA e regras do projeto
├── AGENTS.md                     # Especificações de cada agente especialista
└── package.json                  # Dependências e scripts
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 1. Clonar o repositório
```bash
git clone https://github.com/lucianosantos-sys/aura-pc-assistant.git
cd aura-pc-assistant
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o projeto (Frontend + Backend)
```bash
npm start
```
- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:3001`

---

## 🤖 IAs e Agentes Disponíveis

Consulte o arquivo [`AGENTS.md`](./AGENTS.md) para detalhes de cada agente:
1. **AURA Control:** Automação de SO e execução de tarefas no PC.
2. **AURA Browser Autopilot:** Navegação autônoma em sites, redes sociais e marketplaces.
3. **AURA Vision:** Inspeção e análise visual em tempo real.
4. **AURA Code:** Geração e depuração de códigos e scripts.
5. **AURA Web:** Pesquisa e inteligência em tempo real.
6. **AURA Local:** Modelos 100% offline via Ollama.
7. **AURA Core:** Orquestrador multimodal.

---

## 👨‍💻 Autor

Desenvolvido por **Luciano Santos**  
- GitHub: [@lucianosantos-sys](https://github.com/lucianosantos-sys)
