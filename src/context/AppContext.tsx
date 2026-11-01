import React, { createContext, useContext, useState } from 'react';
import { Baby, Family, FamilyMember, Moment, VaccineRecord, EmergencyShare } from '../types/database';

// Dados de Exemplo Realistas para demonstração e desenvolvimento
const INITIAL_BABY: Baby = {
  id: 'b1',
  family_id: 'f1',
  name: 'Théo Silva',
  status: 'born',
  birth_date: '2026-07-15',
  gender: 'boy',
  blood_type: 'O+',
  allergies: ['Amendoim (Leve)', 'Picada de Inseto'],
  avatar_url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80',
};

const INITIAL_GESTATION_BABY: Baby = {
  id: 'b2',
  family_id: 'f1',
  name: 'Maya Silva (A caminho)',
  status: 'gestating',
  due_date: '2027-01-20',
  gender: 'girl',
  allergies: [],
  avatar_url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=600&q=80',
};

const INITIAL_FAMILY: Family = {
  id: 'f1',
  name: 'Família do Théo',
  invite_code: 'NURI-8A4F',
  created_by: 'u1',
  created_at: '2026-07-01T10:00:00Z',
};

const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'm1',
    family_id: 'f1',
    user_id: 'u1',
    role: 'admin',
    relationship_label: 'Mamãe (Marina)',
    can_post: true,
    can_edit_health: true,
  },
  {
    id: 'm2',
    family_id: 'f1',
    user_id: 'u2',
    role: 'admin',
    relationship_label: 'Papai (Lucas)',
    can_post: true,
    can_edit_health: true,
  },
  {
    id: 'm3',
    family_id: 'f1',
    user_id: 'u3',
    role: 'family',
    relationship_label: 'Vovó Vera',
    can_post: true,
    can_edit_health: false,
  },
  {
    id: 'm4',
    family_id: 'f1',
    user_id: 'u4',
    role: 'caregiver',
    relationship_label: 'Tia Sandra (Babá)',
    can_post: false,
    can_edit_health: false,
  },
];

const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'p1',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u1',
    author_name: 'Marina (Mamãe)',
    author_role_label: 'Mãe',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    caption: 'Completando 3 meses hoje! Cada dia mais esperto, descobrindo as mãozinhas e rindo à toa! 🎈✨',
    milestone_type: 'mesversario',
    milestone_title: '3º Mesversário',
    month_age: 3,
    taken_at: '2026-10-15T14:30:00Z',
    created_at: '2026-10-15T15:00:00Z',
    reactions_count: 5,
    reactions: [
      { id: 'r1', moment_id: 'p1', user_id: 'u3', emoji: '❤️', comment: 'Coisa mais linda da vovó!', user_name: 'Vovó Vera', created_at: '2026-10-15T15:20:00Z' },
      { id: 'r2', moment_id: 'p1', user_id: 'u2', emoji: '🥰', comment: 'Orgulho do papai!', user_name: 'Lucas (Pai)', created_at: '2026-10-15T15:30:00Z' },
    ],
  },
  {
    id: 'p2',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u1',
    author_name: 'Marina (Mamãe)',
    author_role_label: 'Mãe',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=800&q=80',
    caption: 'Primeira vez no banho de balde (ofurô). Ficou relaxado que quase dormiu na água morna! 🛁😴',
    milestone_type: 'first_time',
    milestone_title: 'Primeiro Ofurô',
    taken_at: '2026-09-02T19:00:00Z',
    created_at: '2026-09-02T19:15:00Z',
    reactions_count: 3,
  },
];

