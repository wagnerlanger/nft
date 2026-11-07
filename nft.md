# Projeto: NFT Marketplace — Frontend Challenge

Atue como um **Senior Frontend Engineer / Software Architect**, especialista em React, TypeScript e arquitetura de aplicações frontend escaláveis.

Sua missão é desenvolver do zero uma aplicação completa de NFT Marketplace, seguindo rigorosamente o escopo do desafio, o design do Figma e as tecnologias obrigatórias.

O resultado deve demonstrar qualidade de código, arquitetura bem estruturada, fidelidade visual, boas práticas de engenharia, acessibilidade, performance e domínio do ecossistema React.

Não desenvolva apenas uma demonstração visual. Todos os fluxos principais devem funcionar utilizando uma API inteiramente simulada.

---

# 1. Referências e requisitos

**Design no Figma:**
https://www.figma.com/design/taPnBgwLKnMSta0L3qCmYI/Frontend-Challenge--Copy-?node-id=70492-696

O Figma é a referência visual oficial. Antes de implementar as telas, analise os frames disponíveis, identificando:

- Identidade visual.
- Tipografia e hierarquia textual.
- Paleta de cores.
- Espaçamentos e dimensões.
- Componentes recorrentes.
- Cards, botões, formulários e elementos de navegação.
- Comportamento responsivo.
- Diferenças entre desktop e mobile.

Não invente uma identidade visual alternativa quando houver uma definição no Figma.

Utilize os assets disponibilizados no projeto ou no Figma sempre que possível.

# 2. Stack tecnológica obrigatória

Utilize efetivamente as seguintes tecnologias:

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- REST APIs simuladas
- Socket.IO / socket.io-client
- Tailwind CSS
- shadcn/ui
- MSW
- Playwright
- Lighthouse

Bibliotecas complementares permitidas:

- React Hook Form para gerenciamento de formulários.
- Zod para validação e tipagem de schemas.
- Lucide React para ícones.
- Decimal.js ou outra biblioteca decimal para cálculos financeiros precisos.
- date-fns para manipulação de datas.

Não introduza bibliotecas adicionais sem uma justificativa técnica clara.

# 3. Arquitetura e organização de arquivos

A organização do projeto é um requisito importante.

Utilize uma arquitetura feature-based, separando funcionalidades, componentes compartilhados, infraestrutura, serviços e configurações.

A estrutura deve ser previsível, modular, escalável e de fácil manutenção.

Utilize a seguinte estrutura como referência inicial:

```text
src/
├── app/
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── AppProviders.tsx
│   ├── router/
│   │   ├── index.tsx
│   │   ├── routeTree.gen.ts
│   │   └── routes/
│   │       ├── __root.tsx
│   │       ├── index.tsx
│   │       ├── nfts/
│   │       ├── cart.tsx
│   │       ├── checkout.tsx
│   │       ├── confirmation/
│   │       ├── login.tsx
│   │       ├── register.tsx
│   │       └── account/
│   └── layouts/
│       ├── MainLayout.tsx
│       ├── AuthLayout.tsx
│       └── AccountLayout.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── feedback/
│   └── common/
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   ├── catalog/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── nft-details/
│   ├── favorites/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   └── wallets/
│
├── infrastructure/
│   ├── http/
│   │   ├── axios.ts
│   │   ├── interceptors.ts
│   │   └── errors.ts
│   ├── socket/
│   │   ├── socket-client.ts
│   │   ├── socket-provider.tsx
│   │   └── socket-events.ts
│   ├── storage/
│   └── config/
│
├── mocks/
│   ├── browser.ts
│   ├── server.ts
│   ├── handlers/
│   │   ├── auth.handlers.ts
│   │   ├── nfts.handlers.ts
│   │   ├── favorites.handlers.ts
│   │   ├── cart.handlers.ts
│   │   ├── checkout.handlers.ts
│   │   ├── orders.handlers.ts
│   │   ├── profile.handlers.ts
│   │   └── wallets.handlers.ts
│   ├── fixtures/
│   ├── database/
│   ├── scenarios/
│   └── socket/
│
├── shared/
│   ├── hooks/
│   ├── types/
│   ├── schemas/
│   ├── constants/
│   ├── utils/
│   └── formatters/
│
├── styles/
│   ├── globals.css
│   └── tokens.css
│
└── main.tsx

tests/
├── e2e/
│   ├── catalog/
│   ├── auth/
│   ├── favorites/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── realtime/
├── visual/
├── fixtures/
└── helpers/

public/
├── images/
├── fonts/
└── icons/

docs/
├── API.md
├── ARCHITECTURE.md
├── SOCKET_EVENTS.md
└── TEST_SCENARIOS.md

playwright.config.ts
vite.config.ts
tsconfig.json
.env.example
README.md
```

