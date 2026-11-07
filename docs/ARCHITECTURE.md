# Arquitetura desta etapa

A aplicação é um marketplace Kurio em Vite, React e TypeScript. Esta etapa inclui a fundação, o catálogo e o modal de autenticação (login/cadastro) com sessão MSW. Carrinho, checkout, perfil completo, carteiras, Socket.IO, Playwright e Lighthouse ficam para as etapas seguintes.

## Referência visual

O layout, as cores e a tipografia vêm do arquivo Figma `taPnBgwLKnMSta0L3qCmYI`, frame `Desktop / Início` (`2:2`).

- Fonte: Roboto Mono 400, 500 e 700.
- Página `#140d0a`, card `#241612`, primária `#d28a4c`, acento `#e89b55`.
- A arte de todos os NFTs é `public/images/nft.png`, cópia de `prints/nft.png`. As ilustrações originais do Figma não entram nesta etapa.
- Busca, carrinho e o ícone de Entrar usam os vetores Iconly exportados do header. Setas de ordenação e paginação são traços no mesmo estilo.
- Criadores, Aprenda, carrinho e Diário da Cunhagem ainda são quiet. Mercado e as coleções do rodapé levam ao catálogo. Entrar abre o modal de auth; links de “Meu perfil” no footer pedem login ou vão para `/account`. Newsletter valida e-mail com Zod e simula o envio.

## Pastas

- `src/app`: providers, rotas e layout.
- `src/features/catalog`: página, componentes, contrato e hooks do catálogo.
- `src/infrastructure/http`: cliente Axios e erro padronizado. Componentes não chamam Axios.
- `src/mocks`: MSW, fixtures e a consulta do catálogo simulado.
- `src/components/ui`: primitivos no estilo shadcn, adaptados aos tokens.

## Catálogo

`GET /api/nfts` aceita `q`, `category`, `chain`, `minPrice`, `maxPrice`, `sort` (`recent`, `price_asc`, `price_desc`, `trending`), `tab` (`all`, `new`, `trending`) e `page`. A página tem 9 itens. A resposta traz `items`, `total`, `facets` e `highlight`.

Os filtros de coleção e rede são combináveis. A faixa de preço só entra na URL ao clicar em Aplicar. Qualquer mudança de filtro remove `page`. A busca digitada substitui o histórico; filtro, aba, ordenação e página empurram uma entrada nova. Preços trafegam como string decimal.

`GET /api/nfts/:id` devolve o NFT ou 404. A rota `/nfts/$nftId` só confirma a existência. O detalhe completo vem depois.

O Figma mostra Coleções, Faixa de preço e Rede. A sidebar não tem raridade. As contagens vêm das fixtures, não dos números desenhados no frame. A oferta limitada fica na sidebar, alimentada por `highlight`.

## Estado e cenários

TanStack Query usa a chave `['nfts', 'list', params]`, `staleTime` de 30 segundos e repassa `AbortSignal` ao Axios. Respostas 4xx não tentam de novo. Erros 5xx tentam uma vez. Enquanto uma página nova carrega, a anterior permanece na tela.

O MSW fica ligado salvo `VITE_ENABLE_MSW=false`. O cenário sai de `localStorage` (`kurio:scenario`: `success`, `empty`, `slow`, `error`) e viaja no header `x-kurio-scenario`, porque o service worker não lê `localStorage`. `success` espera 400 ms, `slow` espera 1,6 s.

```js
localStorage.setItem('kurio:scenario', 'slow')
```

Recarregue a página depois de trocar o cenário. `localStorage.removeItem('kurio:scenario')` volta ao sucesso.

## Autenticação (esta etapa)

Modal centrado com abas Entrar / Criar conta. Handlers MSW em `/api/auth/login`, `/api/auth/register`, `/api/auth/session` e `/api/auth/logout`. Senhas nas fixtures ficam só como SHA-256. Token em `localStorage` (`kurio:session-token`).

Credenciais de demonstração (senha `Kurio123!`):

- `colecionador@kurio.dev` — Ana Colecionadora
- `curator@kurio.dev` — Bruno Curator

Após login, o header mostra ícone de usuário + primeiro nome e leva a `/account` (stub do perfil).
