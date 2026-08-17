interface SectionTitleProps {
  icon: React.ReactNode
  title: string
  /** Optional trailing element, e.g. a badge or a link. */
  action?: React.ReactNode
}

/** Shared heading for the booking detail panels. */
export function SectionTitle({ icon, title, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
        <span className="text-slate-500">{icon}</span>
        {title}
      </h2>
      {action}
    </div>
  )
}
