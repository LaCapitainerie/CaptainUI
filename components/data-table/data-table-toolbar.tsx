"use client"

import { X } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AuthorizedKey } from "@/components/captainui/utils"

import { DataTableViewOptions } from "./data-table-view-options"
import { BooleanObject, DataTableFacetedFilter, EnumObject } from "./data-table-faceted-filter"

type Authorized = boolean | string

export type keyValueType<TData> = {
  [K in AuthorizedKey<TData, Authorized>]: (TData[K] extends boolean ? BooleanObject : EnumObject)[]
}

interface DataTableToolbarProps<TData, TColumns> {
  table: Table<TData>
  keyValue: keyValueType<TColumns>
  filterColumn: keyof TData & string
}

export function DataTableToolbar<TData, TColumns>({
  table,
  keyValue,
  filterColumn
}: DataTableToolbarProps<TData, TColumns>) {
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
                options={value as (BooleanObject | EnumObject)[]} />
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
