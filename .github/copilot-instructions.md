# Copilot Instructions - Levante CRM

## Visao Geral
- Stack principal: Next.js 16 (App Router), React 19, TypeScript, Supabase, TanStack Query.
- Estrutura de UI/domino: `components/` para compartilhado e `features/` para modulos de negocio.
- Estado de dados: `context/` funciona como fachada sobre hooks e chaves em `lib/query/`.

## Arquitetura Critica
- Auth/refresh roda em `proxy.ts` + `lib/supabase/middleware.ts` (nao usar `middleware.ts`).
- O proxy nao intercepta `/api/*`; handlers devem responder 401/403 e evitar redirect para chamadas `fetch`.
- Limites de client Supabase:
  - browser: `lib/supabase/client.ts` (pode retornar `null` sem env configurada)
  - server: `lib/supabase/server.ts` com `server-only`
  - service role: `createStaticAdminClient()` em `lib/supabase/server.ts`
- IA principal: chat em `app/api/ai/chat/route.ts`, UI em `components/ai/UIChat.tsx`, ferramentas em `lib/ai/tools.ts`.

## Comandos de Trabalho
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint` (zero warnings)
- Typecheck: `npm run typecheck`
- Testes: `npm run test` (watch), `npm run test:run` (single run)
- Precheck: `npm run precheck` e `npm run precheck:fast`

## Convencoes de Codigo
- Imports com alias `@/`.
- Manter componentes compartilhados em `components/` e fluxo de negocio em `features/`.
- Testes ao lado do codigo (`*.test.ts(x)`), com Vitest + React Testing Library.
- Setup de testes em `test/setup.ts` e `test/setup.dom.ts`.

## Multi-Tenant e Seguranca
- Toda query sensivel deve filtrar por `organization_id`.
- Queries com service role devem aplicar filtro de tenant explicitamente.
- Em IA, considerar `organization_settings` como fonte de verdade para modelo/chaves.
- `lib/ai/tools.ts` deve sempre operar no escopo da organizacao.

## Cache e Realtime (Critico)
- Um cache por entidade: mutations, realtime e optimistic updates devem usar a mesma chave-base.
- Deals: usar sempre `[...queryKeys.deals.lists(), 'view']` para mutacoes.
- Nunca usar `queryKeys.*.list({ filter })` em optimistic update de mutacao.
- Preferir `setQueryData` sobre `invalidateQueries` quando for seguro para feedback imediato.
- Realtime: debounce para UPDATE/DELETE; nao debouncer INSERT.

## Ambiente (Env)
- Basear configuracao em `.env.example` e usar `.env.local`.
- Chaves client: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (fallback legado: `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Chave server: `SUPABASE_SECRET_KEY` (fallback legado: `SUPABASE_SERVICE_ROLE_KEY`).
- Nunca expor chave secreta no client.

## Documentacao (Linkar, nao duplicar)
- Setup e produto: `README.md`
- Public API: `docs/public-api.md`
- Webhooks: `docs/webhooks.md`
- MCP: `docs/mcp.md`

## Regras de Review
- Responder em portugues durante revisao de codigo.
- Priorizar riscos de regressao, seguranca multi-tenant e cobertura de testes.
- Validar lint/typecheck/testes para mudancas significativas antes de concluir.
