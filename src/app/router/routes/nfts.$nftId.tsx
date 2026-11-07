import { createFileRoute } from '@tanstack/react-router'

import { NftDetailPage } from '@/features/nft-details/pages'

export const Route = createFileRoute('/nfts/$nftId')({
  component: NftDetailPage,
})
