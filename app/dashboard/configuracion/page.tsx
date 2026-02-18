import { getUserProfile } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Bell, Shield, Palette } from 'lucide-react'

export default async function ConfiguracionPage() {
    const data = await getUserProfile()

    if (!data) {
        redirect('/login')
    }

    const { user, profile } = data

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h2>
                <p className="text-slate-500 mt-1">Gestiona tus preferencias y configuración de cuenta</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Perfil de Usuario
                        </CardTitle>
                        <CardDescription>
                            Información personal y datos de contacto
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Nombre</p>
                            <p className="text-sm text-slate-600">{profile?.nombre || 'No especificado'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">Email</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">Rol</p>
                            <p className="text-sm text-slate-600">{profile?.rol || 'No asignado'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            Notificaciones
                        </CardTitle>
                        <CardDescription>
                            Gestiona cómo y cuándo recibir notificaciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Funcionalidad en desarrollo...</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Seguridad
                        </CardTitle>
                        <CardDescription>
                            Contraseña y opciones de seguridad
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Funcionalidad en desarrollo...</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-blue-600" />
                            Apariencia
                        </CardTitle>
                        <CardDescription>
                            Personaliza la interfaz de usuario
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">Funcionalidad en desarrollo...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
