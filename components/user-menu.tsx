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
        ? "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F28C73] text-white text-[13px] font-black cursor-pointer hover:scale-105 transition-all focus:outline-none flex items-center justify-center shadow-lg shadow-[#F28C73]/20 border-2 border-white"
        : "h-8 w-8 rounded-full bg-[#F28C73] flex items-center justify-center text-white font-black text-xs hover:bg-[#E07B62] transition-all cursor-pointer focus:outline-none border-2 border-white shadow-sm"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={buttonClasses}>
                    {userInitial}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-3 overflow-hidden">
                <DropdownMenuLabel className="mb-2">
                    <div className="flex flex-col space-y-1.5 p-1 bg-[#FDFBF7] rounded-xl border border-[#2B463C]/5 shadow-inner px-3 py-2">
                        <p className="text-sm font-black leading-none text-[#2B463C] font-serif">{userName}</p>
                        <p className="text-[10px] lowercase font-bold leading-none text-[#2B463C]/40 tracking-wide">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer group">
                    <Settings className="mr-3 h-4 w-4 text-[#2B463C]/40 group-hover:text-[#F28482] transition-colors" />
                    <span className="font-bold underline-offset-4 decoration-[#F28482]/20">Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-[#C56361] focus:text-[#C56361] focus:bg-[#F28482]/10 rounded-xl"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
