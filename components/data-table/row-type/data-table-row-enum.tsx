import { AuthorizedKey } from "../../utils"
import { Row } from "@tanstack/react-table"
import { LucideProps } from "lucide-react"
import react from "react"

interface DataTableRowFormatEnumProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: AuthorizedKey<TData, string> & string
  enumValue: {
    [key: string]: {
      value: string
      icon: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>
    }
  }
}

export function DataTableRowFormatEnum<TData>({
  row,
  keyValue,
  enumValue,
  className,
}: DataTableRowFormatEnumProps<TData>) {
  
  const Value = enumValue[row.original[keyValue] as keyof typeof enumValue]

  return (
    <div className="flex space-x-2">
      {Value.icon && <Value.icon/>}
      <span className="max-w-[500px] truncate font-medium">
        {Value.value}
      </span>
    </div>
  )
}
