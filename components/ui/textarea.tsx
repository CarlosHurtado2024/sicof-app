
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/30 hover:bg-white/[0.07] hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a59]/40 focus-visible:border-[#ff7a59]/60 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
