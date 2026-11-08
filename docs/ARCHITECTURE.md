# Arquitetura Kurio

Marketplace Vite + React + TypeScript. Camadas: `src/app` (router/providers), `src/features/*` (UI + hooks + schemas), `src/infrastructure` (HTTP/Socket), `src/mocks` (MSW REST + Socket.IO).

## Stack efetiva

- TanStack Router nas rotas, search params do catálogo e layouts.
- TanStack Query para listagens, detalhe, carrinho, quote, favoritos, perfil, carteiras e pedidos.
- Axios (`src/infrastructure/http/axios.ts`) com Bearer, `x-guest-id` e `x-kurio-scenario`.
- MSW no browser (`VITE_ENABLE_MSW`) com estado em `localStorage`.
- Socket.IO client + `@mswjs/socket.io-binding` para `nft.updated` e `order.updated`.

## Cache Query

| Chave | staleTime | Notas |
| --- | ---: | --- |
| `['nfts','list',params]` | 30s | `placeholderData` mantém página anterior |
| `['nfts','detail',id]` | 30s | |
| `['cart']` | 15s | inválida quote após mutations |
| `['quote']` | 10s | totais oficiais do carrinho/checkout |
| `['favorites']` | padrão | toggle otimista + rollback |
| `['orders']` / `['orders',id]` | 30s / 5s | poll enquanto pedido pendente |

Retries: 4xx não retry; demais 1 tentativa. Logout remove queries privadas.

## Sessão

- Token em `kurio:session-token`; TTL mock 30 min (`expiresAt`).
- Cenário `session_expired` força 401.
- Interceptor Axios em 401 `session_expired` limpa token, dispara `notifySessionExpired`, abre modal e guarda `returnTo`.
- Checkout persiste rascunho do formulário em `sessionStorage`.

## Carrinho e cotação

- Buckets `kurio:cart:user:{id}` e `kurio:cart:guest:{guestId}`; merge no login.
- Promo aplicada em `kurio:cart-promo:*`.
- `POST /api/quote` é a fonte de subtotal, desconto, taxa e `fingerprint`.
- Pedido exige `quoteFingerprint` atual; divergência → `409 quote_stale`.

## Pedidos

1. `POST /api/orders` cria `pending` (idempotência via header).
2. Timer MSW finaliza em `confirmed` ou `refused` (cenários).
3. Carrinho só é limpo na confirmação.
4. Cliente escuta `order.updated` e reconcilia com `GET /api/orders/:id` (poll + refresh).

## Tempo real

Ver [SOCKET_EVENTS.md](SOCKET_EVENTS.md). Eventos passam pelo `socket.io-client`; o provider atualiza o cache Query (não há setters “falsos” no MSW → UI).

## Acessibilidade / UX

- Skeletons com shimmer e `motion-reduce:animate-none`.
- Dialogs Radix com foco; banner de tempo real com `aria-live`.
- Modal de auth responsivo (padding/altura no mobile).

## Desvios do Figma

- Arte única `public/images/nft.png` para todos os NFTs.
- Atividade/ofertas/downloads/suporte fora do escopo (placeholders).
- Confirmação de pedido em dialog (não página dedicada), com snapshot do pedido.

## Deploy

Demo Coolify: https://nft.wagnerlanger.com — build estático Vite + MSW no client. SPA fallback obrigatório.
