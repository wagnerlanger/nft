import { ArrowRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

export function CatalogPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}) {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null

  return (
    <nav aria-label="Paginação" className="mt-8 flex justify-end gap-2">
      {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
        <Button
          key={item}
          variant={item === page ? 'primary' : 'outline'}
          size="sm"
          className="border-card"
          aria-current={item === page ? 'page' : undefined}
          onClick={() => onPageChange(item)}
        >
          {item}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="px-2 border-card"
        aria-label="Próxima página"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <ArrowRightIcon className="size-5" />
      </Button>
    </nav>
  )
}
