"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./view-options";

import { DataTableFacetedFilter } from "./faceted-filter";
import TransactionModal from "@/app/(dashboard)/dashboard/modals/transaction";
import { enumToOptions } from "@/lib/utils";
import { TransactionType } from "@/types/enums";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData;
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const downloadData = () => {
    const csvContent = Papa.unparse(data);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <TransactionModal />
        {/* <CalendarDateRangePicker /> */}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={enumToOptions(TransactionType)}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <Button onClick={downloadData} className="h-8 px-2 lg:px-3">
          Download
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
