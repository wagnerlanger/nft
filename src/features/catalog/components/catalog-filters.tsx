import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { NftListResponse } from '@/features/catalog/types'
import { fromCents, toCents } from '@/shared/formatters/money'
import type { CatalogSearch } from '@/shared/utils/catalog-search'
import { parseCategoryList, parseChainList, toggleCsv } from '@/shared/utils/catalog-search'
import { cn } from '@/shared/utils/cn'

interface CatalogFiltersProps {
  idPrefix: string
  search: CatalogSearch
  facets: NftListResponse['facets']
  onSearchChange: (patch: Partial<CatalogSearch>) => void
}

export function CatalogFilters({ idPrefix, search, facets, onSearchChange }: CatalogFiltersProps) {
  const selectedCategories = parseCategoryList(search.category)
  const selectedChains = parseChainList(search.chain)
  const urlMin = search.minPrice ?? facets.price.min
  const urlMax = search.maxPrice ?? facets.price.max
  const priceKey = `${urlMin}|${urlMax}`
  const [range, setRange] = useState([toCents(urlMin), toCents(urlMax)])
  const [syncedPrice, setSyncedPrice] = useState(priceKey)

  if (priceKey !== syncedPrice) {
    setSyncedPrice(priceKey)
    setRange([toCents(urlMin), toCents(urlMax)])
  }

  const minLabel = fromCents(range[0] ?? toCents(facets.price.min))
  const maxLabel = fromCents(range[1] ?? toCents(facets.price.max))

  return (
    <div className="bg-card space-y-8 p-5">
      <fieldset>
        <legend className="text-lg font-bold text-foreground">Coleções</legend>
        <ul className="mt-4 space-y-3 pl-2">
          {facets.categories.map((category) => {
            const selected = selectedCategories.includes(
              category.id as (typeof selectedCategories)[number],
            )
            return (
              <li key={category.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  className="flex w-full items-center justify-between text-left text-[15px]"
                  onClick={() =>
                    onSearchChange({
                      category: toggleCsv(search.category, category.id),
                      page: undefined,
                    })
                  }
                >
                  <span className={cn(selected ? 'text-accent' : 'text-secondary')}>
                    {category.label}
                  </span>
                  <span className={cn("font-bold", selected ? 'text-accent' : 'text-secondary')}>({category.count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <fieldset>
        <h2 className="text-lg font-bold">Faixa de preço</h2>
        <div className="pl-2">
          <Slider
            className="mt-4"
            min={toCents(facets.price.min)}
            max={toCents(facets.price.max)}
            step={1}
            value={range}
            onValueChange={setRange}
            aria-labelledby={`${idPrefix}-price`}
          />
          <p id={`${idPrefix}-price`} className="pt-4 text-[15px] text-foreground-soft">
            Preço: {minLabel} - {maxLabel} ETH
          </p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() =>
              onSearchChange({
                minPrice: minLabel === facets.price.min ? undefined : minLabel,
                maxPrice: maxLabel === facets.price.max ? undefined : maxLabel,
                page: undefined,
              })
            }
          >
            Aplicar
          </Button>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold">Rede</legend>
        <ul className="mt-4 space-y-3 pl-2">
          {facets.chains.map((chain) => {
            const selected = selectedChains.includes(chain.id as (typeof selectedChains)[number])
            return (
              <li key={chain.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  className={cn("flex w-full items-center justify-between text-left text-[15px]", selected ? 'text-accent' : 'text-secondary')}
                  onClick={() =>
                    onSearchChange({
                      chain: toggleCsv(search.chain, chain.id),
                      page: undefined,
                    })
                  }
                >
                  <span>
                    {chain.label}
                  </span>
                  <span className={cn("font-bold ", selected ? 'text-accent' : 'text-secondary')}>({chain.count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>
    </div >
  )
}
