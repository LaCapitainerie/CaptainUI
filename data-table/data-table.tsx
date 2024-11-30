"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar, keyValueType } from "./data-table-toolbar"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableProps<TData, TValue, TColumns extends ColumnDef<TData, TValue>[]> {
  columns: TColumns
  data: TData[]
  keyValue: keyValueType<TData>
  textFilterColumn: keyof TData & string
  apiUrl: string
  primaryKey: keyof TData & string
}

// interface DataTableProps<TData, TValue, TColumnKey extends keyof TData & string> {
//   columns: Array<ColumnDef<TData, TValue> & { accessorKey: TColumnKey }>; // Enforces valid accessorKey
//   data: TData[];
//   keyValue: TColumnKey; // Restricted to keys present in the columns
//   textFilterColumn: TColumnKey; // Restricted to keys present in the columns
//   apiUrl: string;
//   primaryKey: TColumnKey; // Restricted to keys present in the columns
// }

export function DataTable<TData, TValue, TColumns extends ColumnDef<TData, TValue>[]>({
  columns,
  data,
  keyValue,
  textFilterColumn,
  primaryKey,
}: DataTableProps<TData, TValue, TColumns>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const router = useRouter();

  React.useEffect(() => {

    const primaryKeys = data
      .filter((_, i) => i in Object.keys(rowSelection))
      .map((e) => e[primaryKey])

    router.push(`?perimeters=${primaryKeys.join(",")}`)

  }, [data, primaryKey, router, rowSelection])

  return (

    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={columns.length}
          searchableColumnCount={1}
          filterableColumnCount={Object.keys(keyValue).length}
          cellWidths={columns.map(() => "10rem")}
          shrinkZero
        />
      }
    >
      <div className="space-y-4">

        <DataTableToolbar table={table} keyValue={keyValue} filterColumn={textFilterColumn} />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </Suspense>


  )
}
