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
        ? "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white text-[#2B463C] text-sm font-black cursor-pointer hover:bg-[#FDF4E3] transition-all border border-[#2B463C]/10 focus:outline-none flex items-center justify-center shadow-sm"
        : "h-9 w-9 rounded-2xl bg-[#FDF4E3] flex items-center justify-center text-[#2B463C] font-black text-sm hover:bg-[#FBE8C6] transition-all cursor-pointer focus:outline-none border border-[#2B463C]/5"

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
