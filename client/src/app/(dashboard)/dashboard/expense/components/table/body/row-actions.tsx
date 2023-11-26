"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileEdit, GanttChartSquare, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { make } from "@/lib/axios";
import TransactionModal from "../../../../modals/transaction";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const ENDPOINT = "/transactions";

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link to={row.original.id}>
          <DropdownMenuItem>
            <GanttChartSquare className="mr-2 h-4 w-4" />
            <span>More Details</span>
          </DropdownMenuItem>
        </Link>
        <TransactionModal
          id={row.original.id}
          method="PATCH"
          openComponent={
            <div className="hover:bg-secondary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <FileEdit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </div>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const endpoint = `${ENDPOINT}/${row.original.id}`;
            const confirm = window.confirm(
              "Are you sure you want to delete this transaction"
            );
            if (confirm) {
              await make({
                method: "DELETE",
                url: endpoint,
                refresh: true,
              });
              navigate(0);
            } else {
              return toast("Canceled");
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
