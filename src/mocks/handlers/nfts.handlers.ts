import { delay, http, HttpResponse } from 'msw'

import { emptyCatalog, findNft, queryCatalog } from '@/mocks/database/catalog'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'
import { parseCatalogSearch } from '@/shared/utils/catalog-search'

function readQuery(request: Request) {
  const url = new URL(request.url)
  const search = parseCatalogSearch(Object.fromEntries(url.searchParams.entries()))
  return {
    ...search,
    sort: search.sort ?? 'recent',
    tab: search.tab ?? 'all',
    page: search.page ?? 1,
  }
}

export const nftHandlers = [
  http.get('/api/nfts', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'O catálogo está indisponível no momento.', code: 'catalog_unavailable' },
        { status: 500 },
      )
    }

    const query = readQuery(request)
    const body = scenario === 'empty' ? emptyCatalog(query) : queryCatalog(query)
    return HttpResponse.json(body)
  }),

  http.get('/api/nfts/:id', async ({ params, request }) => {
    const scenario = readScenario(request)
    await delay(scenario === 'slow' ? 1600 : 250)

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível carregar este NFT.', code: 'nft_unavailable' },
        { status: 500 },
      )
    }

    const nft = findNft(String(params.id))
    if (!nft || scenario === 'empty') {
      return HttpResponse.json(
        { message: 'NFT não encontrado.', code: 'nft_not_found' },
        { status: 404 },
      )
    }

    return HttpResponse.json(nft)
  }),
]
