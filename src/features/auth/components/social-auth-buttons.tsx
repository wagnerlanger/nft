import { useState } from 'react'

import { FacebookBrandIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

export function SocialAuthButtons() {
  const [notice, setNotice] = useState<string | null>(null)

  function handleUnavailable(provider: string) {
    setNotice(`Continuar com ${provider} ainda não está disponível nesta demonstração.`)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm text-foreground">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-4 justify-center border-border-soft text-muted font-normal"
        onClick={() => handleUnavailable('Google')}
      >
        <GoogleIcon className="size-5" />
        Continuar com Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-4 justify-center border-border-soft text-muted font-normal"
        onClick={() => handleUnavailable('Facebook')}
      >
        <FacebookBrandIcon className="size-5" />
        Continuar com Facebook
      </Button>
      {notice ? (
        <p className="text-center text-xs text-secondary" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  )
}
