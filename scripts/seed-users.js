
const { createClient } = require('@supabase/supabase-js');

const PROJECT_URL = 'https://cooezlsthkwckxwgbzqi.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvb2V6bHN0aGt3Y2t4d2dienFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY5MjY1MywiZXhwIjoyMDg2MjY4NjUzfQ.DxLXBDvxwW7-DrSJE_UFMso_ropiHCI5MAfiOm3B8v4';

const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const users = [
    { email: 'admin@sicof.com', password: 'Password123!', role: 'ADMINISTRADOR', name: 'Administrador Sistema' },
    { email: 'comisario@sicof.com', password: 'Password123!', role: 'COMISARIO', name: 'Comisario de Familia' },
    { email: 'secretario@sicof.com', password: 'Password123!', role: 'SECRETARIO', name: 'Secretario Despacho' },
    { email: 'psicologo@sicof.com', password: 'Password123!', role: 'PSICOLOGO', name: 'Psicólogo Forense' },
    { email: 'social@sicof.com', password: 'Password123!', role: 'TRABAJADOR_SOCIAL', name: 'Trabajador Social' },
    { email: 'auxiliar@sicof.com', password: 'Password123!', role: 'AUXILIAR', name: 'Auxiliar Administrativo' },
    { email: 'abogado@sicof.com', password: 'Password123!', role: 'ABOGADO', name: 'Abogado Externo' }
];

async function seedUsers() {
    console.log('🌱 Seeding users...');

    for (const user of users) {
        try {
            console.log(`Creating user: ${user.email} (${user.role})...`);

            // 1. Create User in Auth
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: { full_name: user.name, rol: user.role }
            });

            if (authError) {
                console.error(`Error creating auth user ${user.email}:`, authError.message);
                // If user already exists, we might want to fetch their ID to ensure public profile exists
                if (authError.message.includes('already registered')) {
                    console.log(`User ${user.email} already exists. Skipping creation.`);
                    // Logic to fetch ID if needed, but for simplicity skipping
                }
                continue;
            }

            if (authUser && authUser.user) {
                // 2. Create Profile in public.usuarios
                const { error: profileError } = await supabase
                    .from('usuarios')
                    .insert([
                        {
                            id: authUser.user.id,
                            email: user.email,
                            nombre: user.name,
                            rol: user.role
                        }
                    ]);

                if (profileError) {
                    console.error(`Error creating profile for ${user.email}:`, profileError.message);
                } else {
                    console.log(`✅ User and Profile created for ${user.email}`);
                }
            }

        } catch (err) {
            console.error(`Unexpected error for ${user.email}:`, err);
        }
    }

    console.log('✨ Seeding complete.');
}

seedUsers();
