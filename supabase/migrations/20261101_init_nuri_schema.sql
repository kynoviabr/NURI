-- ==============================================================================
-- NURI BABY SAAS - SCHEMA DE BANCO DE DADOS POSTGRESQL (SUPABASE)
-- ==============================================================================

-- Habilita extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FAMÍLIAS (MULTI-TENANT ISOLADO)
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ex: "Família Silva", "Família da Helena"
    invite_code VARCHAR(12) UNIQUE NOT NULL, -- Ex: "NURI-8X2M"
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MEMBROS DA FAMÍLIA (CONTROLE DE PAPÉIS & PERMISSÕES)
CREATE TYPE family_role_enum AS ENUM ('admin', 'family', 'caregiver', 'doctor');

CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role family_role_enum NOT NULL DEFAULT 'family',
    relationship_label TEXT NOT NULL DEFAULT 'Familiar', -- 'Mãe', 'Pai', 'Vovó', 'Tia', 'Padrinho'
    can_post BOOLEAN DEFAULT TRUE,
    can_edit_health BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- 4. BEBÊS / GESTAÇÃO
CREATE TYPE baby_status_enum AS ENUM ('gestating', 'born');
CREATE TYPE gender_enum AS ENUM ('boy', 'girl', 'surprise');

CREATE TABLE IF NOT EXISTS public.babies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status baby_status_enum NOT NULL DEFAULT 'gestating',
    due_date DATE, -- Para contagem de semanas se gestante
    birth_date DATE, -- Quando já nasceu
    gender gender_enum NOT NULL DEFAULT 'surprise',
    blood_type VARCHAR(5), -- 'A+', 'O-', etc.
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MOMENTOS & FEED FAMILIAR (FOTOS, VÍDEOS, MARCOS)
CREATE TYPE media_type_enum AS ENUM ('photo', 'video', 'milestone_card');
CREATE TYPE milestone_type_enum AS ENUM ('routine', 'mesversario', 'first_time', 'gestation', 'medical');

CREATE TABLE IF NOT EXISTS public.moments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_type media_type_enum NOT NULL DEFAULT 'photo',
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    milestone_type milestone_type_enum DEFAULT 'routine',
    milestone_title TEXT, -- Ex: "1º Mês", "Primeiro Banho", "20ª Semana de Gestação"
    month_age INT, -- Mês comemorativo (1..12) para mesversário
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. REAÇÕES E COMENTÁRIOS DA FAMÍLIA (FEED SOCIAL SEGURO)
CREATE TABLE IF NOT EXISTS public.moment_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES public.moments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji VARCHAR(10), -- '❤️', '🥰', '👏'
    comment TEXT,
    audio_url TEXT, -- Mensagem de voz dos avós
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CATÁLOGO OFICIAL DE VACINAS (CALENDÁRIO NACIONAL BRASILEIRO)
CREATE TABLE IF NOT EXISTS public.vaccine_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    dose_label TEXT NOT NULL, -- "Dose Única", "1ª Dose", "Reforço"
    target_disease TEXT NOT NULL,
    recommended_age_months INT NOT NULL, -- 0 = ao nascer, 2, 4, 6, 9, 12, etc.
    is_mandatory_sus BOOLEAN DEFAULT TRUE,
    description TEXT
);

-- 8. REGISTRO DE VACINAS DA CRIANÇA
CREATE TYPE vaccine_status_enum AS ENUM ('pending', 'applied', 'delayed');

CREATE TABLE IF NOT EXISTS public.vaccine_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    vaccine_id UUID NOT NULL REFERENCES public.vaccine_catalog(id) ON DELETE CASCADE,
    status vaccine_status_enum NOT NULL DEFAULT 'pending',
    applied_date DATE,
    scheduled_date DATE,
    batch_number TEXT,
    clinic_or_post TEXT,
    proof_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(baby_id, vaccine_id)
);

-- 9. CURVAS DE CRESCIMENTO (OMS)
CREATE TABLE IF NOT EXISTS public.growth_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,2),
    head_circumference_cm NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. FICHA DE EMERGÊNCIA & PASSE ESCOLAR / CUIDADOR
CREATE TABLE IF NOT EXISTS public.emergency_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    access_token TEXT UNIQUE NOT NULL, -- Token seguro para URL de visualização
    label TEXT NOT NULL, -- Ex: "Berçário Estrelinha", "Tia Sandra (Babá)"
    authorized_pickups JSONB DEFAULT '[]'::jsonb, -- Array com [{ name, doc, phone, relation }]
    emergency_instructions TEXT,
    emergency_phones TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- CARGA INICIAL: CALENDÁRIO OFICIAL DE VACINAS (BRASIL / SUS & SBIm)