A estrutura pode ser ajustada quando necessário, mas qualquer alteração deve preservar a separação de responsabilidades.

**Regras arquiteturais:**

1. Cada feature deve concentrar seus próprios componentes, hooks, serviços, schemas e tipos.
2. Componentes compartilhados não devem conter regras específicas de negócio.
3. Componentes de página devem atuar principalmente como composição de componentes e orquestração da funcionalidade.
4. Hooks devem encapsular comportamentos reutilizáveis e acesso aos dados.
5. Serviços devem concentrar as operações de comunicação com a API.
6. Tipos e schemas devem possuir responsabilidades bem definidas.
7. Não misturar lógica de interface, acesso à API e regras de negócio no mesmo arquivo.
8. Evitar arquivos gigantes, componentes monolíticos e abstrações desnecessárias.
9. Evitar duplicação de código.
10. Não criar pastas ou arquivos sem utilização real.

Utilize nomes claros, consistentes e em inglês para arquivos, componentes, funções, variáveis e tipos.

# 4. Padrões de desenvolvimento

Adote TypeScript em modo strict.

Regras obrigatórias:

- Evitar `any`.
- Preferir interfaces e tipos explícitos nos contratos.
- Não utilizar casts para mascarar erros de tipagem.
- Tipar respostas e requisições da API.
- Separar tipos de transporte dos modelos utilizados pela interface quando necessário.
- Utilizar funções pequenas e com responsabilidades específicas.
- Utilizar componentes funcionais.
- Evitar prop drilling excessivo.
- Evitar estados duplicados.
- Evitar lógica de negócio dentro do JSX.
- Utilizar imports organizados e aliases de caminhos.
- Centralizar constantes e configurações.
- Garantir tratamento explícito de erros.

Configure ESLint e Prettier.

Configure também aliases de importação, preferencialmente `@/` apontando para `src/`.

# 5. Gerenciamento de estado

Respeite a separação entre estado remoto, estado de interface e estado persistente.

**TanStack Query:**

Responsável por:
- Catálogo.
- Detalhes dos NFTs.
- Favoritos.
- Carrinho.
- Perfil.
- Carteiras.
- Pedidos.
- Cotação e validação de checkout.
- Sessão recuperada da API.

Configure query keys centralizadas e tipadas, preferencialmente organizadas por feature.

Implemente:
- Cache.
- Invalidação.
- Mutations.
- Atualização otimista com rollback.
- Cancelamento de requisições obsoletas.
- Retry com política adequada.
- Tratamento de loading, error, empty e success.
- Isolamento de cache por usuário.

**Estado local:**

Utilize React state e context apenas quando apropriado para estados de interface e infraestrutura compartilhada.

Exemplos:
- Abertura de modais.
- Menus.
- Drawers.
- Filtros ainda não aplicados.
- Estado de conexão da carteira simulada.

Não reproduza manualmente o estado remoto que já é gerenciado pelo TanStack Query.

# 6. Camada HTTP e API

Configure um cliente Axios centralizado.

Implemente:
- Base URL configurável por variável de ambiente.
- Interceptors.
- Tratamento padronizado de erros.
- Tratamento de sessão expirada.
- Cancelamento de requisições.
- Tipagem das respostas.
- Tratamento de erros HTTP.

Não faça chamadas Axios diretamente nos componentes.

As features devem acessar a API por meio de suas respectivas camadas de serviços e hooks.

Defina contratos REST para:

- Autenticação e sessão.
- Catálogo de NFTs.
- Favoritos.
- Carrinho.
- Cotação e cupons.
- Pedidos.
- Perfil.
- Carteiras.

Documente os endpoints, métodos, parâmetros, payloads, respostas e erros.

# 7. Mocking com MSW

O MSW deve funcionar como um backend simulado, e não como um conjunto de respostas isoladas.

Implemente os handlers na camada de rede.

Os componentes, hooks e serviços não podem conter respostas fictícias ou caminhos alternativos específicos para os mocks.

