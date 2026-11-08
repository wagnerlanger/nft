# Lighthouse

## Como rodar

```bash
npm run build
npm run audit:lighthouse
```

O script audita **dois ambientes** na mesma execução — local e publicado — nas páginas `/` e `/nfts/emerald-ape-042`, em mobile (390) e desktop (1440), **3 vezes cada**, e grava a mediana em `audits/summary.json` (`environments.local` / `environments.published`). Relatórios brutos: `audits/{local|published}-{page}-{profile}-run{n}.json`.

Requer rede para o site publicado. Ordem: preview local (`127.0.0.1:4177`) → `https://nft.wagnerlanger.com`.

## Metas vs última mediana (`audits/summary.json`)

Gerado em 2026-11-08 · Node v24.10.0 · MSW ativo no bundle.

Para a entrega, use a tabela **Publicado**. A tabela **Local** serve só para diagnóstico no mesmo hardware/headless.

### Local (vite preview)

`http://127.0.0.1:4177`

| Página | Perfil | Perf | A11y | BP | SEO | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | mobile | 74 | 85 | 96 | 92 | ~4586 | ~0.003 | ~342 |
| home | desktop | 63 | 97 | 96 | 92 | ~4576 | 0 | ~287 |
| detalhe | mobile | 73 | 91 | 96 | 92 | ~4601 | 0 | ~300 |
| detalhe | desktop | 51 | 99 | 96 | 92 | ~4619 | ~0.21 | ~325 |

### Publicado (https://nft.wagnerlanger.com)

Coolify · HTTPS · fonte de verdade da entrega.

| Página | Perfil | Perf | A11y | BP | SEO | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | mobile | 81 | 85 | 96 | 92 | ~3572 | ~0.003 | ~271 |
| home | desktop | 60 | 97 | 96 | 92 | ~3567 | 0 | ~388 |
| detalhe | mobile | 77 | 91 | 96 | 92 | ~3646 | 0 | ~369 |
| detalhe | desktop | 49 | 99 | 96 | 92 | ~3583 | ~0.21 | ~410 |

## Justificativas abaixo da meta

- **Performance (&lt; 90):** bundle inclui MSW + Socket.IO no client de demo. Publicado fica melhor em LCP (~3,6 s vs ~4,6 s local), mas desktop detalhe ainda sofre com CLS ~0,21. Melhorias futuras: code-split do MSW/socket, lazy de rotas pesadas e imagens por NFT.
- **Accessibility mobile home (85) / detalhe (91):** contrastes e labels do layout Figma (cards/nav). Desktop ≥ 95.
- **Best Practices / SEO:** dentro ou acima das metas (≥ 95 / ≥ 90) nos dois ambientes.

Reexecute após mudanças grandes (e após deploy) e atualize **as duas** tabelas com a nova mediana.
