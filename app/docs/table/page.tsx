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

const primitiveCode = `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/openui/table"

export function InvoicesTable() {
  return (
    <Table>
      <TableCaption>A list of invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
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

const widthCode = `const columns = [
  { key: "name", label: "Name", type: "text" },
  { key: "description", label: "Description", type: "longText", grow: 3 },
  { key: "net", label: "Net", type: "currency", align: "right", grow: false },
]

// Extra space is shared by growable columns.
// Too little space keeps min widths and uses horizontal scroll.`

const footerCode = `const columns = [
  { key: "collected", label: "Collected", type: "currency", footer: "$1,301.00" },
  { key: "cost", label: "Cost", type: "currency", footer: "$726.55" },
  {
    key: "net",
    label: "Net",
    type: "currency",
    align: "right",
    footer: ({ rows }) =>
      rows.reduce((total, row) => total + row.net, 0).toLocaleString(),
  },
]`

const props = [
  ["data", "Rows to render."],
  ["columns", "Simple column config with key, label, type, width, render, and align."],
  ["column.type", "Width preset: text, longText, shortText, number, currency, date, status, or actions."],
  ["column.grow", "Controls how extra container width is shared. Text presets grow by default. Use false to keep a column compact."],
  ["column.width", "Manual width override. Wins over the type preset."],
  ["column.minWidth", "Manual minimum width override. Wins over the type preset."],
  ["column.footer", "Footer cell content. Pass a value or a function using data and rendered rows."],
  ["selection", "Adds checkbox selection. Pass selectedRows and onSelectedRowsChange."],
  ["resizable", "Enables column resizing. Default: true."],
  ["sortable", "Enables sorting. Default: true."],
  ["showUnsortedSortIcon", "Shows a muted chevron on sortable unsorted columns."],
  ["initialSort", "Defaults to the first sortable column ascending. Use false to start unsorted."],
  ["scrollMode", "Use page scroll by default, or table scroll with scrollMode='table'."],
  ["caption", "Optional caption for the advanced data table."],
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
              selection, virtualization, growth-based widths, and full-header
              sorting. It also exports the same primitive parts as shadcn table.
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
              <CardTitle>Primitive usage</CardTitle>
              <CardDescription>
                Use the same exported parts as shadcn table when you need full
                markup control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{primitiveCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Column widths</CardTitle>
              <CardDescription>
                Presets handle common column sizes, and grow controls how extra
                space is shared.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{widthCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>
                Add footer cells to advanced columns for totals or summary
                values.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{footerCode}</code>
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
          <h2 className="text-2xl font-semibold tracking-tight">
            Header behavior
          </h2>
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Hovering a header shows the available resize dividers. Sortable
            columns can be sorted by clicking anywhere inside the header cell.
            Active sorting toggles between ascending and descending.
          </div>
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
