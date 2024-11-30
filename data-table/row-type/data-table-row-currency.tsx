import { Row } from "@tanstack/react-table"

type CurrencyKey<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

interface DataTableRowFormatCurrencyProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: CurrencyKey<TData> & string
}

export function DataTableRowFormatCurrency<TData>({
  row,
  keyValue,
  className,
}: DataTableRowFormatCurrencyProps<TData>) {

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(row.getValue<number>(keyValue))

  return <div className="text-right font-medium">{formatted}</div>

}
