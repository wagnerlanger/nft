import { useAuth } from '@/features/auth/auth-context'
import { LoginForm } from '@/features/auth/components/login-form'
import { RegisterForm } from '@/features/auth/components/register-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
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
      <DialogContent className="w-[min(100%-1.5rem,500px)] max-md:max-h-[min(100vh-1.5rem,40rem)] max-md:rounded-2xl max-md:p-5 max-md:pt-10 md:p-14">
        <div className="mb-5 text-center md:mb-6">
          <div className="flex items-center justify-center gap-3 text-base font-bold md:text-lg">
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
          <DialogTitle className="sr-only">
            {authTab === 'login' ? 'Entrar' : 'Criar conta'}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm text-foreground">
            {authTab === 'login'
              ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
              : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
          </DialogDescription>
        </div>

        {authTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </DialogContent>
    </Dialog>
  )
}
