import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type CatalogFiltersUiValue = {
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  openFilters: () => void
  closeFilters: () => void
  toggleFilters: () => void
}

const CatalogFiltersUiContext = createContext<CatalogFiltersUiValue | null>(null)

export function CatalogFiltersUiProvider({ children }: { children: ReactNode }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const openFilters = useCallback(() => setFiltersOpen(true), [])
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const toggleFilters = useCallback(() => setFiltersOpen((open) => !open), [])

  const value = useMemo(
    () => ({
      filtersOpen,
      setFiltersOpen,
      openFilters,
      closeFilters,
      toggleFilters,
    }),
    [filtersOpen, openFilters, closeFilters, toggleFilters],
  )

  return (
    <CatalogFiltersUiContext.Provider value={value}>{children}</CatalogFiltersUiContext.Provider>
  )
}

export function useCatalogFiltersUi() {
  const context = useContext(CatalogFiltersUiContext)
  if (!context) {
    throw new Error('useCatalogFiltersUi must be used within CatalogFiltersUiProvider')
  }
  return context
}
