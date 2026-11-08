import { BrandLogo } from '@/components/brand-logo'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/features/auth/auth-context'
import { LoginForm } from '@/features/auth/components/login-form'
import { RegisterForm } from '@/features/auth/components/register-form'
import { cn } from '@/shared/utils/cn'

export function AuthModal() {
  const { authOpen, authTab, closeAuth, setAuthTab } = useAuth()

  return (
    <Dialog
      open={authOpen}
      onOpenChange={(open) => {
        if (!open) closeAuth()
      }}
    >
      <DialogContent className="max-md:p-5 max-md:pt-12 md:w-[min(100%-1.5rem,500px)] md:p-14 flex flex-col items-center justify-center">
        <div className="mb-5 text-center md:mb-6">
          <div className="md:hidden">
            <BrandLogo className="text-base" />
          </div>

          <div className="hidden items-center justify-center gap-3 text-lg font-bold md:flex">
            <button
              type="button"
              className={cn(
                'transition-colors',
                authTab === 'login' ? 'text-primary' : 'text-foreground hover:text-accent',
              )}
              onClick={() => setAuthTab('login')}
            >
              Entrar
            </button>
            <span className="text-primary -mt-1" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={cn(
                'transition-colors',
                authTab === 'register' ? 'text-primary' : 'text-foreground hover:text-accent',
              )}
              onClick={() => setAuthTab('register')}
            >
              Criar conta
            </button>
          </div>

          <DialogTitle
            className={cn(
              'text-base font-bold text-foreground md:sr-only',
              'mt-6 md:mt-0',
            )}
          >
            {authTab === 'login' ? 'Entrar' : 'Criar perfil de colecionador'}
          </DialogTitle>

          <DialogDescription
            className={cn(
              'text-sm text-foreground',
              'sr-only md:not-sr-only md:mt-3',
            )}
          >
            {authTab === 'login'
              ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
              : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
          </DialogDescription>
        </div>

        {authTab === 'login' ? <LoginForm /> : <RegisterForm />}

        <p className="mt-6 text-center text-sm text-foreground md:hidden">
          {authTab === 'login' ? (
            <button
              type="button"
              className="transition-colors hover:text-primary"
              onClick={() => setAuthTab('register')}
            >
              Novo na Kurio? Crie uma conta
            </button>
          ) : (
            <button
              type="button"
              className="transition-colors hover:text-primary"
              onClick={() => setAuthTab('login')}
            >
              Já tem uma conta? Entre
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  )
}
