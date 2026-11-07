import type { SVGProps } from 'react'

type AccountPlaceholderProps = {
  title: string
  description: string
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
}

export function AccountPlaceholder({ title, description, icon: Icon }: AccountPlaceholderProps) {
  return (
    <section>
      <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">{title}</h1>

      <div className="mt-16 flex flex-col items-center text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-card text-muted">
          <Icon className="size-12" />
        </div>
        <p className="mt-6 max-w-sm text-sm text-secondary">{description}</p>
      </div>
    </section>
  )
}
