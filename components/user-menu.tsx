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
        ? "w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white text-[13px] font-black cursor-pointer hover:scale-105 transition-all focus:outline-none flex items-center justify-center shadow-lg border-2"
        : "h-8 w-8 rounded-full flex items-center justify-center text-white font-black text-xs transition-all cursor-pointer focus:outline-none border-2 shadow-sm"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={buttonClasses} style={{ background: '#ff7a59', borderColor: 'rgba(255,255,255,0.15)', boxShadow: '0 4px 14px rgba(255,122,89,0.25)' }}>
                    {userInitial}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-3 overflow-hidden" style={{ background: 'rgba(17,24,33,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
                <DropdownMenuLabel className="mb-2">
                    <div className="flex flex-col space-y-1.5 p-1 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-sm font-black leading-none text-white">{userName}</p>
                        <p className="text-[10px] lowercase font-bold leading-none tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.06)' }} />
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer group" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <Settings className="mr-3 h-4 w-4 group-hover:text-[#ff7a59] transition-colors" />
                    <span className="font-bold">Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.06)' }} />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-xl"
                    style={{ color: '#f87171' }}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
