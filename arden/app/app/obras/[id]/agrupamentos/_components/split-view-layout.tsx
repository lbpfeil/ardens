interface SplitViewLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
}

export function SplitViewLayout({ leftPanel, rightPanel }: SplitViewLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/5">{leftPanel}</div>
      <div className="w-full lg:w-3/5">{rightPanel}</div>
    </div>
  )
}
