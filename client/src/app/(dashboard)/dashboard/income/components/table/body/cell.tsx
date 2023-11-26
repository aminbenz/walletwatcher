import { cn } from '@/lib/utils';

interface DataTableCellProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  text: string | null;
  width?: number;
}

export function Cell<TData, TValue>({ text, width, className }: DataTableCellProps<TData, TValue>) {
  return (
    <div
      className={cn('ellipsis', className)}
      style={{
        maxWidth: width || 300,
      }}
    >
      {text}
    </div>
  );
}
