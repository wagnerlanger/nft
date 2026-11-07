export function SectionTitlePage({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">{title}</h1>
    </section>
  )
}
