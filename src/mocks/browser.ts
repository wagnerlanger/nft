import { setupWorker } from 'msw/browser'

import { nftHandlers } from '@/mocks/handlers/nfts.handlers'

export const worker = setupWorker(...nftHandlers)
