import Image from 'next/image';
import { Row } from "@tanstack/react-table"

import { AuthorizedKey } from "@/components/captainui/utils"

interface DataTableRowFormatImageProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>
  keyValue: AuthorizedKey<TData, string> & string
}

export function DataTableRowFormatImage<TData>({
  row,
  keyValue,
}: DataTableRowFormatImageProps<TData>) {

  const Value = row.getValue<string>(keyValue)

  return (
    <div className="flex w-[100px] items-center">
      <span className="max-w-[500px] truncate font-medium">
        <Image src={Value} alt="Image" width={50} height={50} />
      </span>
    </div>
  )
}
