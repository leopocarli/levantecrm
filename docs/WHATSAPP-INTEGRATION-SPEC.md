# Especificação Técnica: Integração WhatsApp — Levante CRM

> **Versão:** 2.0 — Março 2026
> **Status:** Especificação para desenvolvimento
> **Autor:** Leonardo Pocarli
> **Público-alvo:** Desenvolvedora contratada para implementação

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Opções de Provedor (BSP)](#2-opções-de-provedor-bsp)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Arquitetura Técnica](#4-arquitetura-técnica)
5. [Banco de Dados](#5-banco-de-dados)
6. [API Routes](#6-api-routes)
7. [Interface do Usuário](#7-interface-do-usuário)
8. [Coexistência com WhatsApp no Celular](#8-coexistência-com-whatsapp-no-celular)
9. [Realtime e Cache](#9-realtime-e-cache)
10. [Segurança](#10-segurança)
11. [Dificuldades e Cuidados](#11-dificuldades-e-cuidados)
12. [Ordem de Implementação Sugerida](#12-ordem-de-implementação-sugerida)
13. [Testes](#13-testes)
14. [Links de Referência](#14-links-de-referência)

---

## 1. Visão Geral

### O que queremos

Integrar o WhatsApp oficial dentro do Levante CRM para que nossos clientes possam:

- **Enviar e receber mensagens** WhatsApp diretamente pelo CRM
- **Gerenciar templates de mensagem** (marketing, utilidade) com aprovação da Meta
- **Enviar mensagens em massa** (broadcast) para listas de contatos
- **Ver histórico completo** de conversas WhatsApp no cockpit do deal
- **Continuar usando WhatsApp no celular** normalmente (coexistência — o celular e o CRM funcionam ao mesmo tempo)

### Princípio fundamental: zero fricção para o cliente

O cliente do Levante CRM **NÃO PODE** ter que criar apps no Meta Developer, gerar tokens, ou configurar webhooks manualmente. A experiência deve ser:

1. Clicar em **"Conectar WhatsApp"** nas configurações do CRM
2. Autorizar via **popup do Facebook** (Embedded Signup)
3. **Pronto** — sai usando

Isso é possível porque o **Levante CRM** se registra como provedor de tecnologia (Tech Provider / ISV) junto ao BSP e à Meta. O trabalho técnico pesado é feito **uma vez** pelo Levante, e cada cliente apenas autoriza.

### O que é um BSP?

BSP = Business Solution Provider. É uma empresa parceira oficial da Meta que serve como intermediário entre o seu software (Levante CRM) e a API oficial do WhatsApp. O BSP simplifica:

- O onboarding do cliente (Embedded Signup em vez de criar app)
- A API de envio/recebimento (API mais simples)
- A gestão de templates (interface unificada)
- Os webhooks (formato padronizado)

**Não usamos API não-oficial** (Z-API, Evolution API, etc.) — são instáveis, arriscam banimento do número e não suportam coexistência real.

---

## 2. Opções de Provedor (BSP)

A escolha do BSP é flexível. Abaixo estão as opções pesquisadas, mas **a desenvolvedora tem liberdade para pesquisar e propor outras opções** se encontrar algo mais adequado em termos de custo, documentação ou facilidade de integração. O importante é que o BSP escolhido atenda aos requisitos:

- ✅ API oficial da Meta (Cloud API)
- ✅ Embedded Signup (onboarding sem fricção)
- ✅ Coexistência (celular + API simultâneos)
- ✅ Suporte a templates com aprovação Meta
- ✅ SDK ou API REST bem documentada
- ✅ Webhooks para mensagens recebidas e status de entrega
- ✅ Programa ISV/Tech Provider (para integrar clientes em escala)

### Opção A: Twilio (recomendação inicial)

| Aspecto | Detalhe |
|---------|---------|
| O que é | Plataforma de comunicação com SDK para WhatsApp, SMS, Voice |
| Programa | WhatsApp Tech Provider Program |
| Onboarding do cliente | Embedded Signup integrado (popup Meta dentro do CRM) |
| API | REST simples — `POST /Messages` com `from: "whatsapp:+55..."` |
| SDK Node.js | `npm install twilio` — client TypeScript-ready |
| Templates | Criação e gestão via Content Template Builder API |
| Webhooks | Twilio envia para URL configurada (formato próprio, mais simples que Meta raw) |
| Custo por mensagem | ~USD 0.005 (Twilio) + taxa Meta (varia por categoria/país) |
| Coexistência | Suportada nativamente (Cloud API) |
| Tempo de setup inicial | 3-4 semanas (aprovação Meta + Twilio) |

**Documentação principal:**
- WhatsApp com Twilio: https://www.twilio.com/docs/whatsapp
- API overview: https://www.twilio.com/docs/whatsapp/api
- Tech Provider Program (ISV): https://www.twilio.com/docs/whatsapp/isv/tech-provider-program
- Integration guide ISV: https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/integration-guide
- Register senders: https://www.twilio.com/docs/whatsapp/isv/register-senders
- Senders API: https://www.twilio.com/docs/whatsapp/api/senders
- Content Template Builder: https://www.twilio.com/docs/content/content-api-resources
- Message Resource API: https://www.twilio.com/docs/messaging/api/message-resource
- SDK Node.js: https://www.twilio.com/docs/libraries/reference/twilio-node
- Sandbox (teste): https://www.twilio.com/docs/whatsapp/sandbox
- FAQ Tech Provider: https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/faq

**Vantagens:** API mais simples e bem documentada, SDK Node.js oficial, webhooks em formato limpo, suporte técnico dedicado, escalável para SMS/Voice no futuro.

**Desvantagens:** Custo extra por mensagem (~USD 0.005 sobre a taxa Meta), precisa se registrar como ISV (3-4 semanas).

---

### Opção B: Meta Cloud API Direta + Embedded Signup

| Aspecto | Detalhe |
|---------|---------|
| O que é | Integração direta com Graph API da Meta, sem intermediário |
| Onboarding do cliente | Embedded Signup (popup Meta) — implementação própria via FB JS SDK |
| API | Graph API — `POST /{phone-number-id}/messages` |
| SDK | Nenhum oficial para Node.js — wrapper manual sobre fetch |
| Templates | Gestão via Graph API Management endpoints |
| Webhooks | Meta envia raw webhook (precisa validar HMAC SHA-256) |
| Custo por mensagem | Só taxa Meta (sem intermediário) |
| Coexistência | Suportada nativamente |
| Tempo de setup | 2-4 semanas (aprovação App Meta + App Review) |

**Documentação principal:**
- Cloud API overview: https://developers.facebook.com/docs/whatsapp/cloud-api/overview
- Get started: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- Embedded Signup overview: https://developers.facebook.com/docs/whatsapp/embedded-signup
- Embedded Signup implementação: https://developers.facebook.com/docs/whatsapp/embedded-signup/implementation
- Embedded Signup flow padrão: https://developers.facebook.com/docs/whatsapp/embedded-signup/default-flow
- Send messages: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/send-messages
- Templates: https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates
- Webhooks: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
- Pricing: https://developers.facebook.com/docs/whatsapp/pricing
- Messaging limits: https://developers.facebook.com/docs/whatsapp/messaging-limits
- App review: https://developers.facebook.com/docs/whatsapp/solution-providers/app-review
- Opt-in: https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in

**Vantagens:** Sem custo de intermediário, controle total, acesso direto a todos os recursos.

**Desvantagens:** API mais complexa (Graph API verbosa), sem SDK oficial para Node.js, precisa implementar validação de webhook manualmente, gerenciamento de tokens dos clientes.

---

### Opção C: 360dialog

| Aspecto | Detalhe |
|---------|---------|
| O que é | BSP focado exclusivamente em WhatsApp |
| Onboarding do cliente | Embedded Signup via 360dialog Hub |
| API | REST — compatível com formato Cloud API da Meta |
| Custo | Mais barato que Twilio (~EUR 0.002-0.005/msg em cima da taxa Meta) |

**Documentação:** https://docs.360dialog.com

**Vantagens:** Mais barato, WhatsApp-focused, API compatível com formato da Cloud API.

**Desvantagens:** Documentação menos robusta, suporte menor, empresa menor.

---

### Opção D: Outros BSPs para pesquisar

A desenvolvedora pode avaliar outras opções como:

- **MessageBird / Bird** — https://docs.bird.com
- **Gupshup** — https://docs.gupshup.io/docs/whatsapp-overview
- **Infobip** — https://www.infobip.com/docs/whatsapp
- **Vonage (ex-Nexmo)** — https://developer.vonage.com/en/messages/overview
- **Wati** — https://docs.wati.io (focado em PMEs, pode ser mais simples)

**Critérios para avaliação:**
1. Tem programa ISV/Tech Provider com Embedded Signup?
2. API REST bem documentada com SDK Node.js?
3. Custo por mensagem (comparar com Twilio ~USD 0.005)?
4. Suporte a templates com aprovação Meta?
5. Webhooks confiáveis com validação de assinatura?
6. Suporte a mídia (imagens, docs, áudio)?
7. Comunidade e exemplos de código disponíveis?
8. Suporte para broadcast/bulk messaging?

**Se a desenvolvedora encontrar opção melhor, tem liberdade total para propor a mudança.** O código será abstraído com interface de provider (ver seção 4.3) para permitir trocar de BSP sem reescrever a aplicação.

---

## 3. Pré-requisitos (ANTES do desenvolvimento começar)

### 3.1 O que o Leonardo (eu) preciso fazer antes

**Conta no BSP escolhido:**
- Se Twilio: criar conta em https://www.twilio.com/try-twilio e fazer upgrade para paga
- Anotar credenciais (Account SID, Auth Token ou equivalente)

**Registro como Tech Provider / ISV:**
- Se Twilio: seguir https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/integration-guide
- Criar um Meta App (isso é feito **UMA VEZ** pelo Levante CRM, **NÃO** pelo cliente)
- Submeter App para review da Meta (permissões: `whatsapp_business_management`, `whatsapp_business_messaging`)
- O BSP vincula o Meta App como Partner Solution
- **Tempo estimado: 3-4 semanas** — iniciar imediatamente

**Meta Business Manager do Levante CRM:**
- Ter Portfólio Empresarial verificado: https://business.facebook.com
- Verificação do negócio (documentos CNPJ, site, etc.)

### 3.2 Variáveis de ambiente para o CRM

```env
# .env.local — credenciais do BSP (server-side only, NUNCA expor no client)

# Se Twilio:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Se Meta direta:
META_APP_ID=xxxxxxxxxxxx
META_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook (para ambos):
WHATSAPP_WEBHOOK_VERIFY_TOKEN=um-token-secreto-aleatorio

# URL pública do CRM (para configurar webhooks):
NEXT_PUBLIC_APP_URL=https://app.levantecrm.com
```

---

## 4. Arquitetura Técnica

### 4.1 Stack existente (contexto importante)

O Levante CRM já existe e tem a seguinte stack. **A desenvolvedora deve ler o arquivo `.github/copilot-instructions.md` para entender todas as convenções.**

| Tecnologia | Uso | Observação |
|-----------|-----|------------|
| Next.js 16 | Framework (App Router) | Páginas em `app/`, componentes em `components/` e `features/` |
| React 19 | UI | |
| TypeScript | Linguagem | Strict mode |
| Supabase | Banco (PostgreSQL) + Auth + Realtime + Storage | RLS obrigatório, multi-tenant |
| TanStack Query | Cache e estado de dados | Query keys centralizadas em `lib/query/` |
| Tailwind CSS v4 | Estilos | + Radix UI para componentes base |
| Vitest | Testes | + React Testing Library. Testes ao lado do código (`*.test.ts(x)`) |
| Vercel AI SDK v6 | Chat IA | Streaming, multi-provider |

**Convenções importantes:**
- Imports sempre com alias `@/` (ex: `@/lib/whatsapp/client`)
- Componentes compartilhados em `components/`, fluxos de negócio em `features/`
- Auth via proxy (`proxy.ts` + `lib/supabase/middleware.ts`)
- **Multi-tenant:** TODA query DEVE filtrar por `organization_id`. RLS em TODAS as tabelas.
- Testes: `npm run test` (watch), `npm run test:run` (single), `npm run precheck` (lint + typecheck + test)

### 4.2 Fluxo geral da integração

```
┌─────────────────────────────────────────────────────────────────┐
│                        ONBOARDING                                │
│                                                                  │
│  [Cliente no CRM] → Clica "Conectar WhatsApp"                   │
│         ↓                                                        │
│  [Popup Embedded Signup da Meta] → Cliente autoriza              │
│         ↓                                                        │
│  [Callback retorna WABA ID + Phone Number]                       │
│         ↓                                                        │
│  [Frontend envia para POST /api/whatsapp/channels]               │
│         ↓                                                        │
│  [API registra sender no BSP + configura webhook]                │
│         ↓                                                        │
│  Canal CONNECTED ✅                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MENSAGEM RECEBIDA                             │
│                                                                  │
│  [Cliente WhatsApp envia msg] → Meta → BSP → Webhook            │
│         ↓                                                        │
│  [POST /api/whatsapp/webhook]                                    │
│         ↓                                                        │
│  Valida assinatura → Identifica org pelo phone number            │
│         ↓                                                        │
│  Busca/cria conversation → Auto-linka contact por E.164          │
│         ↓                                                        │
│  Insere message (INBOUND) → Atualiza conversation                │
│         ↓                                                        │
│  Supabase Realtime → UI atualiza em tempo real                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MENSAGEM ENVIADA                               │
│                                                                  │
│  [Vendedor digita no CRM] → POST /api/whatsapp/conversations/   │
│         ↓                                            .../messages│
│  Verifica janela de 24h:                                         │
│    • Aberta → envia texto livre (grátis)                         │
│    • Fechada → só template (cobrado)                             │
│         ↓                                                        │
│  Chama API do BSP → Insere message (OUTBOUND)                   │
│         ↓                                                        │
│  Webhook de status → SENT → DELIVERED → READ                    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Camada de abstração de provider

**IMPORTANTE:** O código deve ser escrito com uma camada de abstração para permitir trocar de BSP sem reescrever a aplicação.

```typescript
// lib/whatsapp/types.ts — Interface que TODO provider deve implementar

interface WhatsAppProvider {
  // Enviar mensagens
  sendTextMessage(to: string, body: string, channelId: string): Promise<SendResult>;
  sendTemplateMessage(to: string, templateName: string, language: string, 
    variables: Record<string, string>, channelId: string): Promise<SendResult>;
  sendMediaMessage(to: string, mediaUrl: string, mediaType: string, 
    caption?: string, channelId: string): Promise<SendResult>;
  
  // Templates
  getTemplates(channelId: string): Promise<Template[]>;
  createTemplate(data: CreateTemplateData): Promise<Template>;
  deleteTemplate(templateName: string, channelId: string): Promise<void>;
  
  // Status
  markAsRead(externalMessageId: string, channelId: string): Promise<void>;
  
  // Onboarding
  registerSender(phoneNumber: string, wabaId: string, ...data: any[]): Promise<Channel>;
}

// lib/whatsapp/providers/twilio.ts    — implementação Twilio
// lib/whatsapp/providers/meta.ts      — implementação Meta direta (futuro)
// lib/whatsapp/providers/360dialog.ts — implementação 360dialog (futuro)
```

A aplicação usa `WhatsAppProvider` em todos os lugares, nunca chama Twilio/Meta diretamente. Para trocar de BSP, basta criar nova implementação e mudar a factory.

---

## 5. Banco de Dados

### 5.1 Nova migration Supabase

Criar arquivo: `supabase/migrations/YYYYMMDD_whatsapp_integration.sql`

Todas as tabelas têm `organization_id` obrigatório e RLS habilitado.

```sql
-- ============================================================
-- WHATSAPP CHANNELS
-- Canal WhatsApp conectado. Um por organização (pode expandir para múltiplos no futuro).
-- ============================================================
CREATE TABLE whatsapp_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Dados do BSP (genérico — preencher conforme provider)
  provider TEXT NOT NULL DEFAULT 'twilio',          -- 'twilio', 'meta', '360dialog', etc.
  provider_account_id TEXT,                          -- Ex: Twilio Account SID
  provider_sender_id TEXT,                           -- Ex: Twilio Sender SID
  provider_config JSONB DEFAULT '{}',                -- Config adicional específica do provider
  
  -- Dados da Meta/WABA
  waba_id TEXT NOT NULL,                             -- WhatsApp Business Account ID
  phone_number_id TEXT,                              -- Phone Number ID na Meta
  display_phone_number TEXT NOT NULL,                -- Número formatado (+5511999999999)
  business_name TEXT,                                -- Nome do negócio no WhatsApp
  
  -- Status
  status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR')),
  error_message TEXT,
  
  -- Config
  coexistence_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE whatsapp_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON whatsapp_channels
  USING (organization_id = (auth.jwt()->>'organization_id')::UUID);

CREATE INDEX idx_whatsapp_channels_org ON whatsapp_channels(organization_id);
CREATE INDEX idx_whatsapp_channels_phone ON whatsapp_channels(display_phone_number);

-- ============================================================
-- WHATSAPP TEMPLATES
-- Templates sincronizados com a Meta (via BSP ou diretamente).
-- ============================================================
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES whatsapp_channels(id) ON DELETE CASCADE,
  
  -- Dados do template
  external_template_id TEXT,                         -- ID no BSP/Meta
  name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt_BR',
  category TEXT NOT NULL 
    CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'DISABLED')),
  rejection_reason TEXT,
  
  -- Conteúdo
  -- components é array de objetos: [{type: "HEADER", ...}, {type: "BODY", text: "Olá {{1}}", ...}]
  components JSONB NOT NULL DEFAULT '[]',
  -- variables mapeia variáveis: [{key: "1", example: "João", mapping: "contact.name"}, ...]
  variables JSONB DEFAULT '[]',
  
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON whatsapp_templates
  USING (organization_id = (auth.jwt()->>'organization_id')::UUID);

-- ============================================================
-- CONVERSATIONS
-- Thread de mensagens entre a empresa e um contato.
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES whatsapp_channels(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  
  -- Dados do participante externo
  external_phone TEXT NOT NULL,                       -- Número do contato em E.164
  external_name TEXT,                                  -- Nome do profile WhatsApp
  
  -- Estado da conversa
  assigned_user_id UUID,                               -- Vendedor responsável
  status TEXT NOT NULL DEFAULT 'OPEN' 
    CHECK (status IN ('OPEN', 'PENDING', 'RESOLVED', 'SNOOZED')),
  
  -- Cache para listagem rápida (evita JOINs pesados)
  last_message_at TIMESTAMPTZ DEFAULT now(),
  last_message_preview TEXT,                           -- Texto curto da última msg
  unread_count INTEGER DEFAULT 0,
  
  -- Janela de atendimento ao cliente (24h desde última msg do cliente)
  customer_service_window_expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Uma conversa por contato por canal (evita duplicatas)
  UNIQUE(channel_id, external_phone)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON conversations
  USING (organization_id = (auth.jwt()->>'organization_id')::UUID);

CREATE INDEX idx_conversations_org_status 
  ON conversations(organization_id, status, last_message_at DESC);
CREATE INDEX idx_conversations_contact ON conversations(contact_id);
CREATE INDEX idx_conversations_deal ON conversations(deal_id) WHERE deal_id IS NOT NULL;

-- ============================================================
-- MESSAGES
-- Mensagem individual dentro de uma conversa.
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Direção e tipo
  direction TEXT NOT NULL CHECK (direction IN ('INBOUND', 'OUTBOUND')),
  type TEXT NOT NULL CHECK (type IN (
    'TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 
    'TEMPLATE', 'INTERACTIVE', 'LOCATION', 'STICKER', 'REACTION'
  )),
  
  -- Conteúdo
  content TEXT,                                        -- Texto da mensagem
  media_url TEXT,                                      -- URL da mídia (Supabase Storage)
  media_mime_type TEXT,
  media_filename TEXT,
  
  -- Se for template
  template_name TEXT,
  template_variables JSONB,
  
  -- Status de entrega
  delivery_status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (delivery_status IN ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED')),
  error_code TEXT,
  error_message TEXT,
  
  -- ID externo (para dedup e tracking de status)
  external_message_id TEXT UNIQUE,                     -- Twilio SID ou wamid da Meta
  
  -- Quem enviou (se OUTBOUND, qual vendedor)
  sent_by_user_id UUID,
  sent_from_phone BOOLEAN DEFAULT false,               -- true = enviada pelo celular (coexistência)
  
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON messages
  USING (organization_id = (auth.jwt()->>'organization_id')::UUID);

CREATE INDEX idx_messages_conversation 
  ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_external_id 
  ON messages(external_message_id) WHERE external_message_id IS NOT NULL;

-- ============================================================
-- BROADCAST CAMPAIGNS
-- Campanha de envio em massa.
-- ============================================================
CREATE TABLE broadcast_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES whatsapp_channels(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES whatsapp_templates(id),
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'DRAFT' 
    CHECK (status IN ('DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Contadores (atualizados em tempo real durante envio)
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  -- Filtros usados para selecionar a audiência (para auditoria/reprodução)
  audience_filters JSONB,
  
  created_by_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE broadcast_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON broadcast_campaigns
  USING (organization_id = (auth.jwt()->>'organization_id')::UUID);

-- ============================================================
-- BROADCAST RECIPIENTS
-- Cada destinatário individual de uma campanha.
-- ============================================================
CREATE TABLE broadcast_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES broadcast_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  phone_number TEXT NOT NULL,
  
  -- Variáveis do template personalizadas para este contato
  template_variables JSONB,
  
  -- Estado individual
  status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'SKIPPED')),
  external_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE broadcast_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_isolation" ON broadcast_recipients
  USING (campaign_id IN (
    SELECT id FROM broadcast_campaigns 
    WHERE organization_id = (auth.jwt()->>'organization_id')::UUID
  ));

CREATE INDEX idx_broadcast_recipients_campaign 
  ON broadcast_recipients(campaign_id, status);

-- ============================================================
-- ADICIONAR CAMPOS NA TABELA CONTACTS EXISTENTE
-- ============================================================
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT false;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS whatsapp_opt_in_at TIMESTAMPTZ;

-- ============================================================
-- HABILITAR SUPABASE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 5.2 Tabelas existentes relevantes

A desenvolvedora deve consultar `supabase/migrations/20251201000000_schema_init.sql` e `types/types.ts` para entender a estrutura existente. Os pontos mais relevantes:

- **`contacts`** — tem campo `phone` (TEXT, formato livre). Usar `lib/phone.ts` → `normalizePhoneE164()` para normalizar e fazer matching
- **`deals`** — tem `contactId` que liga ao contato. Usado para exibir conversas no cockpit
- **`activities`** — tabela de atividades. Pode-se registrar atividade tipo 'WHATSAPP' no feed do deal
- **`organizations`** — tenant. `organization_id` em TODAS as queries

---

## 6. API Routes

### 6.1 Webhook do BSP

**Arquivo:** `app/api/whatsapp/webhook/route.ts`

```
GET  /api/whatsapp/webhook    — Verificação (Meta/BSP envia challenge)
POST /api/whatsapp/webhook    — Recebe mensagens e status updates
```

**⚠️ Esta rota é PÚBLICA.** Não usa auth Supabase. Segurança via validação de assinatura do BSP.

**Lógica do POST (mensagem recebida):**

1. **Validar assinatura** (Twilio: `twilio.validateRequest()` / Meta: HMAC SHA-256 do `X-Hub-Signature-256`)
2. **Extrair dados:** phone do remetente, phone do destinatário (nosso canal), texto, mídia
3. **Identificar organização:** buscar `whatsapp_channels` pelo phone number do destinatário (usando service role)
4. **Buscar ou criar conversation:** UPSERT por `(channel_id, external_phone)`
5. **Auto-linkar contact:** buscar contact por phone normalizado na mesma org. Se não encontrar, criar contact automaticamente com nome do profile WhatsApp
6. **Inserir message:** `direction = 'INBOUND'`
7. **Atualizar conversation:** `last_message_at`, `unread_count++`, `customer_service_window_expires_at = now + 24h`
8. **Retornar 200** rapidamente (BSP espera resposta < 5s)

**Lógica do POST (status update):**

1. Validar assinatura
2. Extrair `external_message_id` e novo `status`
3. Buscar message e atualizar `delivery_status`
4. Se broadcast: atualizar `broadcast_recipients` e contadores da campaign
5. Aceitar apenas progressão de status (PENDING → SENT → DELIVERED → READ, nunca retroceder)

**Mídia recebida:**
- O BSP fornece URL temporária da mídia
- Baixar imediatamente e salvar no Supabase Storage (URLs expiram!)
- Salvar URL do Storage na coluna `media_url`

### 6.2 Canais

**Arquivos:** `app/api/whatsapp/channels/route.ts` + `app/api/whatsapp/channels/[id]/route.ts`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/whatsapp/channels` | Registrar novo canal (após Embedded Signup) |
| GET | `/api/whatsapp/channels` | Listar canais da organização |
| PATCH | `/api/whatsapp/channels/[id]` | Atualizar configurações |
| DELETE | `/api/whatsapp/channels/[id]` | Desconectar canal |
| POST | `/api/whatsapp/channels/[id]/test` | Enviar mensagem de teste |

**POST (após Embedded Signup):**
1. Recebe `wabaId`, `phoneNumberId`, `displayPhoneNumber`, `businessName` do frontend
2. Chama BSP API para registrar sender e configurar webhook apontando para `/api/whatsapp/webhook`
3. Salva canal no banco com `status = 'CONNECTED'`
4. Retorna canal criado

### 6.3 Templates

**Arquivo:** `app/api/whatsapp/templates/route.ts`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/whatsapp/templates` | Listar templates da org |
| POST | `/api/whatsapp/templates` | Criar template (submete para aprovação Meta) |
| DELETE | `/api/whatsapp/templates/[id]` | Deletar template |
| POST | `/api/whatsapp/templates/sync` | Forçar sincronização com Meta |

**Importante sobre templates:**
- Templates precisam ser **aprovados pela Meta** antes de poder usar
- Aprovação pode levar de **minutos a 24h+**
- Podem ser **rejeitados** (conteúdo spam, falta opt-out, etc.)
- A UI deve mostrar status claramente (badge colorido)
- Botão "Sincronizar" faz re-fetch do status atual via API do BSP

### 6.4 Conversas e Mensagens

**Arquivo:** `app/api/whatsapp/conversations/route.ts` + subpastas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/whatsapp/conversations` | Listar conversas (com filtros) |
| GET | `/api/whatsapp/conversations/[id]` | Detalhes + mensagens paginadas |
| PATCH | `/api/whatsapp/conversations/[id]` | Atualizar (status, atribuição, deal) |
| POST | `/api/whatsapp/conversations/[id]/messages` | Enviar mensagem |
| POST | `/api/whatsapp/conversations/[id]/read` | Marcar como lida |

**POST messages (enviar):**
1. Verificar se `customer_service_window_expires_at > now()`
2. **Se janela aberta:** pode enviar texto livre, mídia, etc. (grátis)
3. **Se janela fechada:** REJEITAR texto livre com erro explicativo. Só aceitar se `template_name` foi fornecido
4. Chamar API do BSP
5. Inserir message: `direction = 'OUTBOUND'`, `delivery_status = 'PENDING'`
6. Atualizar `conversation.last_message_at`

### 6.5 Broadcast

**Arquivo:** `app/api/whatsapp/broadcasts/route.ts`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/whatsapp/broadcasts` | Criar campanha |
| GET | `/api/whatsapp/broadcasts` | Listar campanhas |
| GET | `/api/whatsapp/broadcasts/[id]` | Detalhes + recipients |
| PATCH | `/api/whatsapp/broadcasts/[id]` | Editar (antes de enviar) |
| POST | `/api/whatsapp/broadcasts/[id]/send` | Iniciar envio |
| POST | `/api/whatsapp/broadcasts/[id]/cancel` | Cancelar |

**POST send:**
1. Validar que template está `APPROVED`
2. Validar que todos recipients têm `whatsapp_opt_in = true`
3. Marcar campaign `status = 'SENDING'`
4. Loop com rate limiting (~50 msg/s, com pausa entre batches):
   - Para cada recipient: chamar API do BSP com template + variáveis
   - Atualizar `broadcast_recipients.status` e `campaign.sent_count`
5. Ao finalizar: `status = 'COMPLETED'`
6. Se erro fatal: `status = 'FAILED'`

**Rate limiting:** Mesmo que o BSP faça rate limiting interno, implementar controle no lado do CRM (usar `setTimeout` entre batches de 50) para não sobrecarregar a API.

### 6.6 Auth de todas as rotas

- **Webhook:** PÚBLICA, segurança via validação de assinatura do BSP
- **Todas as outras:** autenticadas via session Supabase (padrão do CRM)
- **Filtro `organization_id`** em TODAS as queries sem exceção

---

## 7. Interface do Usuário

### 7.1 Configurações — Conectar WhatsApp

**Nova pasta:** `features/settings/whatsapp/`

**Tela principal** (card na página de settings):

Quando **não conectado:**
- Card com ícone do WhatsApp
- Título: "WhatsApp Business"
- Descrição: "Conecte seu WhatsApp para enviar e receber mensagens pelo CRM"
- Botão grande verde: **"Conectar WhatsApp"**

Quando **conectado:**
- Card com check verde
- Mostra: número (+55 11 99999-9999), nome do negócio, status
- Botões: "Desconectar", "Enviar teste"

**Fluxo do Embedded Signup (ao clicar "Conectar"):**

1. Carregar SDK do Facebook no client:
```html
<script src="https://connect.facebook.net/en_US/sdk.js"></script>
```

2. Chamar `FB.login()` com escopo adequado:
```javascript
FB.login(function(response) {
  // response.authResponse.code → enviar pro backend
}, {
  config_id: '<CONFIG_ID>',
  response_type: 'code',
  override_default_response_type: true,
  extras: {
    setup: { /* pre-filled data se tiver */ },
    featureType: '',
    sessionInfoVersion: '3',
  }
});
```

3. O popup da Meta abre — cliente autoriza
4. Callback retorna `code` + dados da WABA
5. Frontend envia para `POST /api/whatsapp/channels`
6. Mostra sucesso + envia mensagem de teste

**Referência de implementação:**
- https://developers.facebook.com/docs/whatsapp/embedded-signup/implementation

**Tela de Templates** (sub-página ou tab):

- **Lista:** tabela com nome, categoria (badge MARKETING/UTILITY), status (badge colorido: Aprovado=verde, Pendente=amarelo, Rejeitado=vermelho), idioma
- **Botão "Sincronizar com Meta":** re-fetch de status via API
- **Botão "Criar Template"** → modal com:
  - Nome (slug, sem espaços)
  - Categoria (select: Marketing, Utilidade, Autenticação)
  - Idioma (select, padrão `pt_BR`)
  - Header (opcional): texto ou imagem
  - Corpo (textarea): suporta `{{1}}`, `{{2}}` como variáveis
  - Footer (opcional)
  - Botões (opcional): CTA ou Quick Reply
  - **Preview visual** à direita simulando bolha do WhatsApp
  - Exemplos obrigatórios para cada variável (Meta exige)
  - Botão "Submeter para aprovação"

### 7.2 Chat no Cockpit do Deal

**Arquivo a modificar:** `features/deals/cockpit/DealCockpitClient.tsx`

O cockpit já tem um sistema de tabs:
```typescript
type Tab = 'chat' | 'notas' | 'scripts' | 'arquivos';
```

**Adicionar nova tab `'conversas'`:**

1. Alterar type: `type Tab = 'chat' | 'notas' | 'scripts' | 'arquivos' | 'conversas';`
2. Adicionar botão de tab com ícone de mensagem + badge de unread
3. Renderizar `<DealConversations>` quando selecionada

**Novos componentes a criar:**

**`features/deals/cockpit/components/DealConversations.tsx`**
- Busca conversas onde `deal_id` = deal atual OU onde `contact.phone` = contato do deal
- Se nenhuma: "Nenhuma conversa WhatsApp. Enviar primeira mensagem?" com botão
- Se tem: lista com preview da última msg, timestamp, badge de unread
- Click em conversa abre thread inline

**`features/deals/cockpit/components/ConversationThread.tsx`**
- Scroll infinito (mais recentes embaixo, carregar antigas para cima)
- Layout de chat:
  - **INBOUND** (mensagens do cliente): bolha cinza à esquerda
  - **OUTBOUND** (mensagens da empresa): bolha verde/azul à direita
- Status de entrega: ✓ enviada, ✓✓ entregue, ✓✓(azul) lida, ✗ falhou
- Suporte a mídia: imagens com thumbnail, docs com ícone+nome, áudio com player
- Timestamps agrupados por dia ("Hoje", "Ontem", "15 de Mar")
- Barra de alerta da janela:
  - Verde: "Janela aberta — Xh restantes" (pode enviar texto)
  - Amarelo: "Janela fechada — somente templates" (bloqueia texto)
- Mensagens do celular: badge sutil "📱 Celular" vs "💻 CRM"

**`features/deals/cockpit/components/MessageInput.tsx`**
- **Dentro da janela:** campo de texto + botão enviar + botão anexar mídia
- **Fora da janela:** campo desabilitado + botão "📋 Enviar Template"
- Botão template: abre `TemplatePicker`
- Botão "🤖 Sugerir resposta": usa IA do CRM (integra com `components/ai/UIChat.tsx`) para sugerir resposta baseada no contexto do deal
- Upload de mídia: arrasta ou clica, sobe para Supabase Storage, envia URL via API

**`features/deals/cockpit/components/TemplatePicker.tsx`**
- Modal/dropdown que lista templates `APPROVED`, agrupados por categoria
- Ao selecionar: mostra preview com campos para preencher variáveis
- Auto-preencher variáveis do deal/contact quando possível (nome, empresa, valor)
- Botão "Enviar" com preview final do que vai ser enviado

### 7.3 Inbox de Mensagens

**Arquivo a evoluir:** `features/inbox/InboxPage.tsx`

O inbox existente é focado em atividades/sugestões. Adicionar seção de **"Conversas WhatsApp"**:

- **Layout split-view:** lista de conversas (esquerda ~40%) + thread de mensagens (direita ~60%)
- **Lista:** foto do contato, nome, preview da última msg, timestamp, badge de unread
- **Filtros:** Todas, Abertas, Minhas (assigned = eu), Pendentes, Resolvidas
- **Busca:** por nome do contato ou conteúdo da mensagem
- **Ações rápidas:** "Atribuir a mim", "Resolver", "Vincular a deal"
- **Realtime:** nova mensagem move conversa para o topo + som/notificação

### 7.4 Evolução do MessageComposerModal

**Arquivo:** `features/inbox/components/MessageComposerModal.tsx`

Esse modal hoje abre `wa.me/` via link externo. Evoluir:
- Se canal WhatsApp está conectado na organização: **enviar via API** (real, dentro do CRM)
- Se não conectado: manter comportamento atual (abre wa.me/) como fallback
- Mostrar toast de sucesso/falha no envio via API

### 7.5 Broadcast (Mensagens em Massa)

**Nova página/componente**

**Lista de campanhas:** tabela com nome, template, status, data, estatísticas (enviadas/entregues/lidas/falhas)

**Botão "Nova Campanha"** → wizard de 4 passos:

**Passo 1 — Selecionar Template:**
- Mostrar apenas templates com status `APPROVED`
- Preview do template selecionado

**Passo 2 — Selecionar Audiência:**
- Filtros: status do contato, stage, tags, custom fields
- Preview: "127 contatos selecionados, 115 com opt-in ativo"
- Excluir automaticamente: sem telefone, sem opt-in
- Alertar sobre descartados

**Passo 3 — Mapear Variáveis:**
- Para cada `{{N}}` no template, selecionar campo do contato/deal
- Ex: `{{1}}` → Nome do contato, `{{2}}` → Nome da empresa
- Preview com dados de 3 contatos aleatórios

**Passo 4 — Confirmar:**
- Resumo completo: template, audiência, variáveis
- Estimativa de custo (quantidade × taxa aproximada por msg no Brasil)
- Opção: "Enviar agora" ou "Agendar para" (date picker)
- Botão "Confirmar e Enviar"

**Dashboard da campanha em andamento:**
- Barra de progresso
- Contadores em tempo real: Enviadas, Entregues, Lidas, Falhas
- Botão "Cancelar" durante envio

---

## 8. Coexistência com WhatsApp no Celular

### Como funciona (explicação para incluir na UI)

A API oficial da Meta (Cloud API) suporta **nativamente** o modo de coexistência desde 2024:

- O vendedor continua usando WhatsApp **normalmente** no celular
- Mensagens enviadas **pelo celular** aparecem no CRM automaticamente (via webhook)
- Mensagens enviadas **pelo CRM** aparecem no celular automaticamente
- **Não precisa escanear QR code**
- **Não desconecta o celular**
- Isso é diferente das APIs não-oficiais (Z-API, etc.) que desconectam o celular

### Implementação no CRM

- Detectar mensagens que foram enviadas pelo celular (metadata no webhook) e marcar `sent_from_phone = true`
- Exibir badge visual:
  - "📱" para mensagens enviadas pelo celular
  - "💻" para mensagens enviadas pelo CRM
- Toggle informativo nas configurações: "O WhatsApp funciona simultaneamente no celular e no CRM"

---

## 9. Realtime e Cache

### 9.1 Estender useRealtimeSync

**Arquivo:** `lib/realtime/useRealtimeSync.ts`

O hook já suporta tabelas como `deals`, `contacts`, `activities`. Adicionar:
- `'conversations'` → invalidar query keys de conversas
- `'messages'` → invalidar query keys de mensagens da conversa

Ver como `deals` é tratado no hook para replicar o padrão (INSERT imediato, UPDATE/DELETE com debounce).

### 9.2 TanStack Query keys

**Arquivo:** `lib/query/index.tsx` (ou criar `lib/query/whatsapp.ts`)

```typescript
export const whatsappKeys = {
  channels: {
    all: ['whatsapp', 'channels'] as const,
    list: () => [...whatsappKeys.channels.all, 'list'] as const,
  },
  templates: {
    all: ['whatsapp', 'templates'] as const,
    list: (channelId?: string) => [...whatsappKeys.templates.all, 'list', channelId] as const,
  },
  conversations: {
    all: ['whatsapp', 'conversations'] as const,
    list: (filters?: object) => [...whatsappKeys.conversations.all, 'list', filters] as const,
    detail: (id: string) => [...whatsappKeys.conversations.all, 'detail', id] as const,
  },
  messages: {
    all: ['whatsapp', 'messages'] as const,
    list: (conversationId: string) => [...whatsappKeys.messages.all, 'list', conversationId] as const,
  },
  broadcasts: {
    all: ['whatsapp', 'broadcasts'] as const,
    list: () => [...whatsappKeys.broadcasts.all, 'list'] as const,
    detail: (id: string) => [...whatsappKeys.broadcasts.all, 'detail', id] as const,
  },
};
```

### 9.3 Otimizações de cache

- **Ao enviar mensagem:** usar `setQueryData` para inserir imediatamente no cache (optimistic update) — feedback instantâneo
- **Ao receber via realtime:** invalidar + refetch em background
- **Regra do CRM** (ver `.github/copilot-instructions.md`): preferir `setQueryData` sobre `invalidateQueries` quando seguro

---

## 10. Segurança

### 10.1 Multi-tenant (CRÍTICO — ler isso com atenção)

O Levante CRM é multi-tenant. Cada organização vê apenas seus dados.

- **TODA** query deve filtrar por `organization_id` — sem exceção
- **RLS** habilitado em TODAS as tabelas novas (já definido no SQL acima)
- **Webhook handler:** identificar organização pelo phone number do canal (buscar `whatsapp_channels` pelo phone), NÃO confiar em dados do payload para determinar org
- **Service role** (usado no webhook handler): DEVE filtrar manualmente por `organization_id` mesmo com service role (que bypassa RLS)

### 10.2 Credenciais

- Account SID, Auth Token, App Secret: **APENAS** em variáveis de ambiente server-side
- **NUNCA** retornar nas responses da API
- Se guardar token de WABA do cliente (Cloud API direta): criptografar via pgcrypto ou Supabase Vault
- Se usando Twilio/BSP: eles gerenciam os tokens — não precisa guardar

### 10.3 Webhook

- Validar assinatura em **CADA** request do webhook
  - Twilio: usar `twilio.validateRequest(authToken, signature, url, params)`
  - Meta: HMAC SHA-256 do payload com App Secret no header `X-Hub-Signature-256`
- Sem validação = qualquer pessoa pode postar mensagens falsas
- URL deve ser HTTPS (produção em Vercel já é)

### 10.4 Opt-in (consentimento)

- Broadcast **só** envia para contatos com `whatsapp_opt_in = true`
- A UI deve orientar o vendedor que precisa ter consentimento do contato
- Registrar quando opt-in foi dado (`whatsapp_opt_in_at`)
- Enviar sem opt-in pode levar a banimento do número pela Meta

---

## 11. Dificuldades e Cuidados

| Desafio | O que é | Como resolver |
|---------|---------|---------------|
| **Registro como Tech Provider** | Precisa registrar Levante CRM como ISV no BSP + Meta | Fazer ANTES do dev começar. 3-4 semanas |
| **Aprovação de templates** | Meta analisa cada template (minutos a 24h+), pode rejeitar | UI de status, re-sync, orientar sobre regras da Meta |
| **Janela de 24h** | Fora da janela, só templates (cobrados) | UI clara: bloquear texto livre fora da janela, sugerir template |
| **Custos por mensagem** | Marketing ~R$0,50-1,00/msg, Utilidade ~R$0,15-0,25/msg (Brasil) | Estimativa antes do broadcast, dashboard de gastos |
| **Rate limits** | 80 msg/s por número, 1 msg/6s por mesmo destinatário | Rate limiting no broadcast (50 msg/s), retry com backoff |
| **Webhooks fora de ordem** | BSP pode enviar status desordenados | Aceitar apenas progressão (SENT→DELIVERED ok, DELIVERED→SENT ignorar) |
| **Dedup de webhooks** | Mesmo webhook pode chegar 2x | UNIQUE constraint em `external_message_id` |
| **Mídia temporária** | URLs de mídia do BSP/Meta expiram | Baixar e salvar no Supabase Storage imediatamente no webhook |
| **Telefones mal formatados** | Contatos com DDD sem +55, formato inconsistente | Normalizar sempre via `normalizePhoneE164()` de `lib/phone.ts` |
| **Contato duplicado** | Mesmo telefone em contatos diferentes | Buscar por phone normalizado, usar o primeiro encontrado, alertar se ambíguo |
| **Verificação de negócio** | Cliente pode não ter Meta Business Manager verificado | Guiar na UI com instruções passo a passo |

---

## 12. Ordem de Implementação Sugerida

A ordem abaixo é uma sugestão. A desenvolvedora pode reorganizar conforme achar melhor, desde que as dependências sejam respeitadas.

### Sprint 1: Fundação (banco + backend core)
1. ✅ Migration SQL (tabelas + RLS + indexes)
2. ✅ Tipos TypeScript (`lib/whatsapp/types.ts` — interface WhatsAppProvider + tipos de dados)
3. ✅ Implementação do provider BSP escolhido (`lib/whatsapp/providers/`)
4. ✅ Webhook handler (`app/api/whatsapp/webhook/route.ts`)
5. ✅ API de canais (`app/api/whatsapp/channels/`)

### Sprint 2: Mensagens core (enviar/receber)
6. ✅ API de conversas + envio de mensagens
7. ✅ Componente ConversationThread (UI de chat com bolhas)
8. ✅ Componente MessageInput (compositor com detecção de janela)
9. ✅ Realtime (estender useRealtimeSync + query keys)
10. ✅ Hooks TanStack Query para whatsapp

### Sprint 3: Configurações + Cockpit
11. ✅ Tela de configuração WhatsApp com Embedded Signup
12. ✅ Tab "Conversas" no cockpit do deal
13. ✅ DealConversations + integração com thread
14. ✅ Evolução do MessageComposerModal (enviar via API)

### Sprint 4: Templates + Inbox
15. ✅ API de templates (CRUD + sync com Meta)
16. ✅ UI de gerenciamento de templates (lista + criação + preview)
17. ✅ TemplatePicker no cockpit (com auto-preenchimento)
18. ✅ Inbox de conversas (split-view lista + thread)

### Sprint 5: Broadcast + Polimento
19. ✅ API de broadcast (campanhas + recipients)
20. ✅ UI de criação de campanha (wizard 4 passos)
21. ✅ Execução de broadcast com rate limiting
22. ✅ Dashboard de campanha em tempo real
23. ✅ Testes, polimento, documentação inline

---

## 13. Testes

### 13.1 Unitários (Vitest)

- `lib/whatsapp/providers/twilio.test.ts` — mock da API Twilio, testar todas as funções do provider
- `lib/whatsapp/webhookHandler.test.ts` — testar com payloads fixture reais do BSP
- Normalização de telefone: edge cases (+55, DDD, sem código país, com espaços)
- Lógica de janela de 24h: verificar bloqueio de texto livre

### 13.2 Integração

- Webhook com assinatura inválida → deve retornar 403
- Webhook com assinatura válida → deve criar conversa e mensagem
- Envio fora da janela com texto livre → deve rejeitar com erro claro
- Envio fora da janela com template → deve aceitar
- Broadcast com contatos sem opt-in → deve pular (status SKIPPED)
- Buscar conversas de outra org → deve retornar vazio (RLS)

### 13.3 E2E Manual

- Conectar número de teste (Sandbox do BSP ou número real)
- Enviar template e verificar entrega no WhatsApp do celular
- Receber mensagem de um celular e verificar aparece no inbox do CRM
- Enviar texto livre dentro da janela
- Verificar bloqueio fora da janela
- Broadcast para 3+ contatos
- Coexistência: enviar pelo celular, verificar que aparece no CRM

### 13.4 Validação obrigatória antes de entregar

```bash
npm run lint         # zero warnings
npm run typecheck    # sem erros TS
npm run test:run     # todos passando
npm run precheck     # tudo acima de uma vez
```

---

## 14. Links de Referência Completos

### BSP — Twilio (recomendação inicial)

| Recurso | URL |
|---------|-----|
| WhatsApp com Twilio | https://www.twilio.com/docs/whatsapp |
| API overview | https://www.twilio.com/docs/whatsapp/api |
| Quick start | https://www.twilio.com/docs/whatsapp/quickstart |
| Tech Provider (ISV) | https://www.twilio.com/docs/whatsapp/isv/tech-provider-program |
| Integration guide ISV | https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/integration-guide |
| Register senders | https://www.twilio.com/docs/whatsapp/isv/register-senders |
| Senders API | https://www.twilio.com/docs/whatsapp/api/senders |
| Content Template Builder | https://www.twilio.com/docs/content/content-api-resources |
| Message Resource API | https://www.twilio.com/docs/messaging/api/message-resource |
| Webhook format | https://www.twilio.com/docs/messaging/guides/webhook-request |
| SDK Node.js | https://www.twilio.com/docs/libraries/reference/twilio-node |
| Sandbox (teste) | https://www.twilio.com/docs/whatsapp/sandbox |
| Self sign-up | https://www.twilio.com/docs/whatsapp/self-sign-up |
| FAQ ISV | https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/faq |

### Meta — Referência da API oficial

| Recurso | URL |
|---------|-----|
| Cloud API overview | https://developers.facebook.com/docs/whatsapp/cloud-api/overview |
| Get started | https://developers.facebook.com/docs/whatsapp/cloud-api/get-started |
| Embedded Signup | https://developers.facebook.com/docs/whatsapp/embedded-signup |
| Embedded Signup impl | https://developers.facebook.com/docs/whatsapp/embedded-signup/implementation |
| Embedded Signup flow | https://developers.facebook.com/docs/whatsapp/embedded-signup/default-flow |
| Send messages | https://developers.facebook.com/docs/whatsapp/cloud-api/messages/send-messages |
| Templates overview | https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates |
| Template categorization | https://developers.facebook.com/docs/whatsapp/updates-to-pricing/new-template-guidelines |
| Webhooks | https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components |
| Pricing (atualizado jul/2025) | https://developers.facebook.com/docs/whatsapp/pricing |
| Messaging limits | https://developers.facebook.com/docs/whatsapp/messaging-limits |
| App review | https://developers.facebook.com/docs/whatsapp/solution-providers/app-review |
| Opt-in requirements | https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in |
| Postman collection | https://www.postman.com/meta/whatsapp-business-platform |
| OpenAPI spec | https://github.com/facebook/openapi |

### Outros BSPs para pesquisar

| BSP | Docs |
|-----|------|
| 360dialog | https://docs.360dialog.com |
| MessageBird / Bird | https://docs.bird.com |
| Gupshup | https://docs.gupshup.io/docs/whatsapp-overview |
| Infobip | https://www.infobip.com/docs/whatsapp |
| Vonage | https://developer.vonage.com/en/messages/overview |
| Wati | https://docs.wati.io |

### Codebase do Levante CRM (arquivos-chave)

| Arquivo | O que é |
|---------|---------|
| `.github/copilot-instructions.md` | **LEIA PRIMEIRO** — Convenções, regras, arquitetura |
| `proxy.ts` + `lib/supabase/middleware.ts` | Auth do CRM |
| `lib/supabase/client.ts` | Supabase client (browser) |
| `lib/supabase/server.ts` | Supabase client (server) + service role |
| `lib/realtime/useRealtimeSync.ts` | Hook de realtime — estender para WhatsApp |
| `lib/query/index.tsx` | Query keys centralizadas — adicionar whatsapp |
| `lib/phone.ts` | Normalização de telefone (E.164, WhatsApp) |
| `features/deals/cockpit/DealCockpitClient.tsx` | Cockpit do deal — adicionar tab conversas |
| `features/inbox/InboxPage.tsx` | Inbox — integrar conversas WhatsApp |
| `features/inbox/components/MessageComposerModal.tsx` | Compositor atual — evoluir |
| `features/settings/` | Configurações — adicionar seção WhatsApp |
| `types/types.ts` | Tipos existentes (Contact, Deal, Activity) |
| `context/` | Context providers — padrão para criar WhatsApp context |
| `supabase/migrations/20251201000000_schema_init.sql` | Schema atual do banco |
| `test/setup.ts` e `test/setup.dom.ts` | Setup de testes |

---

## Notas Finais

### Para a desenvolvedora

1. **Comece lendo** `.github/copilot-instructions.md` — tem as regras do projeto
2. **Rode `npm run dev`** para conhecer o CRM visualmente antes de codar
3. A **interface `WhatsAppProvider`** é a peça mais importante da arquitetura — tudo depende dela
4. Priorize o **webhook handler** — é a fundação de tudo (sem receber mensagens, nada funciona)
5. Tem **liberdade para trocar o BSP** se encontrar melhor opção. A arquitetura abstrata permite isso
6. Em caso de dúvida sobre padrões do código, olhe como features existentes (deals, contacts) foram implementadas — siga o mesmo padrão
7. **Multi-tenant é inegociável** — TODA query filtra por `organization_id`, sem exceção
8. Se algo não parece plausível, quiser discutir ou não ficou claro: fale comigo antes de implementar

### Para o Leonardo (eu)

- Iniciar processo de registro como ISV/Tech Provider **agora** (3-4 semanas de espera)
- Verificar Meta Business Manager do Levante CRM
- Preparar credenciais e compartilhar com a desenvolvedora via canal seguro
- Definir número de telefone para usar (pode ser número Twilio ou número próprio)
