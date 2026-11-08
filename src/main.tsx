import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { AppProviders } from '@/app/providers/app-providers'
import { router } from '@/app/router'

import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/500.css'
import '@fontsource/roboto-mono/700.css'
import '@/styles/globals.css'

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === 'false') return
  const { worker } = await import('@/mocks/browser')
  const { exposeDemoHelpers } = await import('@/mocks/reset')
  await worker.start({ onUnhandledFrame: 'bypass' })
  exposeDemoHelpers()
}

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root não encontrado.')

void enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
})
