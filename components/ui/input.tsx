
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
                    "flex h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/30 hover:bg-white/[0.07] hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a59]/40 focus-visible:border-[#ff7a59]/60 disabled:cursor-not-allowed disabled:opacity-50",
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
