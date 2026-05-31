import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Image
            src="/black_logo_transparent.png"
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
            priority
          />
          <span>OpenUI</span>
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
