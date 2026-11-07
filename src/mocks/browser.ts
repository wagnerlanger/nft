import { setupWorker } from 'msw/browser'

import { authHandlers } from '@/mocks/handlers/auth.handlers'
import { nftHandlers } from '@/mocks/handlers/nfts.handlers'

export const worker = setupWorker(...authHandlers, ...nftHandlers)
