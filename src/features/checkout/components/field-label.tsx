import type { ReactNode } from 'react'

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-foreground-soft">
      {children}
      {required ? <span className="text-destructive">*</span> : null}
    </label>
  )
}
