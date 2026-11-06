import { Link } from '@tanstack/react-router'

export function FeaturedBanner({ nftId }: { nftId: string }) {
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId }}
      className="group bg-card pt-5 px-5 block w-full rounded-b-3xl transition-all duration-300 ease-out border-t border-transparent hover:border-primary"
      aria-label="NFT em destaque, oferta limitada"
    >
      <p className="text-2xl font-bold text-accent">NFT EM DESTAQUE</p>
      <p className="mt-2 text-[22px] font-bold text-foreground text-center">OFERTA LIMITADA</p>
      <div className="-mx-5">
        <img
          src="/images/nft.png"
          alt=""
          className="mt-4 h-[368px] w-full object-cover rounded-3xl transition-transform duration-300 ease-out group-hover:-translate-y-2"
        />
      </div>
    </Link>
  )
}
