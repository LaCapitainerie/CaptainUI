import { Row } from "@tanstack/react-table"
import { CheckCircle2Icon, CircleXIcon } from "lucide-react"

type BooleanKey<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]

interface DataTableRowFormatBooleanProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: BooleanKey<TData> & string
}

export const TrueElementValues = {
  value: "true",
  label: "Yes",
  icon: CheckCircle2Icon,
  color: "green",
} as const;

export const FalseElementValues = {
  value: "false",
  label: "No",
  icon: CircleXIcon,
  color: "red",
} as const;

export function DataTableRowFormatBoolean<TData>({
  row,
  keyValue,
  className,
}: DataTableRowFormatBooleanProps<TData>) {

  const Value = row.getValue<boolean>(keyValue) ? TrueElementValues : FalseElementValues

  return (
    <div className="flex w-[100px] items-center">
      <Value.icon color={Value.color} className={`mr-2 h-4 w-4 text-muted-foreground`} />
      <span className="max-w-[500px] truncate font-medium">
        {Value.label}
      </span>
    </div>
  )
}
