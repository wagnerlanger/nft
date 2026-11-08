import type { Socket } from 'socket.io-client'

import { getStoredSessionToken } from '@/infrastructure/http/axios'

let socketPromise: Promise<Socket> | null = null
let socketInstance: Socket | null = null

export function getSocketUrl() {
  return window.location.origin
}

export async function connectSocket() {
  if (socketInstance?.connected) return socketInstance
  if (socketPromise) return socketPromise

  socketPromise = (async () => {
    // Lazy import so MSW can patch WebSocket first (main.tsx starts worker before AppProviders).
    const { io } = await import('socket.io-client')
    const socket = io(getSocketUrl(), {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 800,
    })

    socket.on('connect', () => {
      const token = getStoredSessionToken()
      if (token) {
        socket.emit('auth', token)
      }
    })

    socketInstance = socket
    return socket
  })()

  try {
    return await socketPromise
  } catch (error) {
    socketPromise = null
    throw error
  }
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.removeAllListeners()
    socketInstance.disconnect()
    socketInstance = null
  }
  socketPromise = null
}

export function getSocketInstance() {
  return socketInstance
}

export function emitSocketAuth(token: string | null) {
  if (!socketInstance?.connected) return
  if (token) {
    socketInstance.emit('auth', token)
  }
}
