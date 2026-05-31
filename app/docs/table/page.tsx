import { SiteHeader } from "@/components/site-header"
import { TablePreview } from "@/components/table-preview"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const usageCode = `import { Table } from "@/components/openui/table"

const columns = [
  { key: "id", label: "ID", type: "shortText", width: 96 },
  { key: "user", label: "User", type: "longText", grow: 2 },
  { key: "score", label: "Score", type: "number", align: "right" },
]

export function UsersTable({ users }) {
  return (
    <Table
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
    />
  )
}`

const selectionCode = `const [selectedRows, setSelectedRows] = React.useState<string[]>([])

<Table
  data={users}
  columns={columns}
  getRowId={(row) => row.id}
  selection={{
    selectedRows,
    onSelectedRowsChange: setSelectedRows,
  }}
/>`

const props = [
  ["data", "Rows to render."],
  ["columns", "Simple column config with key, label, type, width, render, and align."],
  ["column.type", "Width preset: text, longText, shortText, number, currency, date, status, or actions."],
  ["column.grow", "Controls how extra container width is shared. Text presets grow by default."],
  ["column.width", "Manual width override. Wins over the type preset."],
  ["column.minWidth", "Manual minimum width override. Wins over the type preset."],
  ["selection", "Adds checkbox selection. Pass selectedRows and onSelectedRowsChange."],
  ["resizable", "Enables column resizing. Default: true."],
  ["sortable", "Enables sorting. Default: true."],
  ["showUnsortedSortIcon", "Shows double arrows on sortable unsorted columns."],
  ["initialSort", "Defaults to the first sortable column ascending. Use false to remove."],
  ["scrollMode", "Use page scroll by default, or table scroll with scrollMode='table'."],
]

export default function TableDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="flex max-w-3xl flex-col gap-4">
          <Badge variant="secondary" className="w-fit">
            Component
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">Table</h1>
            <p className="text-base text-muted-foreground">
              A shadcn-compatible table with TanStack sorting, resizing, row
              selection, and virtualization.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-sm">
            <code>npx shadcn@latest add https://openuis.vercel.app/r/table.json</code>
          </pre>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Preview</h2>
          <TablePreview />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Use a simple column config instead of raw TanStack columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{usageCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selection</CardTitle>
              <CardDescription>
                Selection is controlled when you pass selectedRows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{selectionCode}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <tbody>
                {props.map(([name, description]) => (
                  <tr key={name} className="border-b last:border-b-0">
                    <td className="w-56 px-4 py-3 font-mono text-xs">{name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