O backend simulado deve manter consistência entre:
- Usuários.
- Sessões.
- Catálogo.
- Favoritos.
- Carrinho.
- Preços.
- Disponibilidade.
- Cupons.
- Pedidos.
- Perfil.
- Carteiras.

Utilize fixtures com variedade suficiente para testar busca, filtros e paginação.

Inclua pelo menos dois usuários fictícios.

Implemente cenários configuráveis de:
- Sucesso.
- Resultado vazio.
- Latência variável.
- Timeout.
- Falha de conexão.
- HTTP 4xx e 5xx.
- Sessão expirada.
- Cadastro duplicado.
- Cupom inválido.
- Preço alterado.
- NFT esgotado.
- Pagamento recusado.
- Pagamento confirmado.
- Timeout após criação do pedido.

Permita ativar os mocks por configuração de ambiente.

Os mocks devem funcionar também no build de demonstração publicado.

Implemente persistência local para os dados simulados, permitindo refresh sem perder o estado.

Disponibilize uma maneira de restaurar integralmente um cenário inicial conhecido.

# 8. Socket.IO

Crie uma camada independente para a conexão e gerenciamento de eventos.

Utilize efetivamente `socket.io-client`.

Eventos obrigatórios:

`nft.updated`
- Atualizar preços.
- Atualizar disponibilidade.
- Sincronizar catálogo, detalhe e carrinho.
- Informar o usuário sobre alterações relevantes.

`order.updated`
- Atualizar o estado dos pedidos.
- Identificar pedidos confirmados ou recusados.
- Recuperar pedidos pendentes após reconexão.

Os eventos devem possuir:
- Identificador estável.
- Identificador do recurso.
- Versão do recurso.
- Dados necessários para atualização.

Trate:
- Eventos duplicados.
- Eventos antigos.
- Reconexão.
- Desconexão.
- Cleanup de listeners.
- Isolamento entre sessões de usuários.

Após reconexão, consulte a API REST para reconciliar o estado.

Utilize MSW para simular os eventos com uma solução compatível com Socket.IO, avaliando a integração com `@mswjs/socket.io-binding`.

Não simule eventos chamando diretamente setters, hooks ou métodos do TanStack Query.

As alterações devem percorrer o cliente Socket.IO real utilizado pela aplicação.

Documente o transporte simulado e suas limitações.

# 9. Funcionalidades

Implemente os seguintes fluxos:

**Início / Catálogo**
- Destaques.
- Listagem de NFTs.
- Busca.
- Filtros combináveis.
- Ordenação.
- Paginação.
- URL sincronizada com os filtros.
- Loading, empty e error states.

**Detalhes do NFT**
- Galeria.
- Informações.
- Edições disponíveis.
- Quantidade.
- Favoritos.
- Adicionar ao carrinho.
- Limites de disponibilidade.

**Carrinho**
- Listagem de itens.
- Alteração de quantidades.
- Remoção.
- Cupons.
- Subtotal.
- Descontos.
- Taxas de rede.
- Total.
- Atualização de preço via Socket.IO.
- Persistência após refresh.
- Preservação dos itens de visitantes após login.

**Checkout**
- Dados do colecionador.
- Seleção de carteira.
- Seleção de rede.
- Simulação de conexão.
- Simulação de recusa e desconexão.
- Revisão do pedido.
- Revalidação de preços, disponibilidade, cupons e taxas.
- Confirmação da compra.
- Proteção contra pedidos duplicados.

**Confirmação**
- Estado real do pedido simulado.
- Identificação da transação.
- Itens.
- Taxas.
- Total.
- Snapshot imutável do recibo.

**Autenticação**
- Login.
- Cadastro.
- Logout.
- Recuperação de sessão.
- Expiração.
- Retorno à rota anterior.
- Preservação do contexto de checkout.

**Perfil**
- Consulta.
- Edição dos dados.
- Avatar.
- Alteração de senha.

**Carteiras**
- Listagem.
- Cadastro.
- Edição.
- Carteira principal.
- Carteiras secundárias.

As páginas editoriais, suporte, atividade, ofertas e downloads estão fora do escopo.

# 10. Regras financeiras e segurança

Valores em ETH devem trafegar como strings decimais.

Não utilize operações de ponto flutuante convencionais para cálculos financeiros.

Utilize uma biblioteca de precisão decimal.

As quantidades devem ser inteiras.

