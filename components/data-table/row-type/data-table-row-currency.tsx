import { Row } from "@tanstack/react-table"

import { AuthorizedKey } from "@/components/captainui/utils"

interface DataTableRowFormatCurrencyProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: AuthorizedKey<TData, number> & string
}

export function DataTableRowFormatCurrency<TData>({
  row,
  keyValue,
}: DataTableRowFormatCurrencyProps<TData>) {

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(row.getValue<number>(keyValue))

  return <div className="text-right font-medium">{formatted}</div>

}
