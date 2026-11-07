import { setupWorker } from 'msw/browser'

import { authHandlers } from '@/mocks/handlers/auth.handlers'
import { cartHandlers } from '@/mocks/handlers/cart.handlers'
import { favoritesHandlers } from '@/mocks/handlers/favorites.handlers'
import { nftHandlers } from '@/mocks/handlers/nfts.handlers'

export const worker = setupWorker(
  ...authHandlers,
  ...nftHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
)
