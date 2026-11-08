import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { cartKeys } from '@/features/cart/hooks/use-cart'
import type { CartResponse } from '@/features/cart/types'
import type { Nft, NftListResponse } from '@/features/catalog/types'
import { ordersKeys } from '@/features/orders/hooks/use-orders'
import type { Order } from '@/features/orders/types'
import { quoteKeys } from '@/features/quote/hooks/use-quote'
import {
  nftUpdatedEventSchema,
  orderUpdatedEventSchema,
  type NftUpdatedEvent,
} from '@/infrastructure/socket/events'
import {
  connectSocket,
  disconnectSocket,
  emitSocketAuth,
  getSocketInstance,
} from '@/infrastructure/socket/socket-client'

type RealtimeNotice = {
  id: string
  message: string
}

type SocketContextValue = {
  connected: boolean
  notice: RealtimeNotice | null
  dismissNotice: () => void
  requestDemoPriceChange: (nftId: string) => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { session, isAuthenticated } = useAuth()
  const [connected, setConnected] = useState(false)
  const [notice, setNotice] = useState<RealtimeNotice | null>(null)
  const seenEventsRef = useRef(new Set<string>())
  const nftVersionsRef = useRef(new Map<string, number>())
  const orderVersionsRef = useRef(new Map<string, number>())

  const dismissNotice = useCallback(() => setNotice(null), [])

  const applyNftUpdated = useCallback(
    (event: NftUpdatedEvent) => {
      if (seenEventsRef.current.has(event.eventId)) return
      seenEventsRef.current.add(event.eventId)

      const previousVersion = nftVersionsRef.current.get(event.resourceId) ?? 0
      if (event.version <= previousVersion) return
      nftVersionsRef.current.set(event.resourceId, event.version)

      const { nftId, priceEth } = event.payload

      queryClient.setQueriesData<NftListResponse>({ queryKey: ['nfts', 'list'] }, (current) => {
        if (!current) return current
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === nftId ? { ...item, priceEth } : item,
          ),
          highlight:
            current.highlight?.id === nftId
              ? { ...current.highlight, priceEth }
              : current.highlight,
        }
      })

      queryClient.setQueryData<Nft>(['nfts', 'detail', nftId], (current) =>
        current ? { ...current, priceEth } : current,
      )

      queryClient.setQueryData<CartResponse>(cartKeys.all, (current) => {
        if (!current) return current
        const nextItems = current.items.map((item) =>
          item.nftId === nftId ? { ...item, unitPriceEth: priceEth } : item,
        )
        const changed = nextItems.some(
          (item, index) => item.unitPriceEth !== current.items[index]?.unitPriceEth,
        )
        if (!changed) return current
        return { ...current, items: nextItems }
      })

      void queryClient.invalidateQueries({ queryKey: quoteKeys.all })

      setNotice({
        id: event.eventId,
        message: `Preço atualizado para o NFT ${nftId}: ${priceEth} ETH.`,
      })
    },
    [queryClient],
  )

  const applyOrderUpdated = useCallback(
    (order: Order, eventId: string, version: number, userId: string) => {
      if (session && userId !== session.user.id) return
      if (seenEventsRef.current.has(eventId)) return
      seenEventsRef.current.add(eventId)

      const previousVersion = orderVersionsRef.current.get(order.id) ?? 0
      if (version <= previousVersion) return
      orderVersionsRef.current.set(order.id, version)

      queryClient.setQueryData<Order>(ordersKeys.detail(order.id), order)
      queryClient.setQueryData<Order[]>(ordersKeys.all, (current) => {
        if (!current) return [order]
        const index = current.findIndex((item) => item.id === order.id)
        if (index < 0) return [order, ...current]
        const next = [...current]
        next[index] = order
        return next
      })

      if (order.status === 'confirmed') {
        void queryClient.invalidateQueries({ queryKey: cartKeys.all })
        void queryClient.invalidateQueries({ queryKey: quoteKeys.all })
        setNotice({
          id: eventId,
          message: 'Pedido confirmado na rede.',
        })
      } else if (order.status === 'refused') {
        setNotice({
          id: eventId,
          message: order.refuseReason ?? 'Pedido recusado pela rede.',
        })
      }
    },
    [queryClient, session],
  )

  useEffect(() => {
    let active = true

    void connectSocket().then((socket) => {
      if (!active) return

      const onConnect = () => {
        setConnected(true)
        if (session?.token) emitSocketAuth(session.token)
        void queryClient.invalidateQueries({ queryKey: cartKeys.all })
        void queryClient.invalidateQueries({ queryKey: ordersKeys.all })
      }

      const onDisconnect = () => setConnected(false)

      const onNftUpdated = (raw: unknown) => {
        const parsed = nftUpdatedEventSchema.safeParse(raw)
        if (parsed.success) applyNftUpdated(parsed.data)
      }

      const onOrderUpdated = (raw: unknown) => {
        const parsed = orderUpdatedEventSchema.safeParse(raw)
        if (parsed.success) {
          applyOrderUpdated(
            parsed.data.payload,
            parsed.data.eventId,
            parsed.data.version,
            parsed.data.userId,
          )
        }
      }

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)
      socket.on('nft.updated', onNftUpdated)
      socket.on('order.updated', onOrderUpdated)

      if (socket.connected) onConnect()
    })

    return () => {
      active = false
      const socket = getSocketInstance()
      socket?.off('nft.updated')
      socket?.off('order.updated')
      // Keep connection across layout remounts; disconnect only on full unmount via provider unmount
    }
  }, [applyNftUpdated, applyOrderUpdated, queryClient, session?.token])

  useEffect(() => {
    if (isAuthenticated && session?.token) {
      emitSocketAuth(session.token)
    }
  }, [isAuthenticated, session?.token])

  useEffect(() => {
    return () => {
      disconnectSocket()
    }
  }, [])

  const requestDemoPriceChange = useCallback((nftId: string) => {
    getSocketInstance()?.emit('demo.price_change', nftId)
  }, [])

  const value = useMemo(
    () => ({
      connected,
      notice,
      dismissNotice,
      requestDemoPriceChange,
    }),
    [connected, dismissNotice, notice, requestDemoPriceChange],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export function RealtimeNoticeBanner() {
  const { notice, dismissNotice, connected } = useSocket()

  if (!notice) {
    return (
      <div className="sr-only" aria-live="polite">
        {connected ? 'Tempo real conectado.' : 'Tempo real desconectado.'}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-40 flex w-[min(100%-2rem,32rem)] -translate-x-1/2 items-start gap-3 border border-primary bg-card px-4 py-3 text-sm shadow-lg md:bottom-6"
    >
      <p className="flex-1 text-foreground">{notice.message}</p>
      <button
        type="button"
        className="text-primary underline-offset-2 hover:underline"
        onClick={dismissNotice}
      >
        Fechar
      </button>
    </div>
  )
}
