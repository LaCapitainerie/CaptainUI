import { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { Clock } from "lucide-react"

type DateKey<T> = {
  [K in keyof T]: T[K] extends string | Date ? K : never
}[keyof T]

interface DataTableRowFormatDateProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: DateKey<TData> & string
}

export function DataTableRowFormatDate<TData>({
  row,
  keyValue,
  className,
}: DataTableRowFormatDateProps<TData>) {
  const Value = row.getValue<Date>(keyValue)

  return (
    <div className="flex w-[200px] items-center">
        <Clock className={`mr-2 h-4 w-4 text-muted-foreground`} />
        {format(Value,  'dd MMMM yyyy')}
    </div>
  )
}
