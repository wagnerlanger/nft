# Contratos REST (MSW)

Base: `VITE_API_BASE_URL` (padrão `/api`).

## Sessão e conta

| Método | Path | Notas |
| --- | --- | --- |
| POST | `/auth/register` | 201 sessão; 409 email/username |
| POST | `/auth/login` | 200 sessão; 401 credenciais |
| GET | `/auth/session` | 200 sessão; 401 expirada |
| POST | `/auth/logout` | 204 |

## NFTs

| Método | Path | Notas |
| --- | --- | --- |
| GET | `/nfts` | `q`, `category`, `chain`, `minPrice`, `maxPrice`, `sort`, `tab`, `page` |
| GET | `/nfts/:id` | 404 se inexistente |

## Favoritos

| Método | Path | Notas |
| --- | --- | --- |
| GET | `/favorites` | `{ items: string[] }` |
| POST | `/favorites` | `{ nftId }` |
| DELETE | `/favorites/:nftId` | 204 |

## Carrinho

| Método | Path | Notas |
| --- | --- | --- |
| GET | `/cart` | items + itemCount |
| POST | `/cart/items` | `{ nftId, quantity? }` |
| PATCH | `/cart/items/:nftId` | `{ quantity }` |
| DELETE | `/cart/items/:nftId` | |
| POST | `/cart/merge` | guest → user |

## Cotação

| Método | Path | Notas |
| --- | --- | --- |
| POST | `/quote` | `{ promoCode?, clearPromo? }` → totais + `fingerprint` + `promoStatus` |

`promoStatus`: `none | applied | invalid | expired`.

## Pedidos

| Método | Path | Notas |
| --- | --- | --- |
| GET | `/orders` | lista do usuário |
| GET | `/orders/:id` | detalhe / recuperação |
| POST | `/orders` | header `Idempotency-Key`; body inclui `quoteFingerprint` |

Status: `pending | confirmed | refused`. Mesma chave + mesmo fingerprint reutiliza o pedido; fingerprint diferente → 409.

## Perfil e carteiras

| Método | Path | Notas |
| --- | --- | --- |
| GET/PATCH | `/profile` | dados + avatar data URL |
| POST | `/profile/password` | troca de senha |
| GET | `/wallets` | primary/secondary |
| PUT | `/wallets/primary` | |
| PUT | `/wallets/secondary` | |
| PUT | `/wallets/same-as-primary` | |

## Erros comuns

Códigos: `validation_error`, `session_expired`, `quote_stale`, `promo_invalid`, `idempotency_conflict`, `cart_empty`, `nft_not_found`, `payment_refused`.