A cotação retornada pela API é a referência para finalizar o pedido.

Utilize uma chave de idempotência para criação dos pedidos.

A mesma chave e o mesmo conteúdo devem recuperar o mesmo pedido.

A mesma chave com conteúdo diferente deve gerar conflito.

Nunca apresente uma compra como confirmada antes da confirmação efetiva da API simulada.

Não armazene senhas em claro.

Não exponha dados privados de um usuário para outro.

Ao realizar logout ou troca de usuário, limpe os dados privados do cache e encerre as subscriptions da sessão anterior.

# 11. Interface e experiência

Implemente o design seguindo fielmente o Figma.

Utilize Tailwind CSS e shadcn/ui.

Adapte os componentes do shadcn/ui à identidade visual do projeto.

Crie componentes reutilizáveis para:
- Botões.
- Inputs.
- Selects.
- Modais.
- Drawers.
- Dropdowns.
- Cards.
- Skeletons.
- Toasts.
- Estados vazios.
- Mensagens de erro.

Implemente skeletons com shimmer effect para catálogo, detalhe e resumo do carrinho.

Respeite `prefers-reduced-motion`.

Garanta responsividade nos seguintes viewports:
- 390px.
- 768px.
- 1440px.

Implemente também os frames mobile disponíveis no Figma.

Perfil, carteiras e confirmação devem funcionar em mobile mesmo sem frame específico.

Não utilize elementos meramente decorativos que pareçam ações funcionais.

# 12. Acessibilidade

Implemente:
- HTML semântico.
- Navegação por teclado.
- Foco visível.
- Labels apropriados.
- Mensagens de validação associadas aos campos.
- Controle de foco em modais e drawers.
- Textos alternativos em imagens relevantes.
- Contraste adequado.
- Feedback acessível para alterações em tempo real.
- Compatibilidade com zoom.
- Ausência de overflow horizontal indevido.

# 13. Testes

Configure Playwright.

Os testes devem utilizar os mocks e validar o comportamento real da interface.

Cubra:

1. Busca, filtros, ordenação e paginação.
2. Navegação pelo histórico.
3. Acesso direto ao detalhe.
4. NFT inexistente.
5. Login e cadastro.
6. Expiração de sessão.
7. Logout e troca de usuário.
8. Favoritos e falha de mutation.
9. Carrinho e persistência.
10. Aplicação de cupons.
11. Checkout completo.
12. Pagamento recusado.
13. Clique repetido e idempotência.
14. Recuperação após timeout.
15. Edição de perfil.
16. Avatar e senha.
17. Gerenciamento de carteiras.
18. Atualização via Socket.IO.
19. Eventos duplicados e antigos.
20. Desconexão e reconexão.
21. Navegação por teclado.
22. Skeletons e recuperação de falhas.

Utilize Chromium em desktop e mobile.

Implemente regressão visual para:
- Início.
- Detalhe.
- Carrinho.
- Pagamento.

Mantenha baselines versionadas e cenários determinísticos.

Cada teste deve iniciar com estado isolado.

# 14. Performance

Configure auditorias Lighthouse para início e detalhe do NFT.

Execute três medições por página e perfil, utilizando a mediana dos resultados.

Metas:

- Performance: 90 ou superior.
- Accessibility: 95 ou superior.
- Best Practices: 95 ou superior.
- SEO: 90 ou superior.

Registre:
- LCP.
- CLS.
- TBT.

Utilize build otimizado e os mocks padrão.

Não simplifique funcionalidades ou imagens exclusivamente para melhorar as pontuações.

Documente os resultados e eventuais limitações.

# 15. Documentação e entrega

Crie:

`README.md`
- Descrição do projeto.
- Tecnologias.
- Requisitos.
- Instalação.
- Configuração de ambiente.
- Execução local.
- Credenciais fictícias.
- Seleção de cenários.
- Reset dos mocks.
- Comandos disponíveis.
- Deploy.

`ARCHITECTURE.md`
- Estrutura de pastas.
- Responsabilidades das camadas.
- Estratégia de estado.
- Política de cache.
- Sessão.
- Persistência do carrinho.
- Sincronização REST e Socket.IO.
- Decisões arquiteturais.
- Limitações e desvios do Figma.

`API.md`
- Contratos REST completos.

`SOCKET_EVENTS.md`
- Contratos dos eventos.
- Payloads.
- Versões.
- Reconexão.
- Reconciliação.

