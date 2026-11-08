import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'

import { getSessionByToken } from '@/mocks/database/auth'
import { subscribeOrderUpdates } from '@/mocks/database/orders'
import {
  bumpCartItemPriceForDemo,
  emitOrderUpdated,
  registerSocketClient,
} from '@/mocks/socket/emitter'

function socketLinkUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}/socket.io/`
}

export const kurioSocket = ws.link(socketLinkUrl())

subscribeOrderUpdates((order) => {
  emitOrderUpdated(order)
})

export const socketHandlers = [
  kurioSocket.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection)

    const wrapped = {
      userId: null as string | null,
      emit: (event: string, data: unknown) => {
        io.client.emit(event, data)
      },
    }
    const unregister = registerSocketClient(wrapped)

    io.client.on('auth', (_event: unknown, payload: unknown) => {
      if (typeof payload === 'string') {
        const session = getSessionByToken(payload)
        wrapped.userId = session?.user.id ?? null
        return
      }
      if (
        payload &&
        typeof payload === 'object' &&
        'userId' in payload &&
        typeof (payload as { userId: unknown }).userId === 'string'
      ) {
        wrapped.userId = (payload as { userId: string }).userId
      }
    })

    io.client.on('demo.price_change', (_event: unknown, nftId: unknown) => {
      if (typeof nftId === 'string') {
        bumpCartItemPriceForDemo(nftId)
      }
    })

    connection.client.addEventListener('close', () => {
      unregister()
    })
  }),
]
