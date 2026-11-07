import { Link } from '@tanstack/react-router'

export function NftBreadcrumbs() {

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-foreground-soft hidden md:block">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted">
          /
        </li>
        <li>
          <Link to="/" hash="catalogo" className="hover:text-primary">
            Mercado
          </Link>
        </li>
      </ol>
    </nav>
  )
}
