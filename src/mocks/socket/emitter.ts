import Decimal from 'decimal.js'

import { applyNftPriceUpdate, findNft } from '@/mocks/database/catalog'
import type { Order } from '@/features/orders/types'

type ConnectedClient = {
  emit: (event: string, data: unknown) => void
  userId: string | null
}

const connectedClients = new Set<ConnectedClient>()

export function registerSocketClient(client: ConnectedClient) {
  connectedClients.add(client)
  return () => {
    connectedClients.delete(client)
  }
}

export function broadcastSocketEvent(
  event: string,
  data: unknown,
  onlyUserId?: string | null,
) {
  for (const client of connectedClients) {
    if (onlyUserId && client.userId !== onlyUserId) continue
    client.emit(event, data)
  }
}

export function emitNftUpdated(nftId: string, priceEth: string) {
  const update = applyNftPriceUpdate(nftId, priceEth)
  broadcastSocketEvent('nft.updated', {
    eventId: crypto.randomUUID(),
    resourceId: nftId,
    version: update.version,
    userId: null,
    payload: {
      nftId,
      priceEth: update.priceEth,
    },
  })
}

export function bumpCartItemPriceForDemo(nftId: string) {
  const nft = findNft(nftId)
  if (!nft) return
  const nextPrice = new Decimal(nft.priceEth).times('1.08').toFixed(3)
  emitNftUpdated(nftId, nextPrice)
}

export function emitOrderUpdated(order: Order) {
  broadcastSocketEvent(
    'order.updated',
    {
      eventId: crypto.randomUUID(),
      resourceId: order.id,
      version: order.version,
      userId: order.userId,
      payload: order,
    },
    order.userId,
  )
}
