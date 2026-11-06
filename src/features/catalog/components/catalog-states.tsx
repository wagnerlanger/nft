import { Button } from '@/components/ui/button'
import { NftCardSkeleton } from '@/features/catalog/components/nft-card'

export function FilterSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-5 w-32 bg-card" />
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-4 w-full bg-card" />
      ))}
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <NftCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function EmptyCatalog({ onClear }: { onClear: () => void }) {
  return (
    <div className="border border-border bg-card px-6 py-12 text-center">
      <p className="text-base text-foreground">Nenhum NFT corresponde a essa busca.</p>
      <Button className="mt-6" onClick={onClear}>
        Limpar filtros
      </Button>
    </div>
  )
}

export function CatalogError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="border border-destructive/50 bg-card px-6 py-12 text-center">
      <p className="text-base text-foreground">Não foi possível carregar o catálogo.</p>
      <Button className="mt-6" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}
