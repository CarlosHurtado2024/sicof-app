"use client"

import { LogOut, Settings, User } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
    userName: string
    userEmail: string
    userInitial: string
    variant?: 'default' | 'sidebar'
}

export default function UserMenu({ userName, userEmail, userInitial, variant = 'default' }: UserMenuProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = '/auth/signout'
        document.body.appendChild(form)
        form.submit()
    }

    const handleSettings = () => {
        router.push('/dashboard/configuracion')
    }

    const buttonClasses = variant === 'sidebar'
        ? "w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100/80 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-200 transition-all border border-slate-200 focus:outline-none flex items-center justify-center"
        : "h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm hover:bg-blue-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={buttonClasses}>
                    {userInitial}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-slate-500">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10 border border-red-500/20"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
