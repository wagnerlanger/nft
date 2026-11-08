import { setupWorker } from 'msw/browser'

import { authHandlers } from '@/mocks/handlers/auth.handlers'
import { cartHandlers } from '@/mocks/handlers/cart.handlers'
import { favoritesHandlers } from '@/mocks/handlers/favorites.handlers'
import { nftHandlers } from '@/mocks/handlers/nfts.handlers'
import { ordersHandlers } from '@/mocks/handlers/orders.handlers'
import { profileHandlers } from '@/mocks/handlers/profile.handlers'
import { quoteHandlers } from '@/mocks/handlers/quote.handlers'
import { walletsHandlers } from '@/mocks/handlers/wallets.handlers'
import { socketHandlers } from '@/mocks/socket/handlers'

export const worker = setupWorker(
  ...authHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...nftHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...quoteHandlers,
  ...ordersHandlers,
  ...socketHandlers,
)
