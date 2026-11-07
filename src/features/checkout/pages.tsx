import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10 xl:px-[120px]">
      <h1 className="text-2xl font-bold md:text-3xl">Pagamento</h1>
      <p className="mt-3 max-w-lg text-sm text-secondary">
        A tela de pagamento será implementada na próxima etapa. Seu carrinho permanece salvo.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/cart">Voltar ao carrinho</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/" hash="catalogo">
            Continuar explorando
          </Link>
        </Button>
      </div>
    </main>
  )
}
