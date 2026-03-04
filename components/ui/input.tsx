
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-2xl border border-[#2B463C]/10 bg-white px-4 py-2 text-sm font-medium text-[#2B463C] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#2B463C]/30 hover:bg-[#FDFBF7] hover:border-[#2B463C]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28482]/20 focus-visible:border-[#F28482]/60 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
