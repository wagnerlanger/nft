import { createFileRoute } from '@tanstack/react-router'

import { NftInterimPage } from '@/features/catalog/pages'

export const Route = createFileRoute('/nfts/$nftId')({
  component: NftInterimPage,
})
