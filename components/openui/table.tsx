"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnSizingState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Align = "left" | "center" | "right"
type SortDirection = "asc" | "desc"

export type OpenUITableColumn<TData> = {
  key: Extract<keyof TData, string> | string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean
  resizable?: boolean
  align?: Align
  render?: (row: TData) => React.ReactNode
  className?: string
}

export type OpenUITableSelection = {
  selectedRows?: string[]
  onSelectedRowsChange?: (rows: string[]) => void
  defaultSelectedRows?: string[]
}

export type OpenUITableProps<TData> = {
  data: TData[]
  columns: OpenUITableColumn<TData>[]
  getRowId?: (row: TData, index: number) => string
  selection?: OpenUITableSelection
  resizable?: boolean
  sortable?: boolean
  showUnsortedSortIcon?: boolean
  initialSort?: { key: string; direction?: SortDirection } | false
  scrollMode?: "page" | "table"
  tableHeight?: number
  rowHeight?: number
  emptyText?: string
  className?: string
}

const alignClass: Record<Align, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
}

function getValue<TData>(row: TData, key: string) {
  return (row as Record<string, unknown>)[key]
}

function toRowSelection(ids: string[]): RowSelectionState {
  return ids.reduce<RowSelectionState>((state, id) => {
    state[id] = true
    return state
  }, {})
}

function getNextValue<TValue>(
  updater: TValue | ((old: TValue) => TValue),
  old: TValue
) {
  return typeof updater === "function"
    ? (updater as (value: TValue) => TValue)(old)
    : updater
}

