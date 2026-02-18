-- Crear tabla de alertas de crisis
CREATE TABLE IF NOT EXISTS public.alertas_crisis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expediente_id UUID REFERENCES public.expedientes(id),
    radicado TEXT NOT NULL,
    nombre_victima TEXT NOT NULL,
    tipologia TEXT,
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'ATENDIDA', 'CERRADA')),
    creado_por UUID REFERENCES auth.users(id),
    atendido_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    atendida_at TIMESTAMPTZ
);

-- Habilitar Realtime para la tabla (CRÍTICO para que funcionen las notificaciones)
ALTER PUBLICATION supabase_realtime ADD TABLE public.alertas_crisis;

-- Habilitar Row Level Security
ALTER TABLE public.alertas_crisis ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
-- 1. Lectura: Permitir a todos los usuarios autenticados leer las alertas
CREATE POLICY "Usuarios autenticados pueden leer alertas"
    ON public.alertas_crisis FOR SELECT TO authenticated USING (true);

-- 2. Inserción: Permitir a cualquier usuario autenticado (auxiliares) crear alertas
CREATE POLICY "Usuarios autenticados pueden crear alertas"
    ON public.alertas_crisis FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Actualización: Permitir actualizar (marcar como atendida)
CREATE POLICY "Usuarios autenticados pueden actualizar alertas"
    ON public.alertas_crisis FOR UPDATE TO authenticated USING (true);
