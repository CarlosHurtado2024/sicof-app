
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white/10 text-white hover:bg-white/15 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
                destructive:
                    "bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30",
                outline:
                    "border border-white/10 bg-transparent hover:bg-white/5 hover:text-white text-white/70",
                secondary:
                    "bg-blue-600/20 text-blue-200 hover:bg-blue-600/40 border border-blue-500/30 focus-visible:ring-blue-500",
                ghost: "hover:bg-white/10 hover:text-white text-white/70",
                link: "text-blue-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-4 py-2",
                sm: "h-9 rounded-xl px-3 text-xs",
                lg: "h-12 rounded-xl px-8",
                icon: "h-11 w-11 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
