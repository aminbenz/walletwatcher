import { TransactionType } from "@/types/enums";
import clsx from "clsx";

export default function RoleBadge({ type }: { type: TransactionType }) {
  return (
    <span
      className={clsx("inline-block rounded-sm px-2 py-1 text-xs", {
        "bg-green-500 text-white": type === TransactionType.INCOME,
        "bg-red-700 text-white": type !== TransactionType.INCOME,
      })}
    >
      {type}
    </span>
  );
}
