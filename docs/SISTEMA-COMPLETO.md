# Levante CRM — Documentação Completa do Sistema

> Documento gerado a partir da análise exaustiva da codebase. Cobre **tudo** que o sistema faz, de ponta a ponta.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Autenticação & Multi-Tenant](#4-autenticação--multi-tenant)
5. [Pipeline de Vendas (Deals & Boards)](#5-pipeline-de-vendas-deals--boards)
6. [Contatos & Empresas](#6-contatos--empresas)
7. [Atividades](#7-atividades)
8. [Inbox Inteligente](#8-inbox-inteligente)
9. [Assistente de IA](#9-assistente-de-ia)
10. [Decision Queue](#10-decision-queue)
11. [Dashboard & Relatórios](#11-dashboard--relatórios)
12. [Configurações & Administração](#12-configurações--administração)
13. [Integrações Externas](#13-integrações-externas)
14. [PWA & Experiência Mobile](#14-pwa--experiência-mobile)
15. [Segurança & LGPD](#15-segurança--lgpd)
16. [Labs (Experimental)](#16-labs-experimental)
17. [Instalação & Deploy](#17-instalação--deploy)

---

## 1. Visão Geral

O **Levante CRM** é um CRM (Customer Relationship Management) completo, open-source, com assistente de IA integrado. Ele permite gerenciar o pipeline de vendas, contatos, atividades e comunicação com clientes — tudo de forma visual, em tempo real e com inteligência artificial embutida.

**O que o sistema resolve:**
- Organizar o funil de vendas em quadros Kanban visuais
- Gerenciar contatos, empresas e oportunidades de negócio
- Acompanhar atividades (ligações, reuniões, emails, tarefas)
- Receber briefings diários com IA sobre o que fazer no dia
- Gerar scripts de venda, análises de pipeline e rascunhos de email com IA
- Integrar com ferramentas externas (Hotmart, n8n, Make, WhatsApp)
- Funcionar como app instalável (PWA) em qualquer dispositivo
- Expor dados via API pública e servidor MCP para agentes de IA

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 16 |
| UI | React | 19 |
| Linguagem | TypeScript | 5.x |
| Banco de Dados | Supabase (Postgres + Auth + Storage + Realtime + Edge Functions) | — |
| Estado | TanStack Query + Zustand | 5.x / 5.x |
| IA | Vercel AI SDK | v6 |
| Provedores de IA | Google Gemini (padrão), OpenAI GPT-4o, Anthropic Claude | — |
| Estilo | Tailwind CSS v4 + Radix UI | — |
| Formulários | React Hook Form + Zod | — |
| Gráficos | Recharts | 3.x |
| PDF | jsPDF + jspdf-autotable | — |
| Testes | Vitest + React Testing Library + happy-dom | — |

---

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────┐
│       FRONTEND (Next.js 16 + React 19)          │
│                                                 │
│  app/(protected)/ ← Páginas autenticadas        │
│  components/      ← Componentes compartilhados  │
│  features/        ← Módulos de negócio          │
│  context/         ← Providers globais           │
│  hooks/           ← Hooks reutilizáveis         │
│  lib/stores/      ← Zustand (UI state)          │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│       API LAYER (Next.js Route Handlers)        │
│                                                 │
│  app/api/ai/       ← Chat, tasks, briefing      │
│  app/api/public/   ← API pública (v1)           │
│  app/api/mcp/      ← Servidor MCP               │
│  app/api/contacts/ ← Import/export CSV          │
│  app/api/settings/ ← Configurações              │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│       SUPABASE                                  │
│                                                 │
│  Auth        ← Login, OAuth, sessão             │
│  Postgres    ← Dados + RLS multi-tenant         │
│  Realtime    ← Sync em tempo real               │
│  Storage     ← Uploads (avatares, arquivos)     │
│  Edge Funcs  ← webhook-in (entrada de leads)    │
└─────────────────────────────────────────────────┘
```

### Estrutura de pastas

| Pasta | Responsabilidade |
|-------|-----------------|
| `app/(protected)/` | Páginas autenticadas (dashboard, pipeline, contatos, etc.) |
| `app/api/` | Route handlers (API interna, pública, IA, MCP) |
| `app/auth/`, `app/login/`, `app/install/`, `app/join/` | Fluxos de autenticação e setup |
| `components/` | Componentes reutilizáveis (UI, charts, navigation, AI chat) |
| `features/` | Módulos de domínio (deals, contacts, activities, dashboard, inbox, etc.) |
| `context/` | React Contexts (Auth, AI, Boards, Deals, Settings, Toast, Theme) |
| `hooks/` | Hooks utilitários (consent, idle, speech, notifications, etc.) |
| `lib/` | Core: Supabase clients, IA, queries, realtime, segurança, validações |
| `types/` | Interfaces e tipos TypeScript |
| `supabase/` | Migrations SQL, config e Edge Functions |

### Proxy de autenticação

O Next.js 16 usa `proxy.ts` (não `middleware.ts`) para refresh de sessão e redirects. Rotas `/api/*` **não** são interceptadas pelo proxy — Route Handlers respondem com status code (401/403) diretamente.

---

## 4. Autenticação & Multi-Tenant

### Fluxos de autenticação

| Fluxo | Caminho | Descrição |
|-------|---------|-----------|
| Login | `/login` | Email e senha via Supabase Auth |
| OAuth Callback | `/auth/callback` | Retorno de provedores OAuth |
| Convite | `/join` | Aceitar convite para organização |
| Instalação | `/install` | Wizard de primeiro setup |

### Isolamento multi-tenant

Cada organização tem seus dados **completamente isolados**:

- **RLS (Row Level Security)**: Políticas no Postgres que filtram por `organization_id` automaticamente
- **Filtro em código**: Toda query sensível filtra explicitamente por `organization_id` como defesa em profundidade
- **Service role**: Queries com `createStaticAdminClient()` (que bypassa RLS) **obrigatoriamente** aplicam filtro de tenant
- **IA**: Todas as ferramentas do assistente recebem `organizationId` do servidor e operam apenas naquele escopo

### Supabase clients

| Client | Arquivo | Uso |
|--------|---------|-----|
| Browser | `lib/supabase/client.ts` | Componentes client-side (retorna `null` se env não configurada) |
| Server | `lib/supabase/server.ts` | Route handlers e Server Components (usa cookies) |
| Service Role | `createStaticAdminClient()` em `lib/supabase/server.ts` | IA, scripts, operações privilegiadas (sem cookies, sem RLS) |

### AuthContext

O contexto de autenticação disponibiliza:
- `user` — Dados do usuário Supabase
- `profile` — Perfil com nome, avatar, telefone, organização
- `organizationId` — ID da organização ativa
- `session` — Sessão ativa
- Auto-refresh de sessão e sync entre abas

---

## 5. Pipeline de Vendas (Deals & Boards)

### O que é

O coração do CRM. Um **Board** é um pipeline (funil de vendas) composto por **Stages** (etapas). Cada oportunidade de negócio é um **Deal** que se move entre os estágios.

### Boards (Pipelines)

Um board é um funil personalizável:

| Campo | Descrição |
|-------|-----------|
| `name` | Nome do pipeline (ex: "Vendas B2B") |
| `key` | Slug estável para integrações (ex: `vendas-b2b`) |
| `stages` | Lista de estágios (colunas do Kanban) |
| `wonStageId` | Estágio que marca deal como "Ganho" |
| `lostStageId` | Estágio que marca deal como "Perdido" |
| `nextBoardId` | Ao ganhar, cria deal automaticamente neste outro board |
| `linkedLifecycleStage` | Ao mover deal, atualiza estágio do contato |
| `goal` | KPI do board (ex: "20% de conversão") |
| `agentPersona` | Persona do agente de IA (ex: "SDR Bot") |
| `template` | Tipo: PRE_SALES, SALES, ONBOARDING, CS, CUSTOM |

#### Templates de Board

O sistema vem com templates prontos:
- **PRE_SALES**: Novos Leads → Contatado → Qualificando → Qualificado (MQL)
- **SALES**: Pipeline de vendas clássico com negociação e proposta
- **ONBOARDING**: Fluxo de onboarding de clientes
- **CS**: Customer Success / pós-venda
- **CUSTOM**: Totalmente personalizável

Existe também o conceito de **Journey Templates** — playbooks multi-board completos. Exemplo: **INFOPRODUCER** cria automaticamente 5 boards interligados (Captação → Vendas → Onboarding → CS → Upsell).

### Deals (Oportunidades)

Um deal representa uma oportunidade de venda:

| Campo | Descrição |
|-------|-----------|
| `title` | Título da oportunidade |
| `value` | Valor monetário (R$) |
| `probability` | Probabilidade de fechamento (0-100%) |
| `priority` | Prioridade: low, medium, high |
| `status` | ID do estágio atual no board |
| `contactId` | Contato associado |
| `clientCompanyId` | Empresa do cliente |
| `ownerId` | Responsável pelo deal |
| `tags` | Etiquetas (ex: "Hot", "Follow-up") |
| `items` | Lista de produtos/serviços na venda |
| `isWon` / `isLost` | Estado de fechamento |
| `lossReason` | Motivo da perda (obrigatório se perdido) |
| `aiSummary` | Resumo gerado por IA |
| `customFields` | Campos personalizados dinâmicos |
| `nextActivity` | Próxima ação planejada |
| `lastStageChangeDate` | Quando moveu de estágio (rastrear estagnação) |

### Visualização Kanban

O pipeline é exibido como um quadro Kanban com drag-and-drop:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Prospecção│  │ Proposta  │  │Negociação│  │ Fechado  │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│ Deal A   │  │ Deal C   │  │ Deal E   │  │ Deal G ✓ │
│ R$ 5.000 │  │ R$12.000 │  │ R$ 8.000 │  │ R$15.000 │
│          │  │          │  │          │  │          │
│ Deal B   │  │ Deal D   │  │ Deal F   │  │          │
│ R$ 3.000 │  │ R$ 7.000 │  │ R$20.000 │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

Cada card mostra: título, valor, contato, indicador de atividade (verde/amarelo/vermelho).

### Automações ao mover deals

Quando um deal é movido de estágio, o sistema pode:

1. **Registrar activity**: Cria uma atividade `STATUS_CHANGE` com histórico da movimentação
2. **Atualizar contato**: Se o estágio está linkado a um lifecycle stage (ex: "Proposta" → contato vira PROSPECT)
3. **Criar deal em próximo board**: Se o deal é marcado como ganho e o board tem `nextBoardId`, um novo deal é criado automaticamente no board seguinte (útil para Vendas → Onboarding)
4. **Marcar ganho/perdido**: Se move para `wonStageId` ou `lostStageId`
5. **Rastrear estagnação**: Atualiza `lastStageChangeDate` (deals parados >10 dias ficam "rotting")

### Itens/Produtos no Deal

Cada deal pode ter uma lista de produtos/serviços:
- Nome do produto
- Quantidade
- Preço unitário
- Pode vir do catálogo de produtos ou ser criado inline

### Deal Cockpit

Tela de detalhe completo de um deal, com painéis:

| Painel | O que mostra |
|--------|-------------|
| Informações | Título, valor, estágio, probabilidade, prioridade, tags, dono |
| Contato | Nome, email, telefone, cargo, avatar |
| Empresa | Empresa CRM vinculada |
| Atividades | Timeline das últimas 25 ações |
| Análise de IA | Health score, próxima ação recomendada, urgência |
| Arquivos | Upload/download de documentos |
| Chat com IA | Assistente integrado para análise e sugestões |
| Quick Scripts | Respostas prontas para objeções |
| Ações | Agendar chamada, reunião, email, mover estágio |

### Stagnation Tracking (Deals "mofando")

O sistema detecta automaticamente deals parados:
- `lastStageChangeDate` monitora há quanto tempo o deal está no estágio
- Deals parados >10 dias são marcados visualmente como "rotting"
- O indicador aparece no card do Kanban

---

## 6. Contatos & Empresas

### Contatos

Cada contato tem:

| Campo | Descrição |
|-------|-----------|
| `name` | Nome completo |
| `email` | Email (usado para upsert/deduplicação) |
| `phone` | Telefone (normalizado para formato E.164) |
| `role` | Cargo/posição |
| `status` | ACTIVE, INACTIVE ou CHURNED |
| `stage` | Estágio no funil: LEAD → MQL → PROSPECT → CUSTOMER |
| `source` | Origem: WEBSITE, LINKEDIN, REFERRAL, MANUAL |
| `lastInteraction` | Data da última atividade |
| `lastPurchaseDate` | Data da última compra (calcula risco de churn) |
| `totalValue` | LTV (valor total de compras) |
| `birthDate` | Para tarefas agentic de IA |
| `notes` | Anotações livres |
| `clientCompanyId` | Empresa CRM vinculada |

### Lifecycle Stages (Funil de Contatos)

O contato passa por estágios dinâmicos:

```
LEAD → MQL → PROSPECT → CUSTOMER
 │                          │
 └── CHURNED ◄──────────────┘
```

- **LEAD**: Contato novo, não qualificado
- **MQL**: Marketing Qualified Lead
- **PROSPECT**: Em negociação ativa
- **CUSTOMER**: Cliente fechado
- **RISK**: Status computado (cliente ativo sem compra há 30+ dias)

A progressão pode ser manual (trocar na aba) ou **automática** — quando um deal move para um estágio com `linkedLifecycleStage`, o contato é promovido.

### Importação/Exportação CSV

**Importar:**
- Modos: criar apenas, upsert por email, pular duplicatas
- Auto-detecção de delimitador (`;` ou `,`)
- Criação automática de empresas
- Normalização de headers (aceita variações como "nome completo", "full name", etc.)
- Retorna relatório com criados/atualizados/pulados/erros

**Exportar:**
- Filtros: busca, estágio, status, período
- Formato CSV com chunking (1000 registros por vez)

### Empresas CRM

Representam as empresas que você vende para (diferente da sua organização/tenant):
- Campos: nome, indústria, website
- Vinculadas a múltiplos contatos via `clientCompanyId`
- CRUD completo com delete em massa
- Visualização em aba separada na tela de contatos

### Funcionalidades

- CRUD completo (criar, editar, deletar)
- Delete em massa (bulk delete)
- Busca por nome ou email
- Filtros por estágio, status, período
- Ordenação por nome, data de criação, estágio
- Contagem por lifecycle stage (via RPC no banco)
- Conversão contato → deal (cria oportunidade a partir de um contato)
- Realtime sync (novos contatos aparecem em tempo real)

---

## 7. Atividades

### Tipos de atividade

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| CALL | 📞 | Ligação telefônica |
| MEETING | 🤝 | Reunião agendada |
| EMAIL | ✉️ | Envio de email |
| TASK | ✅ | Tarefa/ação (com checkbox) |
| NOTE | 📝 | Anotação (sem conclusão) |
| STATUS_CHANGE | 🔄 | Mudança automática de estágio (gerada pelo sistema) |

### Campos de uma atividade

| Campo | Descrição |
|-------|-----------|
| `dealId` | Deal relacionado |
| `contactId` | Contato (opcional) |
| `participantContactIds` | Contatos participantes |
| `type` | CALL, MEETING, EMAIL, TASK, NOTE, STATUS_CHANGE |
| `title` | Título (ex: "Ligar para cliente") |
| `description` | Contexto adicional |
| `date` | Data e hora agendada |
| `completed` | Concluído ou pendente |
| `user` | Quem criou (nome + avatar) |

### Funcionalidades

- CRUD completo com optimistic updates
- Toggle de conclusão (checkbox)
- Filtros: tipo, período, status (completo/pendente)
- Vistas: lista e calendário
- Bulk actions: marcar múltiplas como concluídas, adiar
- Sorting inteligente: prioriza MEETING/CALL, pendentes primeiro, próximas datas
- Realtime sync

---

## 8. Inbox Inteligente

O Inbox é o "centro de comando" diário do vendedor. Combina atividades pendentes com sugestões de IA.

### Três modos de visualização

#### Overview (Visão Geral)
Dashboard rápido com contadores:
- Atividades atrasadas (vermelho)
- Para fazer hoje (verde)
- Sugestões de IA (azul)
- Inbox Zero (verde, quando tudo está em dia)

#### List View (Lista)
Organiza por seções:
1. **Atividades Atrasadas** — Pendentes com data passada
2. **Reuniões Hoje** — MEETING/CALL agendados para hoje (com hora)
3. **Tasks Hoje** — TASK/NOTE com data de hoje
4. **Próximas Atividades** — Futuras pendentes
5. **Sugestões de IA** — Cards com recomendações

Cada item permite: concluir, adiar (snooze), descartar, abrir detalhes.

#### Focus View (Modo Cockpit)

Modo de concentração máxima — uma atividade/sugestão por vez:

```
┌───────────────────────────────────────────────┐
│  Item 3/15           [← Anterior] [Próximo →] │
├───────────────────┬───────────────────────────┤
│                   │  PAINEL DE CONTEXTO       │
│  [Tipo] Título    │  • Detalhes do deal       │
│  Descrição        │  • Info do contato        │
│  Contexto         │  • Histórico recente      │
│                   │  • Health score (IA)      │
│                   │  • Quick scripts          │
│                   │  • Ações rápidas          │
├───────────────────┴───────────────────────────┤
│  [✓ Concluir]  [⏱ Adiar]  [⤵ Pular]         │
└───────────────────────────────────────────────┘
```

O painel de contexto à direita oferece tudo que o vendedor precisa para agir sem sair da tela.

### Sugestões de IA

O sistema gera sugestões proativas:

| Tipo | O que detecta |
|------|--------------|
| **UPSELL** | Cliente com potencial de venda adicional |
| **RESCUE** | Contato sem interação há 30+ dias (risco de churn) |
| **STALLED** | Deal travado sem movimento de estágio |

Cada sugestão pode ser: aceita, dispensada ou adiada (reaparece depois).

### Quick Scripts (Modelos de Venda)

Templates de mensagem por categoria:
- **followup** — Scripts de acompanhamento
- **objection** — Respostas para objeções
- **closing** — Scripts de fechamento
- **intro** — Abordagem inicial
- **rescue** — Resgatar leads inativos

Suportam placeholders dinâmicos: `{{contactName}}`, `{{dealValue}}`, `{{companyName}}`, etc.

---

## 9. Assistente de IA

### Visão geral

O Levante CRM tem um assistente de IA integrado que entende o contexto do seu CRM e pode executar ações reais.

### Arquitetura

```
UIChat.tsx (widget flutuante)
     │
     ▼
POST /api/ai/chat (streaming)
     │
     ├── Valida sessão e same-origin
     ├── Resolve organizationId via profiles
     ├── Carrega configuração de IA da organização
     │
     ▼
createCRMAgent (lib/ai/crmAgent.ts)
     │
     ├── Provider: Google Gemini / OpenAI / Anthropic
     ├── Contexto: board ativo, deal selecionado, contato
     └── 50+ ferramentas disponíveis
```

### Provedores suportados

| Provedor | Modelos |
|----------|---------|
| Google | Gemini (padrão) |
| OpenAI | GPT-4o, GPT-4o-mini |
| Anthropic | Claude |

Configurável por organização em Settings → IA.

### Ferramentas do assistente (50+)

O agente pode **executar ações reais** no CRM:

**Pipeline & Deals:**
- Analisar pipeline completo (win rate, valor, tempo médio)
- Buscar deals por título
- Ver detalhes de um deal
- Listar deals por estágio
- Listar deals estagnados (>10 dias)
- Mover deal entre estágios
- Marcar como ganho ou perdido
- Reatribuir dono
- Mover deals em massa (bulk)
- Atualizar valor
- Criar novo deal

**Contatos:**
- Buscar contatos
- Ver detalhes de contato
- Criar contato
- Atualizar contato

**Atividades:**
- Listar atividades de hoje
- Listar atividades atrasadas
- Criar atividade
- Completar atividade

**Boards:**
- Listar boards
- Ver detalhes de board
- Gerar board com IA (cria estágios automaticamente)

**Métricas:**
- Estatísticas do pipeline
- KPIs do board

### Tasks de IA (Saídas Estruturadas)

Além do chat, a IA pode executar tarefas específicas com output estruturado:

| Task | Endpoint | O que faz |
|------|----------|-----------|
| Análise de Deal | `/api/ai/tasks/deals/analyze` | Health score, próxima ação, urgência, probabilidade |
| Draft de Email | `/api/ai/tasks/deals/email-draft` | Gera rascunho de email para o contato |
| Respostas a Objeções | `/api/ai/tasks/deals/objection-responses` | Scripts para contornar objeções |
| Geração de Board | `/api/ai/tasks/boards/generate` | Cria board com estágios via IA |
| Briefing Diário | `/api/ai/briefing` | Resumo do dia (em desenvolvimento) |

### Contexto da IA

O assistente recebe automaticamente:
- Board ativo
- Deal selecionado (se houver)
- Contato associado
- Configuração de IA da organização (modelo, chave)

### AI Hub

Existe uma tela dedicada para interação com IA (`features/ai-hub/`):
- Interface completa do agente
- Ferramentas de leitura de CRM
- Stop generation (AbortController)

### Speech Recognition

O hook `useSpeechRecognition()` permite ditar mensagens para o assistente usando Web Speech API.

---

## 10. Decision Queue

### O que é

Sistema proativo que analisa o CRM e **sugere decisões** priorizadas. Diferente das sugestões do Inbox (que são mais leves), a Decision Queue analisa patterns mais complexos.

### Analyzers

| Analyzer | O que detecta | Prioridade |
|----------|--------------|------------|
| Stagnant Deals | Deals parados 7+ dias sem atividade | Medium (7-14 dias) / Critical (14+ dias) |
| Overdue Activities | Atividades/reuniões vencidas | High |

### Interface

Uma fila priorizada de decisões:
- **Critical** → **High** → **Medium** → **Low**
- Ações: aprovar, rejeitar, adiar (snooze)
- Persistência via localStorage

---

## 11. Dashboard & Relatórios

### Dashboard

Tela principal com visão geral do CRM:

**KPIs exibidos:**
- Total de deals abertos
- Deals ganhos no período
- Deals perdidos no período
- Receita total (soma dos ganhos)
- Taxa de conversão (win rate)
- Valor do pipeline (deals abertos)
- Ticket médio
- Tempo médio de fechamento
- Deals criados no período
- Atividades pendentes

**Gráficos:**
- **Funnel Chart** — Funil de estágios (quantos deals em cada etapa)
- **Revenue Trend** — Tendência de receita ao longo do tempo

**Período dinâmico:**
Filtro por: hoje, ontem, últimos 7/30 dias, este/último mês, este/último trimestre, este/último ano.

### Relatórios

Análise detalhada com:
- Métricas aprofundadas por board
- Comparação entre períodos
- Exportação para PDF com gráficos incluídos

---

## 12. Configurações & Administração

### Abas de configuração

| Aba | O que configura |
|-----|----------------|
| **Geral** | Nome da organização, dados básicos |
| **Produtos** | Catálogo de produtos/serviços (nome, preço) |
| **Integrações** | Webhooks, API keys, MCP, conexões externas |
| **IA** | Provedor (Google/OpenAI/Anthropic), modelo, chave API, flags |
| **Usuários** | Membros da organização, convites, permissões |
| **Dados** | Retenção, LGPD, limpeza |

### Configuração de IA (por organização)

Cada organização escolhe independentemente:

| Config | Descrição |
|--------|-----------|
| `provider` | google, openai ou anthropic |
| `model` | Modelo específico (ex: gemini-2.0-flash) |
| `apiKey` | Chave API do provedor |
| `thinking` | Habilitar modo thinking (raciocínio expandido) |
| `search` | Habilitar busca web |
| `anthropicCaching` | Cache de contexto (Anthropic) |

A fonte de verdade é `organization_settings` (não `user_settings`).

### Catálogo de Produtos

Produtos cadastrados podem ser vinculados a deals:
- Nome, descrição, preço
- CRUD completo
- Seleção ao criar/editar deal

### Tags

Tags globais disponíveis para deals e contatos:
- Criação livre
- Filtro por tag

### Campos Customizados

Definições de campos extras para deals:
- Tipo: texto, número, data, select, etc.
- Aplicados na criação/edição de deal

---

## 13. Integrações Externas

### API Pública REST (v1)

API completa documentada com OpenAPI 3.1.2:

**Autenticação:** Header `X-Api-Key: <chave>`

**Endpoints:**

| Recurso | Endpoints |
|---------|-----------|
| Me | `GET /api/public/v1/me` |
| Boards | `GET /boards`, `GET /boards/{id}`, `GET /boards/{id}/stages` |
| Companies | `GET`, `POST` (upsert), `GET/{id}`, `PATCH/{id}` |
| Contacts | `GET`, `POST` (upsert), `GET/{id}`, `PATCH/{id}` |
| Deals | `GET`, `POST`, `GET/{id}`, `PATCH/{id}`, `POST/{id}/move-stage`, `POST/{id}/mark-won`, `POST/{id}/mark-lost` |
| Activities | `GET`, `POST` |

**Extras:**
- Move deals por identidade (telefone/email, sem saber o ID)
- Move deals em batch
- Paginação cursor-based (eficiente)
- Spec OpenAPI em `/api/public/v1/openapi.json`
- Swagger UI em `/api/public/v1/docs`

### Webhooks

#### Entrada de Leads (Inbound)

Recebe leads de ferramentas externas:
- URL: `POST {SUPABASE_URL}/functions/v1/webhook-in/<source_id>`
- Auth: `X-Webhook-Secret` ou `Authorization: Bearer <secret>`
- Faz upsert de contato (por email/phone) + cria deal no board configurado
- Suporta idempotência via `external_event_id`
- Campos: `deal_title`, `deal_value`, `company_name`, `contact_name`, `email`, `phone`, `source`, `notes`

#### Follow-up (Outbound)

Avisa ferramentas externas quando algo muda:
- Dispara quando deal muda de estágio
- Envia para URL configurada (n8n, Make, etc.)
- Valida via `X-Webhook-Secret`

#### Destinos comuns: Hotmart, n8n, Make, WhatsApp

### Servidor MCP (Model Context Protocol)

Expõe as ferramentas do CRM para agentes de IA externos (Claude, ChatGPT, etc.):

- Endpoint: `POST /api/mcp` (JSON-RPC 2.0)
- Auth: `Authorization: Bearer <API_KEY>`
- 40+ ferramentas expostas (formato `crm.*`)
- Schemas de entrada em JSON Schema 2020-12
- Compatível com MCP Inspector

**Ferramentas MCP:**
- `crm.deals.search`, `crm.deals.move`, `crm.deals.create`
- `crm.contacts.search`, `crm.contacts.get`
- `crm.activities.list`, `crm.activities.create`
- `crm.pipeline.analyze`, `crm.boards.list`
- E muitas mais...

---

## 14. PWA & Experiência Mobile

### Progressive Web App

- **Service Worker**: Cache offline, detecção de atualizações
- **Install Banner**: Detecção de plataforma (iOS mostra instruções, Android mostra prompt nativo)
- **Manifest**: Configuração de ícone, nome, cor do tema
- **Funciona offline**: Dados em cache acessíveis sem conexão

### Responsividade

- 3 breakpoints: mobile, tablet, desktop
- Hook `useResponsiveMode()` detecta automaticamente
- Layout adapta navegação e painéis

### Dark Mode

- Toggle persistido em localStorage
- ThemeContext para controle global
- Suporta preferência do sistema

---

## 15. Segurança & LGPD

### Camadas de segurança

| Camada | Mecanismo |
|--------|-----------|
| Autenticação | Supabase Auth (JWT, refresh tokens) |
| Multi-tenant | RLS no Postgres + filtro em código |
| CSRF | Same-origin check em `/api/ai/chat` |
| API | API keys validadas via RPC |
| Proxy | `proxy.ts` controla redirects (não intercepta `/api/*`) |

### Consentimento LGPD

Sistema completo de consentimento com versionamento:

| Tipo | Obrigatório? |
|------|-------------|
| terms | Sim |
| privacy | Sim |
| marketing | Não |
| analytics | Não |
| data_processing | Sim |

Cada consentimento registra:
- Versão aceita
- IP address
- User Agent
- Data/hora
- Suporta revogação

### Idle Timeout

Hook `useIdleTimeout()` faz auto-logout após período de inatividade.

### Notificações do Sistema

Hook `useSystemNotifications()` — Notificações desktop via Web Notifications API.

---

## 16. Labs (Experimental)

Features em desenvolvimento, acessíveis em `app/(protected)/labs/`:

| Feature | O que é |
|---------|---------|
| Deal Cockpit Mock | Protótipo de cockpit em alta densidade (tudo em uma tela) |
| Deal Jobs Mock | Layout alternativo para detalhe de deal (estilo Jobs) |

Disponíveis apenas em ambiente de desenvolvimento.

---

## 17. Instalação & Deploy

### Wizard de Instalação

Fluxo automatizado em `/install`:

1. **Conectar**: Credenciais Supabase (OAuth + tokens)
2. **Configurar envs**: Variáveis de ambiente na Vercel automaticamente
3. **Aguardar projeto**: Supabase ficar ativo
4. **Aguardar storage**: Buckets prontos
5. **Migrations**: Executar schema SQL (tabelas, RLS, funções, índices)
6. **Criar admin**: Primeiro usuário administrador
7. **Deploy**: Redeploy automático na Vercel

O estado de instalação é persistido para retomar em caso de falha.

### Banco de Dados (Migrations)

Schema consolidado com:
- Extensões: uuid, pgcrypto, unaccent, pg_net
- Tabelas: organizations, organization_settings, boards, board_stages, deals, contacts, activities, custom_fields, deal_notes, deal_files, deal_scripts
- RLS policies por `organization_id`
- Índices de performance (compostos para Kanban, deals abertos, etc.)

### Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Iniciar servidor produção |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Testes em modo watch |
| `npm run test:run` | Testes (execução única) |
| `npm run precheck` | lint + typecheck + test + build |
| `npm run precheck:fast` | lint + typecheck + test (sem build) |

---

## Realtime (Sincronização em Tempo Real)

Todo o CRM sincroniza em tempo real via Supabase Realtime:

| Tabela | Eventos |
|--------|---------|
| deals | INSERT, UPDATE, DELETE |
| contacts | INSERT, UPDATE, DELETE |
| activities | INSERT, UPDATE, DELETE |
| board_stages | INSERT, UPDATE, DELETE |

**Estratégia:**
- INSERT: Adição imediata ao cache (sem debounce)
- UPDATE/DELETE: Debounce de 300ms (evita "piscar" da UI)
- Deduplicação: Map com TTL de 5 segundos para evitar duplicatas
- Cache TanStack Query atualizado automaticamente

---

## Resumo: Tudo Que o Sistema Faz

| Funcionalidade | Descrição |
|----------------|-----------|
| **Pipeline Kanban** | Pipelines visuais com drag-and-drop, estágios configuráveis, templates |
| **Deals** | CRUD completo, produtos, campos custom, probabilidade, prioridade, tags |
| **Automações** | Mover deal → atualiza contato, cria deal em próximo board, registra histórico |
| **Contatos** | CRUD, lifecycle stages, import/export CSV, busca, filtros, bulk delete |
| **Empresas** | Cadastro de empresas clientes, vínculo com contatos |
| **Atividades** | Ligações, reuniões, emails, tarefas, notas, calendar view |
| **Inbox** | Briefing diário, lista priorizada, modo focus/cockpit |
| **Sugestões de IA** | Upsell, rescue, stalled deals — detectadas automaticamente |
| **Chat com IA** | 50+ ferramentas, streaming, multi-provider, contexto de board/deal |
| **Tasks de IA** | Email draft, objeções, análise de deal, geração de board |
| **Decision Queue** | Fila priorizada de decisões baseada em análise de patterns |
| **Dashboard** | 10+ KPIs, gráficos, período dinâmico |
| **Relatórios** | Análise detalhada, export PDF |
| **API Pública** | REST completa, OpenAPI 3.1.2, cursor pagination |
| **Webhooks** | Entrada de leads (Hotmart/n8n/Make) + follow-up outbound |
| **MCP Server** | 40+ tools para Claude/ChatGPT/LLMs externos |
| **Multi-tenant** | Isolamento total por organização (RLS + filtro em código) |
| **PWA** | Offline, install prompt, responsivo |
| **LGPD** | Consentimento versionado, revogação, audit trail |
| **Dark Mode** | Toggle com persistência |
| **Speech** | Ditado por voz no chat de IA |
| **Realtime** | Sync em tempo real com deduplicação e debounce |
| **Quick Scripts** | Templates de venda com placeholders dinâmicos |
| **Arquivos** | Upload/download em deals (Supabase Storage) |
| **Convites** | Convidar membros para a organização |
| **Installer** | Wizard automatizado (Vercel + Supabase + migrations) |
