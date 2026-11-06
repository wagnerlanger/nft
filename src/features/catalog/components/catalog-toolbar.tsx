import { ChevronDownIcon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CATALOG_TABS, SORT_OPTIONS, type CatalogTabId, type SortId } from '@/shared/constants/catalog'
import { cn } from '@/shared/utils/cn'

export function CatalogToolbar({
  tab,
  sort,
  onTabChange,
  onSortChange,
}: {
  tab: CatalogTabId
  sort: SortId
  onTabChange: (tab: CatalogTabId) => void
  onSortChange: (sort: SortId) => void
}) {
  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div role="tablist" aria-label="Recortes do catálogo" className="flex flex-wrap gap-x-5 gap-y-2">
        {CATALOG_TABS.map((item) => {
          const selected = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                'border-b-2 pb-1 text-[15px] font-medium cursor-pointer',
                selected ? 'border-primary text-accent' : 'border-transparent text-foreground-soft hover:text-primary',
              )}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 text-[15px] text-foreground-soft">
          <span>Ordenar por:</span>
          <span>{sortLabel}</span>
          <ChevronDownIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.id} onSelect={() => onSortChange(option.id)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
