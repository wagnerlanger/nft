export interface CartItem {
  nftId: string
  quantity: number
  unitPriceEth: string
  name: string
  imageUrl: string
  tokenNumber: number
}

export interface CartResponse {
  items: CartItem[]
  itemCount: number
}
