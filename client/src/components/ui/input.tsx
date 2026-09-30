import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn("h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-primary", className)} {...props} />);
Input.displayName = "Input";
