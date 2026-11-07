import { useNavigate, useRouter } from '@tanstack/react-router'

export function useHandleBack() {
  const navigate = useNavigate()
  const router = useRouter()
  return (to = '/') => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }
    void navigate({ to })
  }
}