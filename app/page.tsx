import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { TablePreview } from "@/components/table-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="flex max-w-3xl flex-col gap-5">
          <Badge variant="secondary" className="w-fit">
            Registry
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              OpenUI
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Shadcn-compatible components with practical defaults and simple
              install commands.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs/table">View table docs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/r/table.json">Open registry item</Link>
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-sm">
            <code>npx shadcn@latest add https://openuis.vercel.app/r/table.json</code>
          </pre>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
            <p className="text-sm text-muted-foreground">
              The first registry component is a virtualized data table.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <CardDescription>
                Sorting, resizing, virtualization, and optional row selection.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <TablePreview />
              <Button asChild variant="outline" className="w-fit">
                <Link href="/docs/table">Read docs</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
