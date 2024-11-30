import { Row } from "@tanstack/react-table"
import { Badge } from "../../../ui/badge"

type StringKey<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

interface DataTableRowFormatBadgeProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: StringKey<TData> & string
  keyBadge: StringKey<TData> & string
}

export function DataTableRowFormatBadge<TData>({
  row,
  keyValue,
  keyBadge,
  className,
}: DataTableRowFormatBadgeProps<TData>) {
  
  const Value = row.original[keyValue] as string
  const label = row.original[keyBadge] as string

  return (
    <div className="flex space-x-2">
      {label && <Badge variant="outline">{label}</Badge>}
      <span className="max-w-[500px] truncate font-medium">
        {Value}
      </span>
    </div>
)
}