`TEST_SCENARIOS.md`
- Cenários disponíveis.
- Como reproduzir falhas.
- Como executar os testes.

Configure scripts para:
- `dev`
- `build`
- `preview`
- `typecheck`
- `lint`
- `test:e2e`
- `test:e2e:ui`
- `test:visual`
- `audit:lighthouse`

O projeto deve funcionar a partir de um checkout limpo.

O deploy público é obrigatório, utilizando Vercel, Netlify ou Cloudflare Pages.

# 16. Estratégia de implementação

**IMPORTANTE: não tente desenvolver toda a aplicação em uma única etapa.**

Trabalhe de maneira incremental, validando cada camada antes de avançar.

Siga esta sequência:

### Fase 1 — Fundação

- Inicializar Vite com React e TypeScript.
- Configurar TypeScript strict.
- Instalar e configurar Tailwind.
- Configurar shadcn/ui.
- Configurar aliases.
- Configurar ESLint e Prettier.
- Configurar TanStack Router.
- Configurar TanStack Query.
- Configurar Axios.
- Criar estrutura de pastas.
- Criar providers.
- Criar layouts iniciais.
- Configurar MSW.
- Criar documentação arquitetural inicial.

Ao finalizar, valide que a aplicação inicia, compila e não apresenta erros de tipagem.

### Fase 2 — Design System e interface

- Extrair tokens visuais do Figma.
- Criar componentes base.
- Implementar header, footer e navegação.
- Criar layouts responsivos.
- Implementar a página inicial.
- Validar fidelidade visual.

### Fase 3 — API simulada

- Definir contratos.
- Criar fixtures.
- Implementar banco simulado.
- Criar handlers MSW.
- Implementar cenários de falha.
- Validar consistência entre recursos.

### Fase 4 — Catálogo e NFTs

- Busca.
- Filtros.
- Ordenação.
- Paginação.
- Detalhes.
- Favoritos.

### Fase 5 — Autenticação e conta

- Cadastro.
- Login.
- Sessão.
- Logout.
- Perfil.
- Carteiras.
- Proteção de rotas.

### Fase 6 — Carrinho e checkout

- Carrinho.
- Quantidades.
- Cupons.
- Cotação.
- Carteiras.
- Pagamento.
- Idempotência.
- Confirmação.
- Recuperação de pedidos.

### Fase 7 — Tempo real

- Integração Socket.IO.
- Eventos.
- Atualização de catálogo e carrinho.
- Atualização de pedidos.
- Reconexão.
- Reconciliação com REST.
- Testes de concorrência e duplicidade.

### Fase 8 — Testes e qualidade

- Testes E2E.
- Testes de regressão visual.
- Acessibilidade.
- Responsividade.
- Lighthouse.
- Correções.

### Fase 9 — Documentação e deploy

- Revisar documentação.
- Executar todos os comandos.
- Gerar relatórios.
- Criar build de produção.
- Publicar aplicação.
- Validar refresh e acesso direto às rotas.
- Conferir funcionamento dos mocks e eventos em produção.

# 17. Regras de execução para o agente

Antes de começar:

1. Analise os arquivos existentes no repositório.
2. Verifique se existem assets, fontes ou referências visuais disponíveis.
3. Analise os frames do Figma.
4. Identifique eventuais limitações de acesso ao Figma e não invente informações visuais.
5. Apresente um plano inicial de implementação.
6. Apresente a estrutura de pastas proposta.
7. Explique brevemente as principais decisões arquiteturais.

Depois disso, inicie a Fase 1.

**Não avance automaticamente por todas as fases.** Implemente a fase atual, execute as verificações pertinentes, corrija os problemas e apresente um resumo do que foi feito e do que falta.

Não considere uma funcionalidade concluída apenas porque sua interface foi criada.

Uma funcionalidade só estará concluída quando possuir:
- Interface implementada.
- Integração com a camada de dados.
- Tipagem adequada.
- Estados de carregamento e erro.
- Comportamento funcional.
- Validação pertinente.

Não ignore requisitos do desafio para acelerar o desenvolvimento.

Não substitua funcionalidades obrigatórias por simulações visuais superficiais.

Priorize sempre código legível, organização, consistência arquitetural e fidelidade ao escopo.

**Comece agora pela análise do projeto e pela Fase 1 — Fundação.**