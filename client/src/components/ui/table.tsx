import { cn } from "../../lib/utils";
export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn("overflow-x-auto rounded-lg border border-border bg-white", className)}><table className="w-full min-w-[680px] text-left text-sm">{children}</table></div>; }
export function Th({ children }: { children: React.ReactNode }) { return <th className="border-b border-border bg-gray-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-500">{children}</th>; }
export function Td({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn("border-b border-border px-4 py-3 last:border-0", className)} {...props}>{children}</td>; }
