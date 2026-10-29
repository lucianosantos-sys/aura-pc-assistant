# 🤖 AURA - Catálogo e Especificação dos Agentes

Este documento descreve os agentes de Inteligência Artificial que compõem o ecossistema do **AURA PC & Web Assistant**.

---

## 1. 🛡️ AURA Control (`desktop_controller`)
- **Especialidade:** Automação de Sistema Operacional e Desktop.
- **Capacidades:**
  - Abertura e fechamento de aplicativos (Chrome, VS Code, Bloco de Notas, etc.).
  - Controle de volume, trava de tela e limpeza de lixeira.
  - Execução controlada de scripts e comandos no PowerShell/Terminal.

---

## 2. 🌐 AURA Browser Autopilot (`browser_autopilot`)
- **Especialidade:** Navegação Autônoma e Gestão de Tarefas Web.
- **Capacidades:**
  - Conexão com o navegador real (mantendo cookies e contas logadas).
  - Execução de postagens automatizadas em redes sociais (LinkedIn, Instagram, X/Twitter, etc.).
  - Gestão e extração de métricas de vendas em marketplaces (Mercado Livre, Shopee, Amazon, Shopify).
  - Preenchimento inteligente de formulários e interação visual com botões e menus.
  - Suporte a confirmação humana (*Human-in-the-loop*) para ações sensíveis.

---

## 3. 👁️ AURA Vision (`vision_agent`)
- **Especialidade:** Visão Computacional e OCR de Tela.
- **Capacidades:**
  - Captura e análise visual do desktop em tempo real.
  - Identificação de erros na tela, janelas ativas e elementos gráficos.
  - Auxílio na navegação visual baseada em coordenadas.

---

## 4. 💻 AURA Code (`code_agent`)
- **Especialidade:** Engenharia de Software e Scripts.
- **Capacidades:**
  - Criação de scripts em Python, Node.js e PowerShell.
  - Depuração e correção de bugs em projetos locais.
  - Automações de rotinas de desenvolvimento e DevOps.

---

## 5. 🌍 AURA Web Intelligence (`web_agent`)
- **Especialidade:** Pesquisa e Síntese de Conteúdo.
- **Capacidades:**
  - Pesquisas em tempo real na internet.
  - Síntese de notícias, cotações e documentações técnicas.

---

## 6. ⚡ AURA Local (`ollama_local`)
- **Especialidade:** Processamento 100% Offline e Privativo.
- **Capacidades:**
  - Execução com modelos locais via Ollama (Llama 3, DeepSeek, Mistral).
  - Operação sem necessidade de conexão externa ou custos de API.

---

## 7. ✨ AURA Core (`general_agent`)
- **Especialidade:** Orquestrador Geral Multimodal.
- **Capacidades:**
  - Roteamento de comandos para o agente mais adequado.
  - Síntese multimodal e diálogo de alto nível com o usuário.