export function Table<TData>({
  data,
  columns,
  getRowId,
  selection,
  resizable = true,
  sortable = true,
  showUnsortedSortIcon = false,
  initialSort,
  scrollMode = "page",
  tableHeight = 560,
  rowHeight = 56,
  emptyText = "No results.",
  className,
}: OpenUITableProps<TData>) {
  const isSelectionControlled = selection?.selectedRows !== undefined
  const [internalSelectedRows, setInternalSelectedRows] = React.useState(
    selection?.defaultSelectedRows ?? []
  )
  const selectedRows = selection?.selectedRows ?? internalSelectedRows
  const rowSelection = React.useMemo(
    () => toRowSelection(selectedRows),
    [selectedRows]
  )
  const hasSelection = selection !== undefined

  const initialSorting = React.useMemo<SortingState>(() => {
    if (!sortable || initialSort === false) {
      return []
    }

    if (initialSort?.key) {
      return [{ id: initialSort.key, desc: initialSort.direction === "desc" }]
    }

    const firstSortableColumn = columns.find((column) => column.sortable !== false)

    return firstSortableColumn
      ? [{ id: String(firstSortableColumn.key), desc: false }]
      : []
  }, [columns, initialSort, sortable])

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})

  const tableColumns = React.useMemo<ColumnDef<TData>[]>(
    () => [
      ...(hasSelection
        ? [
            {
              id: "_select",
              size: 44,
              minSize: 44,
              maxSize: 44,
              enableSorting: false,
              enableResizing: false,
              header: ({ table }) => (
                <Checkbox
                  aria-label="Select all rows"
                  checked={
                    table.getIsAllRowsSelected() ||
                    (table.getIsSomeRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllRowsSelected(Boolean(value))
                  }
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
                />
              ),
            } satisfies ColumnDef<TData>,
          ]
        : []),
      ...columns.map(
        (column): ColumnDef<TData> => ({
          id: String(column.key),
          accessorFn: (row) => getValue(row, String(column.key)),
          size: column.width ?? 160,
          minSize: column.minWidth ?? 96,
          enableSorting: sortable && column.sortable !== false,
          enableResizing: resizable && column.resizable !== false,
          header: column.label,
          cell: ({ row }) => {
            const value = getValue(row.original, String(column.key))

            return column.render ? column.render(row.original) : String(value ?? "")
          },
          meta: {
            align: column.align ?? "left",
            className: column.className,
          },
        })
      ),
    ],
    [columns, hasSelection, resizable, sortable]
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnSizing,
      rowSelection,
    },
    defaultColumn: {
      minSize: 96,
      size: 160,
    },
    getRowId: (row, index) => getRowId?.(row, index) ?? String(index),
    enableRowSelection: hasSelection,
    enableSortingRemoval: true,
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: (updater) => {
      const next = getNextValue(updater, rowSelection)
      const ids = Object.keys(next).filter((id) => next[id])

      if (!isSelectionControlled) {
        setInternalSelectedRows(ids)
      }

      selection?.onSelectedRowsChange?.(ids)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows
  const tableRootRef = React.useRef<HTMLDivElement>(null)
  const tableScrollRef = React.useRef<HTMLDivElement>(null)
  const [scrollMargin, setScrollMargin] = React.useState(0)
  const [containerWidth, setContainerWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    if (scrollMode !== "page" || !tableRootRef.current) {
      return
    }

    const measure = () =>
      setScrollMargin(
        tableRootRef.current
          ? tableRootRef.current.getBoundingClientRect().top + window.scrollY
          : 0
      )

    measure()
    window.addEventListener("resize", measure)

    return () => window.removeEventListener("resize", measure)
  }, [scrollMode])

  React.useLayoutEffect(() => {
    if (!tableRootRef.current) {
      return
    }

    const root = tableRootRef.current
    const updateWidth = () => setContainerWidth(root.clientWidth)
    const observer = new ResizeObserver(updateWidth)

    updateWidth()
    observer.observe(root)

    return () => observer.disconnect()
  }, [])

  const windowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    overscan: 12,
    scrollMargin,
    enabled: scrollMode === "page",
    initialRect: { width: 1200, height: 800 },
  })

  const tableVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    overscan: 12,
    getScrollElement: () => tableScrollRef.current,
    enabled: scrollMode === "table",
  })

  const virtualizer =
    scrollMode === "page" ? windowVirtualizer : tableVirtualizer
  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const leafHeaders = table.getFlatHeaders()
  const rawTableWidth = table.getTotalSize()
  const tableWidth = Math.max(rawTableWidth, containerWidth)
  const fillColumnId = leafHeaders.at(-1)?.column.id
  const extraWidth = Math.max(0, tableWidth - rawTableWidth)
  const getColumnWidth = React.useCallback(
    (columnId: string, size: number) =>
      columnId === fillColumnId ? size + extraWidth : size,
    [extraWidth, fillColumnId]
  )

  function resizeWithNeighbor(
    headerIndex: number,
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    const header = leafHeaders[headerIndex]
    const nextHeader = leafHeaders[headerIndex + 1]

    if (!header?.column.getCanResize() || !nextHeader) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    const startX = event.clientX
    const startSize = getColumnWidth(header.column.id, header.column.getSize())
    const nextStartSize = getColumnWidth(
      nextHeader.column.id,
      nextHeader.column.getSize()
    )
    const minSize = header.column.columnDef.minSize ?? 96
    const nextMinSize = nextHeader.column.columnDef.minSize ?? 96

    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX
      const clampedDelta = Math.min(
        Math.max(delta, minSize - startSize),
        nextStartSize - nextMinSize
      )

      setColumnSizing((current) => ({
        ...current,
        [header.column.id]: startSize + clampedDelta,
        [nextHeader.column.id]: nextStartSize - clampedDelta,
      }))
    }

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

  return (
    <div
      ref={tableRootRef}
      className={cn(
        "relative rounded-md border bg-background",
        scrollMode === "page" && "overflow-x-auto overflow-y-clip",
        scrollMode === "table" && "overflow-hidden",
        className
      )}
    >
      <div
        ref={tableScrollRef}
        className={cn(
          scrollMode === "table" && "overflow-auto",
          scrollMode === "page" && "overflow-visible"
        )}
        style={scrollMode === "table" ? { height: tableHeight } : undefined}
      >
        <table
          className="grid w-full caption-bottom text-sm"
          style={{ minWidth: rawTableWidth, width: tableWidth }}
        >
          <TableHeader className="grid">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex">
                {headerGroup.headers.map((header, headerIndex) => {
                  const canSort = header.column.getCanSort()
                  const sortState = header.column.getIsSorted()
                  const meta = header.column.columnDef.meta as
                    | { align?: Align }
                    | undefined
                  const align = meta?.align ?? "left"
                  const showSortIcon =
                    sortState || (showUnsortedSortIcon && canSort)

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "group relative flex items-center px-3",
                        alignClass[align]
                      )}
                      style={{
                        width: getColumnWidth(header.column.id, header.getSize()),
                        minWidth: header.column.columnDef.minSize,
                      }}
                    >
                      <button
                        type="button"
                        className={cn(
                          "inline-flex min-w-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider",
                          canSort && "cursor-pointer"
                        )}
                        disabled={!canSort}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {showSortIcon ? (
                          sortState === "asc" ? (
                            <ArrowUp data-icon="inline-end" />
                          ) : sortState === "desc" ? (
                            <ArrowDown data-icon="inline-end" />
                          ) : (
                            <ChevronsUpDown data-icon="inline-end" />
                          )
                        ) : null}
                      </button>
                      {resizable &&
                      header.column.getCanResize() &&
                      headerIndex < leafHeaders.length - 1 ? (
                        <button
                          type="button"
                          aria-label="Resize column"
                          className="absolute inset-y-2 right-0 w-3 cursor-col-resize border-r border-transparent outline-none transition-colors group-hover:border-ring focus-visible:border-ring active:border-ring"
                          onPointerDown={(event) =>
                            resizeWithNeighbor(headerIndex, event)
                          }
                        />
                      ) : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative grid" style={{ height: totalSize }}>
            {virtualRows.length ? (
              virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="absolute flex w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${
                        scrollMode === "page"
                          ? virtualRow.start - scrollMargin
                          : virtualRow.start
                      }px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | { align?: Align; className?: string }
                        | undefined
                      const align = meta?.align ?? "left"

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "flex items-center px-3",
                            alignClass[align],
                            meta?.className
                          )}
                          style={{
                            width: getColumnWidth(
                              cell.column.id,
                              cell.column.getSize()
                            ),
                            minWidth: cell.column.columnDef.minSize,
                          }}
                        >
                          <span className="truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow className="flex">
                <TableCell className="flex h-24 w-full items-center justify-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
