import { Row } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { AuthorizedKey } from "@/components/captainui/utils"

interface DataTableRowFormatBadgeProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: AuthorizedKey<TData, string> & string
  keyBadge: AuthorizedKey<TData, string> & string
}

export function DataTableRowFormatBadge<TData>({
  row,
  keyValue,
  keyBadge,
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
