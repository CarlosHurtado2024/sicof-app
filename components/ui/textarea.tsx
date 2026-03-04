
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-2xl border border-[#2B463C]/10 bg-white px-4 py-3 text-sm font-medium text-[#2B463C] transition-all placeholder:text-[#2B463C]/30 hover:bg-[#FDFBF7] hover:border-[#2B463C]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28482]/20 focus-visible:border-[#F28482]/60 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
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
