"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { z } from "zod"
import { CustomResponse } from "@/lib/safe-route"
import { AuthorizedKey } from "@/types/utils"

type Authorized = z.ZodEnum<any> | z.ZodBoolean

interface DataTableRowActionsProps<TData, T extends z.ZodObject<any>, K extends AuthorizedKey<T["shape"], Authorized>> {
  row: Row<TData>
  itemSchema: T
  keyValues: K[]
  apiUrl: string
}

async function UpdateItem<TData extends {[x: string]: any;}>(apiUrl: string, itemSchema: TData) {

  try {
    const result = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        itemSchema
      ),
    })
  
    const data: CustomResponse<TData> = await result.json()

    if (!data.success) {
      toast({
        title: "Item Update Failed",
        description: data.error,
      })
    } else {
      toast({
        title: "Item Updated",
        description: "Item has been updated successfully",
      })
    }

  } catch (error) {
    toast({
      title: "Item Update Failed",
      description: `${error}`,
    })
  }

}

export function DataTableRowActions<TData, T extends z.ZodObject<any>, K extends AuthorizedKey<T["shape"], Authorized>>({
  row,
  itemSchema,
  keyValues,
  apiUrl,
}: DataTableRowActionsProps<TData, T, K>) {

  const itemValue = itemSchema.parse(row.original);

  const values: Authorized[] = keyValues.map(keyValue => itemSchema.shape[keyValue]);

  const keyValueValues:string[][] = values.map(value => value instanceof z.ZodBoolean ? ["true", "false"] : value?.options);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">

        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />

        {
          keyValueValues.map((keyValueValue: string[], index: number) => (
            <DropdownMenuSub key={index}>
              <DropdownMenuSubTrigger className="capitalize">{keyValues[index] as string}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={`${row.original[keyValues[index]]}`} >
                  {keyValueValue.map((item: string) => (
                    <DropdownMenuRadioItem className="capitalize" key={item} value={item} onClick={() => UpdateItem<typeof itemValue>(apiUrl, itemValue)}>
                      {item}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        }
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