const INITIAL_VACCINES: VaccineRecord[] = [
  {
    id: 'vr1',
    baby_id: 'b1',
    vaccine_id: 'v1',
    status: 'applied',
    applied_date: '2026-07-16',
    clinic_or_post: 'Maternidade Santa Joana',
    batch_number: 'BCG-8921A',
    vaccine: {
      id: 'v1',
      name: 'BCG',
      dose_label: 'Dose Única',
      target_disease: 'Formas graves de tuberculose',
      recommended_age_months: 0,
      is_mandatory_sus: true,
    },
  },
  {
    id: 'vr2',
    baby_id: 'b1',
    vaccine_id: 'v2',
    status: 'applied',
    applied_date: '2026-07-16',
    clinic_or_post: 'Maternidade Santa Joana',
    batch_number: 'HEP-4410',
    vaccine: {
      id: 'v2',
      name: 'Hepatite B',
      dose_label: 'Dose ao nascer',
      target_disease: 'Hepatite B',
      recommended_age_months: 0,
      is_mandatory_sus: true,
    },
  },
  {
    id: 'vr3',
    baby_id: 'b1',
    vaccine_id: 'v3',
    status: 'applied',
    applied_date: '2026-09-15',
    clinic_or_post: 'Posto de Saúde Vila Mariana',
    batch_number: 'PENTA-1092',
    vaccine: {
      id: 'v3',
      name: 'Pentavalente (1ª Dose)',
      dose_label: '1ª Dose',
      target_disease: 'Difteria, Tétano, Coqueluche, Hib, Hepatite B',
      recommended_age_months: 2,
      is_mandatory_sus: true,
    },
  },
  {
    id: 'vr4',
    baby_id: 'b1',
    vaccine_id: 'v4',
    status: 'pending',
    scheduled_date: '2026-11-15',
    vaccine: {
      id: 'v4',
      name: 'Pentavalente (2ª Dose)',
      dose_label: '2ª Dose',
      target_disease: 'Difteria, Tétano, Coqueluche, Hib, Hepatite B',
      recommended_age_months: 4,
      is_mandatory_sus: true,
    },
  },
  {
    id: 'vr5',
    baby_id: 'b1',
    vaccine_id: 'v5',
    status: 'pending',
    scheduled_date: '2026-11-15',
    vaccine: {
      id: 'v5',
      name: 'VIP Poliomielite (2ª Dose)',
      dose_label: '2ª Dose',
      target_disease: 'Paralisia Infantil',
      recommended_age_months: 4,
      is_mandatory_sus: true,
    },
  },
];

const INITIAL_EMERGENCY_SHARE: EmergencyShare = {
  id: 'es1',
  baby_id: 'b1',
  access_token: 'nuri-theo-escola-2026',
  label: 'Berçário Pequeno Príncipe',
  authorized_pickups: [
    { name: 'Lucas Silva (Pai)', document: 'CPF 123.456.789-00', phone: '(11) 98765-4321', relationship: 'Pai' },
    { name: 'Marina Silva (Mãe)', document: 'CPF 987.654.321-11', phone: '(11) 91234-5678', relationship: 'Mãe' },
    { name: 'Vera Lucia (Avó)', document: 'RG 12.345.678-X', phone: '(11) 99887-1122', relationship: 'Avó Materna' },
  ],
  emergency_instructions: 'Em caso de febre acima de 37.8ºC, avisar imediatamente os pais antes de medicar. Alergia a amendoim.',
  emergency_phones: ['(11) 98765-4321', '(11) 91234-5678'],
  is_active: true,
};

interface AppContextType {
  baby: Baby;
  setBaby: (baby: Baby) => void;
  toggleBabyMode: () => void;
  family: Family;
  members: FamilyMember[];
  moments: Moment[];
  addMoment: (moment: Omit<Moment, 'id' | 'created_at' | 'family_id' | 'baby_id'>) => void;
  vaccines: VaccineRecord[];
  markVaccineAsApplied: (recordId: string, clinic: string) => void;
  emergencyShare: EmergencyShare;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baby, setBaby] = useState<Baby>(INITIAL_BABY);
  const [family] = useState<Family>(INITIAL_FAMILY);
  const [members] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(INITIAL_VACCINES);
  const [emergencyShare] = useState<EmergencyShare>(INITIAL_EMERGENCY_SHARE);

  const toggleBabyMode = () => {
    setBaby((prev) => (prev.status === 'born' ? INITIAL_GESTATION_BABY : INITIAL_BABY));
  };

  const addMoment = (newMomentData: Omit<Moment, 'id' | 'created_at' | 'family_id' | 'baby_id'>) => {
    const newMoment: Moment = {
      ...newMomentData,
      id: `m_${Date.now()}`,
      family_id: family.id,
      baby_id: baby.id,
      created_at: new Date().toISOString(),
      reactions_count: 0,
      reactions: [],
    };
    setMoments((prev) => [newMoment, ...prev]);
  };

  const markVaccineAsApplied = (recordId: string, clinic: string) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.id === recordId
          ? {
              ...v,
              status: 'applied',
              applied_date: new Date().toISOString().split('T')[0],
              clinic_or_post: clinic || 'Posto de Saúde',
            }
          : v
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        baby,
        setBaby,
        toggleBabyMode,
        family,
        members,
        moments,
        addMoment,
        vaccines,
        markVaccineAsApplied,
        emergencyShare,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
