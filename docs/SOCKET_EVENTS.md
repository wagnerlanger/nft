# Socket.IO

## Cliente

- Pacote: `socket.io-client`
- URL: origem da página, path `/socket.io`, transport `websocket`
- Conexão lazy após o MSW (`main.tsx` inicia o worker antes do React)
- Auth: evento `auth` com o token de sessão após `connect`

## Eventos

### `nft.updated`

```ts
{
  eventId: string
  resourceId: string // nftId
  version: number
  userId: null
  payload: { nftId: string; priceEth: string }
}
```

Atualiza catálogo, detalhe, linhas do carrinho e invalida quote. Duplicatas/`version` antiga são ignoradas.

### `order.updated`

```ts
{
  eventId: string
  resourceId: string // orderId
  version: number
  userId: string
  payload: Order
}
```

Só aplica se `userId` = sessão atual. Atualiza cache de pedidos; confirmação limpa carrinho no client via invalidação.

## Mock MSW

- Binding: `@mswjs/socket.io-binding` + `ws.link` em `src/mocks/socket/handlers.ts`
- Peer do binding declara MSW 2; o projeto usa MSW 3. `.npmrc` define `legacy-peer-deps=true` para install/deploy (limitação conhecida)
- Emissão de pedidos via `subscribeOrderUpdates` no mock DB
- Cenário `price_change`: ao GET `/cart`, agenda bump de preço do primeiro item

## Reconexão

No `connect`, o provider invalida `cart` e `orders`. Pedido pendente também usa poll REST (`GET /orders/:id`).

## Limitações

- Sem rooms/namespaces Socket.IO reais
- Não há servidor Socket.IO de produção; tudo é interceptado no browser
- Eventos demo `demo.price_change` existem só para testes manuais/E2E
