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
        ? "w-12 h-12 rounded-full bg-slate-700 text-white text-xs font-bold ring-2 ring-white/10 cursor-pointer hover:ring-white/20 transition-all focus:outline-none focus:ring-white/30"
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
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
