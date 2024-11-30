"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

type AuthorizedType = boolean | string

type AuthorizedKey<T> = {
  [K in keyof T]: T[K] extends AuthorizedType ? K : never
}[keyof T]

type BooleanObject = {
  label: string
  value: boolean
  icon?: React.ComponentType<{ className?: string }>
}

type EnumObject = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type keyValueType<TData> = {
  [K in AuthorizedKey<TData>]: (TData[K] extends boolean ? BooleanObject : EnumObject)[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  keyValue: keyValueType<TData>
  filterColumn: keyof TData & string
}

export function DataTableToolbar<TData>({
  table,
  keyValue,
  filterColumn
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${filterColumn}...`}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {
          Object.entries(keyValue).map(([key, value]) => {
            return table.getColumn(key) && (
              <DataTableFacetedFilter
                key={key}
                column={table.getColumn(key)}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                options={value as any} />
            )
          })
        }
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
