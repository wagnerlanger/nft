# Kurio — Marketplace de NFTs

Frontend do desafio: React + TypeScript, TanStack Router/Query, Axios, Tailwind, shadcn/ui, MSW, Socket.IO, Playwright e Lighthouse.

**Demo:** [https://nft.wagnerlanger.com](https://nft.wagnerlanger.com)

O enunciado original está em [docs/CHALLENGE.md](docs/CHALLENGE.md).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
npm run dev
```

Requisitos: Node `>=22.12.0`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Prefixo das chamadas Axios |
| `VITE_ENABLE_MSW` | `true` | Liga o service worker MSW (REST + Socket.IO) |

No Coolify/produção de demonstração, mantenha `VITE_ENABLE_MSW=true` para os mocks funcionarem no build publicado. Configure fallback SPA (todas as rotas → `index.html`) para refresh em deep links.

## Credenciais fictícias

Senha de ambos: `Kurio123!`

- `colecionador@kurio.dev` — Ana Colecionadora
- `curator@kurio.dev` — Bruno Curator

## Cenários MSW

Defina em `localStorage` e recarregue:

```js
localStorage.setItem('kurio:scenario', 'slow')
// success | empty | slow | error | session_expired
// coupon_invalid | coupon_expired | price_change
// order_timeout | payment_refused | out_of_order
```

Helpers no browser (após o MSW iniciar):

```js
kurioSetScenario('price_change')
kurioResetDemoState() // limpa kurio:* e recarrega fixtures
location.reload()
```

Cupons: `KURIO10` (10% off), `EXPIRED10` (expirado).

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desenvolvimento com MSW |
| `npm run build` | Typecheck + build |
| `npm run preview` | Preview do build |
| `npm run typecheck` | Só TypeScript |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E (desktop 1440 + mobile 390) |
| `npm run test:e2e:ui` | UI do Playwright |
| `npm run test:visual` | Regressão visual |
| `npm run audit:lighthouse` | Auditoria Lighthouse (3 runs → mediana) |

Antes do Lighthouse: `npm run build`.

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — cache, sessão, carrinho, REST↔Socket
- [docs/API.md](docs/API.md) — contratos REST
- [docs/SOCKET_EVENTS.md](docs/SOCKET_EVENTS.md) — eventos e limitações do mock
- [docs/LIGHTHOUSE.md](docs/LIGHTHOUSE.md) — metas e como interpretar `audits/summary.json`
