import Link from "next/link"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold">
          OpenUI
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/table">Components</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/r/table.json">Registry</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

