"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../header/column-header";
import { Cell } from "../body/cell";
import { DataTableRowActions } from "./row-actions";
import { currency, date } from "@/lib/utils";
import TransactionTypeBadge from "../../badges/type-badge";
import { TransactionType } from "@/types/enums";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <Cell text={row.original.id} />,
    enableSorting: false,
  },

  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => <Cell text={row.original.description} />,
    enableSorting: false,
  },
  {
    accessorKey: "category",
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.type == TransactionType.INCOME ? "green" : "destructive"
        }
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.type;
      const isInc = type == TransactionType.INCOME;

      return (
        <p
          style={{
            width: "80px",
            textAlign: "end",
          }}
          className={clsx("text-sm font-medium", {
            "text-red-500": !isInc,
            "text-green-400": isInc,
          })}
        >
          {isInc ? "+" : "-"}
          {currency(amount)}
        </p>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => <Cell text={date(row.original.date, "iso")} />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => (
      <Cell text={date(row.original.created_at, "datetime", "medium")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
