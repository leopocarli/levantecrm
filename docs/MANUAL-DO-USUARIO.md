# Levante CRM — Manual do Usuário

> Guia completo para usar o Levante CRM no dia a dia. Escrito para você que vai trabalhar com o sistema, sem linguagem técnica.

---

## Índice

1. [Primeiro Acesso](#1-primeiro-acesso)
2. [Conhecendo a Tela Principal](#2-conhecendo-a-tela-principal)
3. [Visão Geral (Dashboard)](#3-visão-geral-dashboard)
4. [Pipeline de Vendas (Boards)](#4-pipeline-de-vendas-boards)
5. [Contatos e Empresas](#5-contatos-e-empresas)
6. [Atividades](#6-atividades)
7. [Inbox — Seu Centro de Comando Diário](#7-inbox--seu-centro-de-comando-diário)
8. [Assistente de IA](#8-assistente-de-ia)
9. [Relatórios](#9-relatórios)
10. [Configurações](#10-configurações)
11. [Perfil](#11-perfil)
12. [Funcionalidades Extras](#12-funcionalidades-extras)
13. [Perguntas Frequentes](#13-perguntas-frequentes)

---

## 1. Primeiro Acesso

### Como entrar no sistema

1. Abra o navegador (Chrome, Safari, Firefox, Edge — qualquer um)
2. Acesse o endereço do seu CRM (ex: `https://seucrm.vercel.app`)
3. Na tela de login, digite seu **email** e **senha**
4. Clique em **Entrar**

### Primeiro login (o que acontece)

Na primeira vez que você entra, duas coisas podem aparecer:

**Consentimento (LGPD):**
Uma janela pedindo que você aceite os termos de uso e a política de privacidade. Marque os itens obrigatórios e clique em **Aceitar e Continuar**. Sem isso, não dá para usar o sistema.

**Boas-vindas:**
Uma janela de boas-vindas mostrando o que o CRM faz. Você pode clicar em **Iniciar Tutorial** para um tour guiado ou **Pular** se já conhece o sistema.

### Instalar como aplicativo no celular

O Levante CRM funciona como um app no celular, sem precisar baixar na loja:

**No Android:**
- Ao acessar o sistema, aparece uma mensagem "Adicionar à tela inicial"
- Toque em **Instalar** e o CRM vira um ícone na sua tela, igualzinho um app

**No iPhone:**
- Abra o CRM no Safari
- Toque no botão de compartilhar (quadrado com seta para cima)
- Toque em **Adicionar à Tela de Início**
- Confirme e pronto — o CRM aparece como app

---

## 2. Conhecendo a Tela Principal

### Onde está cada coisa

O CRM tem um menu de navegação com os seguintes itens:

| Ícone | Nome | O que faz |
|-------|------|-----------|
| 📥 | **Inbox** | Suas tarefas do dia e sugestões da IA |
| 📋 | **Boards** | Seu pipeline de vendas (quadro Kanban) |
| 👥 | **Contatos** | Lista de todos os seus contatos e empresas |
| ✅ | **Atividades** | Ligações, reuniões, emails e tarefas |

E no menu secundário (clicando em "Mais" ou no seu avatar):

| Ícone | Nome | O que faz |
|-------|------|-----------|
| 📊 | **Visão Geral** | Dashboard com números e gráficos |
| 📈 | **Relatórios** | Análises detalhadas com exportação |
| ⚙️ | **Configurações** | Ajustes do sistema |
| 👤 | **Perfil** | Seus dados pessoais e senha |

**No computador:** O menu fica numa barra lateral à esquerda.
**No celular:** O menu fica na parte de baixo da tela (como Instagram, WhatsApp).

### Barra superior

No topo de todas as telas você encontra:
- **Notificações** (sininho) — Avisos do sistema
- **Modo escuro** (ícone de sol/lua) — Alterna entre tema claro e escuro
- **Seu avatar** — Clique para ver opções e sair do sistema
- **Chat de IA** (balão de conversa) — O assistente inteligente

---

## 3. Visão Geral (Dashboard)

A Visão Geral é a sua "página de chegada" — mostra como estão suas vendas num relance.

### O que você vê

**Cartões com números importantes:**
- **Pipeline Total** — Quanto dinheiro está em jogo (soma de todas as oportunidades abertas)
- **Negócios Ativos** — Quantas oportunidades você está trabalhando agora
- **Conversão** — De cada 100 oportunidades, quantas viram venda (em %)
- **Receita Ganha** — Quanto já entrou de dinheiro no período

Cada cartão mostra uma setinha para cima (↑) ou para baixo (↓) comparando com o período anterior.

**Gráfico do Funil:**
Um gráfico em formato de funil mostrando quantas oportunidades estão em cada fase. Exemplo:
- Lead: 50 oportunidades
- Proposta: 20
- Negociação: 10
- Fechado: 5

**Atividades Recentes:**
Uma listinha com as últimas coisas que aconteceram — ligações feitas, emails enviados, reuniões, etc.

### Como mudar o período

No topo da página, tem dois filtros:
1. **Selecionar Pipeline** — Escolha qual quadro de vendas quer visualizar
2. **Período** — Escolha: Hoje, Últimos 7 dias, Este mês, Últimos 90 dias, Este ano, etc.

### Alertas de Pipeline

Se tiver um botão vermelho escrito **Alertas**, clique nele! Ele mostra:
- **Negócios parados** — Oportunidades que não receberam atenção há mais de 7 dias
- **Atividades atrasadas** — Coisas que você deveria ter feito e ainda não fez

---

## 4. Pipeline de Vendas (Boards)

O Pipeline é o coração do CRM. É onde você visualiza todas as suas oportunidades de venda em formato de quadro (estilo Kanban — como um mural de Post-its).

### Entendendo o quadro

O quadro tem **colunas** — cada coluna é uma fase do seu processo de venda. Exemplo:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Lead   │  │ Proposta  │  │Negociação│  │  Ganho   │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│          │  │          │  │          │  │          │
│ João     │  │ Maria    │  │ Carlos   │  │ Ana  ✅  │
│ R$ 5.000 │  │ R$12.000 │  │ R$20.000 │  │ R$15.000 │
│          │  │          │  │          │  │          │
│ Pedro    │  │          │  │          │  │          │
│ R$ 3.000 │  │          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

Cada cartãozinho é uma **oportunidade de venda** (chamamos de "deal" ou "negócio"). Ele mostra:
- Nome do deal ou do cliente
- Valor da oportunidade
- Um indicador colorido de atividade:
  - 🟢 Verde = Tem atividade recente (está sendo trabalhado)
  - 🟡 Amarelo = Tem atividade agendada para breve
  - 🔴 Vermelho = Sem atividade há dias (precisa de atenção!)

### Como criar uma nova oportunidade

1. No topo do quadro, clique no botão **+ Nova Negociação**
2. Preencha:
   - **Título** — Nome da oportunidade (ex: "Proposta Site Institucional")
   - **Empresa** — Comece a digitar e selecione (ou crie nova)
   - **Contato** — Selecione o contato da empresa
   - **Valor** — Quanto vale essa oportunidade (ex: R$ 15.000)
3. Clique em **Criar**

A oportunidade aparece automaticamente na primeira coluna do quadro.

### Como mover uma oportunidade entre fases

**Jeito rápido (arrastar):**
1. Clique e segure o cartão da oportunidade
2. Arraste para a coluna da próxima fase
3. Solte — pronto!

**Jeito alternativo:**
1. Clique no cartão da oportunidade
2. No painel de detalhes, clique em **Mover para estágio**
3. Escolha a nova fase
4. Clique em **Mover**

> **O que acontece por trás:** Quando você move uma oportunidade, o sistema registra automaticamente no histórico. Se o quadro estiver configurado, o contato pode mudar de fase também (ex: de "Lead" para "Prospect").

### Como marcar uma venda como ganha

Duas opções:

**Opção 1:** Arraste o cartão para a coluna "Ganho" (se o quadro tiver essa coluna configurada)

**Opção 2:**
1. Clique no cartão da oportunidade
2. Clique no botão **✅ Ganhar** (verde)
3. Confirme

### Como marcar uma venda como perdida

1. Clique no cartão da oportunidade
2. Clique no botão **❌ Perder** (vermelho)
3. Preencha o **motivo da perda** (obrigatório — serve para análise futura)
4. Confirme

### Ver detalhes de uma oportunidade

Clique em qualquer cartão para abrir o painel completo com:

- **Resumo** — Empresa, contato, valor, probabilidade de fechar, tags
- **Atividades** — Tudo que já foi feito (ligações, emails, reuniões)
- **Arquivos** — Documentos anexados (propostas, contratos)
- **Análise da IA** — Recomendações inteligentes (veja seção 8)
- **Editar** — Alterar título, valor, probabilidade, etc.
- **Deletar** — Remover a oportunidade

### Criar ação rápida direto do quadro

Passe o mouse sobre qualquer cartão e aparece um menu rápido:
- 📞 **Ligação** — Cria uma atividade de ligação para este deal
- 📧 **Email** — Cria uma atividade de email
- 📅 **Reunião** — Agenda uma reunião

Isso já preenche automaticamente o deal e o contato — é só definir a data e salvar.

### Filtrar e buscar oportunidades

No topo do quadro você encontra:
- **Barra de busca** — Digite parte do nome para encontrar rápido
- **Filtro "Meus"** — Mostra só as oportunidades que são suas
- **Filtro de status** — Mostrar: Abertas, Ganhas, Perdidas ou Todas

### Ter mais de um pipeline

Você pode ter vários quadros diferentes! Exemplo:
- **Pipeline Comercial** — Para vendas novas
- **Onboarding** — Para clientes que acabaram de comprar
- **Pós-Venda** — Para acompanhamento de clientes

Para trocar de pipeline, use o dropdown no topo "Selecionar Board".

### Criar um novo pipeline

1. No dropdown de pipelines, clique no botão **+**
2. Escolha um modelo pronto ou crie do zero:
   - **Vendas Simples** — Lead → Contato → Proposta → Negociação → Ganho
   - **Enterprise** — Mais fases, para vendas complexas
   - **Personalizado** — Você define as fases
3. Dê um nome ao pipeline
4. Configure as fases (pode arrastar para reordenar, adicionar, remover)
5. Clique em **Criar**

### Automações do pipeline

Quando você configura um pipeline, pode ativar automações:

- **Ao marcar como ganho → criar oportunidade em outro quadro**: Útil para quando uma venda fechada precisa iniciar um processo de onboarding automaticamente
- **Ao mover para uma fase → mudar o estágio do contato**: Ex: ao mover para "Proposta", o contato automaticamente passa de "Lead" para "Prospect"

---

## 5. Contatos e Empresas

### Tela de Contatos

A tela de contatos tem duas abas:
- **Pessoas** — Contatos individuais (João, Maria, Pedro)
- **Empresas** — Empresas clientes (Empresa X, Startup Y)

### Criar um novo contato

1. Clique em **+ Novo Contato**
2. Preencha:
   - **Nome Completo** (obrigatório)
   - **Email**
   - **Telefone** — O sistema formata automaticamente
   - **Função** — Cargo da pessoa (ex: "Diretor Comercial")
   - **Empresa** — Comece a digitar e selecione
3. Clique em **Salvar**

### Criar uma nova empresa

1. Mude para a aba **Empresas**
2. Clique em **+ Nova Empresa**
3. Preencha: Nome, Segmento, Site
4. Clique em **Salvar**

### Filtrar contatos

Você pode filtrar por:
- **Status**: Todos, Ativos, Inativos, Perdidos (Churn), Em Risco
- **Busca**: Digite nome ou email na barra de busca
- **Filtros avançados**: Clique no ícone de funil para mais opções

### Entendendo os indicadores de status

Cada contato tem um indicador colorido:

| Cor | Status | Significa |
|-----|--------|-----------|
| 🟢 Verde | **Ativo** | Contato com atividade recente |
| ⚪ Cinza | **Inativo** | Sem interação há algum tempo |
| 🔴 Vermelho | **Perdido (Churn)** | Cliente que foi embora |
| 🟡 Amarelo | **Em Risco** | Cliente ativo mas sem compra há mais de 30 dias — precisa de atenção! |

### Fases do funil de contatos

Todo contato passa por fases:

```
LEAD → MQL → PROSPECT → CLIENTE
```

- **Lead** — Contato novo, ainda não qualificado
- **MQL** — Qualificado pelo marketing (demonstrou interesse)
- **Prospect** — Em negociação ativa
- **Cliente** — Já comprou

Você pode mudar a fase manualmente clicando no contato e selecionando a nova fase. Mas o sistema também muda automaticamente quando oportunidades avançam no pipeline.

### Ver detalhes de um contato

Clique em qualquer contato para ver:
- Informações pessoais (nome, email, telefone, cargo)
- Empresa associada
- Oportunidades relacionadas (deals abertos e fechados)
- Histórico de atividades (ligações, emails, reuniões)
- Botões para editar, mover de fase ou deletar

### Converter contato em oportunidade

Tem um contato que quer comprar? Transforme direto em deal:
1. Clique no contato
2. Clique em **Criar Negociação**
3. O sistema já preenche o contato — é só definir título, valor e pipeline
4. Salve e a oportunidade aparece no quadro

### Importar contatos de planilha

Tem uma lista de contatos em Excel/CSV? Importe de uma vez:

1. Na tela de contatos, clique em **Import/Export**
2. Escolha **Importar**
3. Arraste seu arquivo CSV ou clique para selecionar
4. O sistema mostra uma prévia dos dados
5. Escolha como lidar com duplicados:
   - **Criar apenas** — Ignora se já existe
   - **Atualizar por email** — Se o email já existe, atualiza os dados
   - **Pular duplicados** — Ignora registros com email repetido
6. Clique em **Importar**
7. Veja o relatório: quantos foram criados, atualizados, pulados e com erro

> **Dica:** O sistema aceita arquivos separados por vírgula (,) ou por ponto e vírgula (;). Ele detecta automaticamente.

### Exportar contatos

1. Clique em **Import/Export**
2. Escolha **Exportar**
3. Aplique filtros se quiser (por fase, status, período)
4. O download do CSV começa automaticamente

---

## 6. Atividades

Atividades são tudo que você faz no dia a dia: ligações, reuniões, emails e tarefas.

### Tipos de atividade

| Ícone | Tipo | Para quê |
|-------|------|----------|
| 📞 | **Ligação** | Registrar uma chamada feita ou agendar uma futura |
| 📧 | **Email** | Registrar envio de email |
| 📅 | **Reunião** | Marcar um encontro (presencial ou online) |
| ✅ | **Tarefa** | Qualquer outra ação que precise ser feita |
| 📝 | **Nota** | Uma anotação (sem prazo, sem checkbox) |

### Criar uma atividade

1. Clique em **+ Nova Atividade** (no topo da tela de Atividades, ou de dentro de um deal)
2. Preencha:
   - **Título** — Ex: "Ligar para João sobre proposta"
   - **Tipo** — Ligação, Email, Reunião ou Tarefa
   - **Data** — Quando deve ser feita
   - **Hora** — Horário (opcional)
   - **Descrição** — Detalhes extras (opcional)
   - **Deal** — Vincular a uma oportunidade (opcional, mas recomendado)
3. Clique em **Salvar**

### Completar uma atividade

Quando você faz o que estava planejado:
- Na lista, clique no **checkbox** (✅) ao lado da atividade
- Ela é marcada como concluída e sai da sua lista de pendências

### Adiar uma atividade (Snooze)

Não deu para fazer hoje? Adie:
- Clique no ícone de **relógio** (🔔) na atividade
- Escolha para quando adiar
- A atividade reaparece na nova data

### Duas formas de visualizar

**Lista:**
Uma lista organizada com todas as atividades, filtráveis por:
- Tipo (Ligação, Email, Reunião, Tarefa)
- Status (Atrasadas, Hoje, Próximas)

**Calendário:**
Visualização semanal com as atividades posicionadas nos horários. Você pode arrastar uma atividade de um slot para outro para reagendar.

### Atividades criadas automaticamente

O sistema cria atividades sozinho em duas situações:
- **Quando você move um deal** — Registra "Movido para [fase]" como histórico
- **Quando a IA sugere uma ação** e você aceita — Cria a atividade automaticamente

---

## 7. Inbox — Seu Centro de Comando Diário

O Inbox é a tela mais importante do seu dia a dia. Ele junta tudo num lugar só: o que você precisa fazer, o que está atrasado e o que a IA recomenda.

### Modo Visão Geral

Ao abrir o Inbox, você vê um resumo rápido:

- **Atrasados** (🔴) — Quantas atividades passaram do prazo
- **Para Hoje** (🟢) — Quantas atividades tem para hoje
- **Sugestões** (🔵) — Quantas recomendações da IA existem
- **Inbox Zero** (✨) — Se está tudo em dia, aparece uma mensagem de parabéns!

Dois botões:
- **Ir para Lista** — Ver todas as atividades organizadas
- **Iniciar Foco** — Entrar no modo de concentração (veja adiante)

### Modo Lista

As atividades aparecem divididas em seções:

1. **⏰ Atrasadas** (vermelho) — Coisas que deveriam ter sido feitas e não foram
2. **📅 Reuniões de Hoje** — Reuniões e ligações agendadas para hoje, com horário
3. **✅ Tarefas de Hoje** — Tarefas e outras atividades para hoje
4. **🔜 Próximas** — Atividades futuras

Para cada atividade, você pode:
- ✅ **Completar** — Marcar como feita
- 🔔 **Adiar** — Empurrar para outro dia
- ❌ **Descartar** — Remover

### Sugestões da IA

No final da lista, aparecem cartões com sugestões inteligentes. O sistema analisa seus dados e sugere ações:

| Tipo | O que quer dizer |
|------|-----------------|
| 🟠 **Negócio Parado** | "O deal X está parado há 10 dias — que tal ligar para o cliente?" |
| 🔴 **Contato em Risco** | "Maria não tem interação há 30 dias — risco de perder o cliente" |
| 🟢 **Oportunidade de Upsell** | "O cliente Y tem potencial para uma venda adicional" |

Para cada sugestão:
- **Aplicar** — Aceita a sugestão (o sistema cria a atividade ou executa a ação)
- **Abrir** — Vai até o deal ou contato para você decidir
- **Adiar** — Esconde a sugestão por um tempo e ela reaparece depois
- **Dispensar** — Remove a sugestão permanentemente

### Modo Foco (o mais poderoso)

O Modo Foco é para trabalhar com concentração total. Ele mostra **uma atividade por vez**, com todo o contexto que você precisa ao lado:

```
┌─────────────────────────────────────────────────────┐
│  Atividade 3 de 15        [← Anterior] [Próxima →]  │
├────────────────────────┬────────────────────────────┤
│                        │                            │
│  📞 Ligar para João    │  CONTEXTO                  │
│  sobre proposta de     │                            │
│  novo site             │  Deal: Site Institucional  │
│                        │  Valor: R$ 15.000          │
│  Deal: Site João       │  Fase: Proposta            │
│  Valor: R$ 15.000      │                            │
│                        │  Saúde do Deal: 🟢 Boa     │
│                        │  Próxima ação: Ligar       │
│                        │                            │
│                        │  Últimas atividades:       │
│                        │  • Email enviado (3 dias)  │
│                        │  • Reunião (7 dias)        │
│                        │                            │
│                        │  Scripts rápidos:          │
│                        │  📋 Follow-up              │
│                        │  📋 Responder objeção      │
│                        │  📋 Fechamento             │
├────────────────────────┴────────────────────────────┤
│  [✅ Concluir]    [🔔 Adiar]    [⤵ Pular]          │
└─────────────────────────────────────────────────────┘
```

**O painel de contexto à direita mostra:**
- Detalhes do deal (valor, fase, contato)
- Saúde do deal (análise da IA: bom, atenção, crítico)
- Histórico recente (últimas 5 atividades)
- Scripts de venda prontos (modelos de mensagem)
- Ações rápidas (mover deal, marcar como ganho/perdido, criar nota)

**Scripts rápidos** são modelos de mensagem por categoria:
- **Follow-up** — Para acompanhar depois de uma reunião/proposta
- **Responder objeção** — Respostas prontas para quando o cliente tem dúvidas
- **Fechamento** — Frases para fechar a venda
- **Apresentação** — Para primeiro contato
- **Resgate** — Para reativar contatos inativos

Os scripts usam o nome do cliente e valores do deal automaticamente. Exemplo:
> "Olá **João**, tudo bem? Estou entrando em contato sobre a proposta de **R$ 15.000** que enviamos na semana passada..."

---

## 8. Assistente de IA

O CRM tem um assistente inteligente que entende seus dados e pode fazer coisas por você.

### Onde encontrar

No canto inferior direito da tela, tem um **botão de chat** (💬). Clique para abrir o assistente.

### O que você pode pedir

**Perguntas sobre suas vendas:**
- "Quantos negócios tenho abertos?"
- "Qual o valor total do meu pipeline?"
- "Mostre os deals parados há mais de 10 dias"
- "Qual minha taxa de conversão este mês?"

**Análises:**
- "Analise meu pipeline e me dê dicas"
- "Quais deals têm maior chance de fechar?"
- "Como está meu desempenho este mês?"

**Criar coisas:**
- "Crie um deal para o João Silva, valor R$ 50.000"
- "Agende uma ligação com a Maria para amanhã às 10h"
- "Crie um contato: Pedro, email pedro@empresa.com"

**Mover e atualizar:**
- "Mova o deal do João para Negociação"
- "Marque o deal da Empresa X como ganho"
- "Atualize o valor do deal para R$ 30.000"

**Gerar conteúdo:**
- "Escreva um email de follow-up para o João"
- "Me dê um script para lidar com a objeção 'está caro'"
- "Gere um email de proposta comercial"

### Como funciona na prática

1. Clique no botão de chat (💬)
2. Digite seu pedido em linguagem natural (como se estivesse falando)
3. A IA responde e, se precisar fazer algo, **pede sua confirmação**:
   > "Vou mover o deal 'Site João' para a fase 'Negociação'. Confirma?"
   > **[Sim]** **[Não]**
4. Confirme e a ação é executada

### Contexto inteligente

O assistente sabe onde você está:
- Se você está olhando um deal, ele já sabe qual é
- Se está em um pipeline específico, as perguntas consideram aquele pipeline
- Não precisa repetir informações — ele acompanha a conversa

### Ditado por voz

Em navegadores que suportam, você pode **ditar** suas mensagens em vez de digitar. Procure o ícone de microfone na caixa de texto do chat.

---

## 9. Relatórios

### O que mostra

A tela de relatórios traz análises detalhadas das suas vendas:

**Filtros no topo:**
- Escolha o pipeline
- Escolha o período (este mês, trimestre, ano, etc.)

**Seções do relatório:**

1. **Meta vs Realizado**
   - Barra de progresso mostrando quanto da meta já foi atingida
   - 🟢 Verde: ≥75% da meta
   - 🟡 Amarelo: ≥50%
   - 🔴 Vermelho: <50%

2. **Números Principais**
   - Valor do pipeline
   - Taxa de conversão (%)
   - Receita ganha
   - Tempo médio de venda (em dias)

3. **Gráfico de Tendência**
   - Linha mostrando a receita ao longo do tempo

4. **Top Vendas Ganhas**
   - Tabela com os maiores deals fechados

5. **Ranking de Vendedores**
   - Quem vendeu mais? Tabela com avatar, nome, quantidade de deals, receita e taxa de conversão

6. **Motivos de Perda**
   - Os motivos mais frequentes quando um deal é perdido (para aprender e melhorar)

7. **Funil de Conversão**
   - Quantas oportunidades estão em cada fase do funil

### Exportar para PDF

Clique no botão **Exportar PDF** no topo da página. O sistema gera um PDF completo com todos os gráficos e tabelas, pronto para imprimir ou enviar por email.

---

## 10. Configurações

Acesse em **Menu → Configurações**. As configurações são organizadas em abas:

### Geral

- **Página Inicial**: Escolha qual tela aparece quando você entra no sistema (Dashboard, Inbox, Boards, etc.)
- **Tags**: Crie e gerencie etiquetas para organizar deals (ex: "Urgente", "VIP", "Follow-up")
- **Campos Personalizados**: Crie campos extras para seus deals (ex: "Tipo de Proposta", "Origem do Lead")

### Produtos

Cadastre os produtos ou serviços que você vende:
- Nome do produto
- Preço padrão

Esses produtos podem ser adicionados aos deals — o sistema calcula o valor total automaticamente.

### Integrações

Conecte o CRM com outras ferramentas:

**API:**
- Sua chave de acesso para conectar com outros sistemas
- Link para a documentação

**Webhooks:**
- **Entrada de Leads** — Receba leads automaticamente de Hotmart, n8n, Make e outras plataformas
- **Follow-up** — Avise outros sistemas quando um deal muda de fase

**MCP:**
- Conecte o CRM com assistentes de IA externos (Claude, ChatGPT)

### IA (Inteligência Artificial)

Configure o assistente de IA da sua organização:
- **Provedor**: Google Gemini (padrão), OpenAI ou Anthropic
- **Chave de API**: Sua chave do provedor escolhido
- **Modelo**: Qual modelo usar
- **Testar Conexão**: Botão para verificar se está tudo funcionando

### Usuários (somente administradores)

Gerencie quem tem acesso ao sistema:
- Ver lista de usuários
- **Convidar** — Enviar convite por email para novos membros
- Editar permissões
- Remover acesso

### Dados

Configurações de retenção de dados e privacidade (LGPD).

---

## 11. Perfil

Acesse em **Menu → Perfil** para gerenciar seus dados pessoais.

### Informações Pessoais

- **Foto**: Clique na foto para trocar. Aceita JPG, PNG
- **Nome Completo**: Seu nome como aparece para os colegas
- **Apelido**: Nome curto (opcional)
- **Email**: Seu email de acesso
- **Telefone**: Seu número de contato

Depois de alterar, clique em **Salvar Alterações**.

### Mudar Senha

1. Digite sua **senha atual**
2. Digite a **nova senha** (requisitos: mínimo 6 caracteres, ao menos uma letra maiúscula e um número)
3. **Confirme** a nova senha
4. Clique em **Alterar Senha**

---

## 12. Funcionalidades Extras

### Modo Escuro

Clique no ícone de **sol/lua** no topo da tela para alternar entre modo claro e modo escuro. A preferência é salva — na próxima vez que abrir, já estará no modo que você escolheu.

### Notificações no Navegador

O sistema pode enviar notificações no seu computador (tipo as do WhatsApp Web). Quando perguntado, permita as notificações para não perder atividades importantes.

### Busca Rápida

Em várias telas, existe uma **barra de busca** no topo. Use para encontrar rapidamente:
- Deals pelo nome
- Contatos pelo nome ou email
- Empresas pelo nome

### Indicadores Visuais — Resumo

| O que você vê | O que significa |
|---------------|----------------|
| 🟢 Bolinha verde no card | Deal com atividade recente — tudo certo |
| 🟡 Bolinha amarela | Atividade agendada para breve |
| 🔴 Bolinha vermelha piscando | Deal parado há dias — precisa de ação! |
| Seta ↑ verde nos KPIs | Melhorando em relação ao período anterior |
| Seta ↓ vermelha nos KPIs | Piorando em relação ao período anterior |
| Badge vermelho com número | Quantidade de itens que precisam de atenção |

---

## 13. Perguntas Frequentes

### Como sei o que fazer primeiro quando abro o CRM?

Abra o **Inbox**. Ele mostra exatamente o que precisa da sua atenção: atividades atrasadas, reuniões de hoje e sugestões da IA. Use o **Modo Foco** para trabalhar item por item.

### Perdi dados, tem como recuperar?

O sistema salva tudo automaticamente no banco de dados. Se você deletou algo por engano, entre em contato com o administrador.

### Posso usar no celular?

Sim! Acesse pelo navegador do celular. Para uma experiência melhor, instale como app (veja [Instalar como aplicativo no celular](#instalar-como-aplicativo-no-celular)).

### Como configuro a IA?

Peça ao administrador da sua organização para ir em **Configurações → IA** e inserir a chave de API do provedor escolhido (Google, OpenAI ou Anthropic).

### A IA pode fazer coisas sem minha permissão?

Não. Sempre que o assistente for executar uma ação (mover deal, criar contato, etc.), ele **pede sua confirmação** antes. Você sempre tem a última palavra.

### Como importo minha lista de clientes?

Vá em **Contatos → Import/Export → Importar**. Arraste seu arquivo CSV. O sistema aceita arquivos do Excel salvos como CSV (separados por vírgula ou ponto e vírgula).

### Quantos pipelines posso ter?

Não tem limite. Crie quantos quiser — para vendas, pós-venda, onboarding, suporte, etc.

### Como vejo quem está vendendo mais?

Vá em **Relatórios**, selecione o pipeline e o período. Na seção "Ranking de Vendedores" você vê a comparação entre os membros da equipe.

### O que é "Inbox Zero"?

Quando todas as suas atividades estão em dia e as sugestões da IA foram tratadas, o Inbox mostra uma mensagem de **"Inbox Zero"** — significa que está tudo sob controle!

### O que acontece quando marco um deal como ganho?

- O deal é marcado com status "Ganho" ✅
- Se o pipeline tiver automação configurada, um novo deal pode ser criado automaticamente no próximo pipeline (ex: Onboarding)
- O contato pode ser promovido para "Cliente" automaticamente
- Os números do Dashboard e Relatórios são atualizados

### Posso personalizar as fases do pipeline?

Sim! Vá em **Boards**, clique na engrenagem do pipeline ativo, e edite:
- Renomear fases
- Adicionar novas fases
- Reordenar (arrastar)
- Remover fases
- Configurar qual fase é "Ganho" e qual é "Perdido"

### Como conecto com Hotmart, n8n ou Make?

Vá em **Configurações → Integrações → Webhooks**. Configure a **Entrada de Leads**:
1. Escolha qual pipeline e fase vai receber os leads
2. Copie a URL e o Secret
3. No Hotmart/n8n/Make, configure para enviar dados para essa URL com o Secret no cabeçalho

Quando um lead chegar, o contato é criado e uma oportunidade aparece automaticamente no seu pipeline!

---

> **Dica final:** O CRM é feito para facilitar sua rotina. Use o **Inbox** como ponto de partida todas as manhãs, mantenha suas atividades em dia e deixe a IA trabalhar por você. Quanto mais você usa, mais inteligentes ficam as sugestões. 🚀