-- ==============================================================================
INSERT INTO public.vaccine_catalog (name, dose_label, target_disease, recommended_age_months, is_mandatory_sus) VALUES
('BCG', 'Dose Única', 'Formas graves de tuberculose', 0, true),
('Hepatite B', 'Dose ao nascer', 'Hepatite B', 0, true),
('Pentavalente', '1ª Dose', 'Difteria, Tétano, Coqueluche, Hepatite B e Hib', 2, true),
('VIP (Poliomielite Inativada)', '1ª Dose', 'Paralisia infantil', 2, true),
('Pneumocócica 10V', '1ª Dose', 'Pneumonia, meningite e otite por pneumococo', 2, true),
('Rotavírus Humano', '1ª Dose', 'Diarreia grave por rotavírus', 2, true),
('Meningocócica C', '1ª Dose', 'Doença meningocócica do sorogrupo C', 3, true),
('Pentavalente', '2ª Dose', 'Difteria, Tétano, Coqueluche, Hepatite B e Hib', 4, true),
('VIP (Poliomielite Inativada)', '2ª Dose', 'Paralisia infantil', 4, true),
('Pneumocócica 10V', '2ª Dose', 'Pneumonia, meningite e otite por pneumococo', 4, true),
('Rotavírus Humano', '2ª Dose', 'Diarreia grave por rotavírus', 4, true),
('Meningocócica C', '2ª Dose', 'Doença meningocócica do sorogrupo C', 5, true),
('Pentavalente', '3ª Dose', 'Difteria, Tétano, Coqueluche, Hepatite B e Hib', 6, true),
('VIP (Poliomielite Inativada)', '3ª Dose', 'Paralisia infantil', 6, true),
('Febre Amarela', 'Dose Inicial', 'Febre amarela', 9, true),
('Tríplice Viral (SRC)', '1ª Dose', 'Sarampo, Caxumba e Rubéola', 12, true),
('Pneumocócica 10V', 'Reforço', 'Pneumonia, meningite e otite', 12, true),
('Meningocócica C', 'Reforço', 'Meningite meningocócica C', 12, true),
('DTP', '1º Reforço', 'Difteria, Tétano e Coqueluche', 15, true),
('VOP (Poliomielite Oral)', '1º Reforço', 'Paralisia infantil', 15, true),
('Hepatite A', 'Dose Única', 'Hepatite A', 15, true),
('Tetraviral', 'Dose Única', 'Sarampo, Caxumba, Rubéola e Varicela', 15, true)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY) - PRIVACIDADE MÁXIMA
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_shares ENABLE ROW LEVEL SECURITY;

-- Regra de Perfis: usuário pode ler e editar apenas seu próprio perfil
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Regra de Família: usuário só acessa famílias onde é membro
CREATE POLICY "Family members access family" ON public.families 
FOR SELECT USING (
    id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);

-- Regra de Bebês: apenas membros da família têm acesso
CREATE POLICY "Family members access babies" ON public.babies
FOR SELECT USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);

-- Regra de Momentos: membros autorizados visualizam o feed
CREATE POLICY "Family members view moments" ON public.moments
FOR SELECT USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);

-- Regra de Postagem de Momentos: apenas membros com permissão can_post
CREATE POLICY "Authorized members post moments" ON public.moments
FOR INSERT WITH CHECK (
    family_id IN (
        SELECT family_id FROM public.family_members 
        WHERE user_id = auth.uid() AND can_post = true
    )
);

-- ==============================================================================
-- EXTENSÃO DO MÓDULO DE SAÚDE INFANTIL (A A Z)
-- ==============================================================================

-- 11. MEDICAMENTOS, FEBRES E SINTOMAS
CREATE TABLE IF NOT EXISTS public.medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    temperature_celsius NUMERIC(4,2),
    administered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_dose_at TIMESTAMP WITH TIME ZONE,
    interval_hours INT DEFAULT 6,
    administered_by TEXT NOT NULL DEFAULT 'Responsável',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. CONSULTAS PEDIÁTRICAS E RECEITUÁRIO
CREATE TABLE IF NOT EXISTS public.medical_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL DEFAULT 'Pediatra Geral',
    clinic_name TEXT,
    appointment_date DATE NOT NULL,
    phone TEXT,
    questions_to_ask TEXT[],
    doctor_diagnosis_notes TEXT,
    prescription_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POLÍTICAS RLS PARA AS NOVAS TABELAS DE SAÚDE
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members access medication_logs" ON public.medication_logs
FOR ALL USING (
    baby_id IN (
        SELECT b.id FROM public.babies b
        JOIN public.family_members fm ON fm.family_id = b.family_id
        WHERE fm.user_id = auth.uid()
    )
);

CREATE POLICY "Family members access medical_appointments" ON public.medical_appointments
FOR ALL USING (
    baby_id IN (
        SELECT b.id FROM public.babies b
        JOIN public.family_members fm ON fm.family_id = b.family_id
        WHERE fm.user_id = auth.uid()
    )
);
