
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28482]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default: "bg-[#ff7a59] text-white hover:bg-[#ff6b47] shadow-md shadow-[#ff7a59]/20 hover:shadow-lg",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
                outline:
                    "border-2 border-white/[0.1] bg-transparent hover:bg-white/[0.05] text-white/70",
                secondary:
                    "bg-white/[0.05] text-white/80 hover:bg-white/[0.08] border border-white/[0.08]",
                ghost: "hover:bg-white/[0.05] text-white/60 hover:text-white",
                link: "text-[#ff7a59] underline-offset-4 hover:underline font-bold",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 rounded-xl px-4 text-xs",
                lg: "h-13 rounded-2xl px-8 text-base",
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
