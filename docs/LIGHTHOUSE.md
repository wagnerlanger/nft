# Lighthouse

## Como rodar

```bash
npm run build
npm run audit:lighthouse
```

O script sobe `vite preview` em `127.0.0.1:4177`, audita `/` e `/nfts/emerald-ape-042` em mobile (390) e desktop (1440), **3 vezes cada**, e grava a mediana em `audits/summary.json`.

## Metas vs última mediana (`audits/summary.json`)

Ambiente: Node v24.10.0 · preview local · MSW ativo no bundle.

| Página | Perfil | Perf | A11y | BP | SEO | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | mobile | 64 | 85 | 96 | 92 | ~4646 | ~0.003 | ~625 |
| home | desktop | 54 | 97 | 96 | 92 | ~4643 | 0 | ~452 |
| detalhe | mobile | 66 | 91 | 96 | 92 | ~4697 | 0 | ~546 |
| detalhe | desktop | 45 | 99 | 96 | 92 | ~4645 | ~0.21 | ~445 |

## Justificativas abaixo da meta

- **Performance (&lt; 90):** bundle principal ~1 MB (gzip ~334 KB) inclui MSW + Socket.IO no client de demo; LCP ~4,6 s no preview headless. Melhorias futuras: code-split do MSW/socket, lazy de rotas pesadas e imagens por NFT.
- **Accessibility mobile home (85) / detalhe (91):** contrastes e labels do layout Figma (cards/nav). Desktop ≥ 95.
- **Best Practices / SEO:** dentro ou acima das metas (≥ 95 / ≥ 90).

Reexecute após mudanças grandes e atualize esta tabela com a nova mediana.
