import React, { createContext, useContext, useState } from 'react';
import {
  Baby,
  Family,
  FamilyMember,
  Moment,
  VaccineRecord,
  EmergencyShare,
  GrowthLog,
  MedicationLog,
  MedicalAppointment,
  UltrasoundRecord,
  BellyPhoto,
  MaternalHealthLog,
  MaternityBagItem,
  ContractionRecord,
} from '../types/database';
import { calculateNextDose, calculateWHOWeightPercentile, calculateBabyAge } from '../utils/babyCalculations';

const INITIAL_BABY: Baby = {
  id: 'b1',
  family_id: 'f1',
  name: 'Théo Silva',
  status: 'born',
  birth_date: '2026-07-15',
  gender: 'boy',
  blood_type: 'O+',
  birth_weight_kg: 3.42,
  birth_height_cm: 49.5,
  allergies: ['Amendoim (Leve)', 'Picada de Inseto'],
  conditions: ['Refluxo Fisiológico leve'],
  health_insurance: {
    plan_name: 'Bradesco Saúde Top Nacional',
    card_number: '789.456.123.001',
    holder_name: 'Lucas Silva',
    emergency_phone: '0800-701-2700',
    accommodation_type: 'Apartamento',
  },
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
  { id: 'm1', family_id: 'f1', user_id: 'u1', role: 'admin', relationship_label: 'Mamãe (Marina)', can_post: true, can_edit_health: true },
  { id: 'm2', family_id: 'f1', user_id: 'u2', role: 'admin', relationship_label: 'Papai (Lucas)', can_post: true, can_edit_health: true },
  { id: 'm3', family_id: 'f1', user_id: 'u3', role: 'family', relationship_label: 'Vovó Vera', can_post: true, can_edit_health: false },
  { id: 'm4', family_id: 'f1', user_id: 'u4', role: 'caregiver', relationship_label: 'Tia Sandra (Babá)', can_post: false, can_edit_health: false },
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
];

const INITIAL_GROWTH_LOGS: GrowthLog[] = [
  { id: 'g1', baby_id: 'b1', recorded_date: '2026-07-15', weight_kg: 3.42, height_cm: 49.5, head_circumference_cm: 34.0, percentile_weight: 'p50 (Ideal)', notes: 'Nascimento na Maternidade' },
  { id: 'g2', baby_id: 'b1', recorded_date: '2026-08-16', weight_kg: 4.60, height_cm: 54.0, head_circumference_cm: 36.5, percentile_weight: 'p50 (Ideal)', notes: 'Consulta de 1º mês - Ganho excelente de peso' },
  { id: 'g3', baby_id: 'b1', recorded_date: '2026-09-17', weight_kg: 5.65, height_cm: 58.2, head_circumference_cm: 38.8, percentile_weight: 'p50 (Ideal)', notes: 'Consulta de 2º mês' },
  { id: 'g4', baby_id: 'b1', recorded_date: '2026-10-15', weight_kg: 6.25, height_cm: 61.5, head_circumference_cm: 40.2, percentile_weight: 'p50 (Ideal OMS)', notes: 'Consulta de 3º mês - Desenvolvimento motor perfeito' },
];

const INITIAL_MEDICATIONS: MedicationLog[] = [
  {
    id: 'm_1',
    baby_id: 'b1',
    medicine_name: 'Paracetamol Bebê',
    dosage: '12 gotas (oral)',
    temperature_celsius: 38.2,
    administered_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    next_dose_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    interval_hours: 6,
    administered_by: 'Marina (Mamãe)',
    reason: 'Reação febril pós vacina de 2 meses',
    notes: 'Temperatura cedeu para 37.1 após 45 minutos.',
  },
];

const INITIAL_APPOINTMENTS: MedicalAppointment[] = [
  {
    id: 'a1',
    baby_id: 'b1',
    doctor_name: 'Dra. Camila Nogueira',
    specialty: 'Pediatra Geral',
    clinic_name: 'Clínica Pediátrica Crescer',
    appointment_date: '2026-10-15',
    phone: '(11) 3289-4000',
    questions_to_ask: ['Introdução de mordedores', 'Tempo de tummy time por dia'],
    doctor_diagnosis_notes: 'Bebê com tônus muscular excelente. Peso e estatura no percentil 50 da OMS.',
    prescription_notes: 'Manter Vitamina D (2 gotas diárias). Retorno em 30 dias para rotina de 4 meses.',
  },
];

const INITIAL_VACCINES: VaccineRecord[] = [
  { id: 'vr1', baby_id: 'b1', vaccine_id: 'v1', status: 'applied', applied_date: '2026-07-16', clinic_or_post: 'Maternidade Santa Joana', batch_number: 'BCG-8921A', vaccine: { id: 'v1', name: 'BCG', dose_label: 'Dose Única', target_disease: 'Formas graves de tuberculose', recommended_age_months: 0, is_mandatory_sus: true } },
  { id: 'vr2', baby_id: 'b1', vaccine_id: 'v2', status: 'applied', applied_date: '2026-07-16', clinic_or_post: 'Maternidade Santa Joana', batch_number: 'HEP-4410', vaccine: { id: 'v2', name: 'Hepatite B', dose_label: 'Dose ao nascer', target_disease: 'Hepatite B', recommended_age_months: 0, is_mandatory_sus: true } },
  { id: 'vr3', baby_id: 'b1', vaccine_id: 'v3', status: 'applied', applied_date: '2026-09-15', clinic_or_post: 'Posto de Saúde Vila Mariana', batch_number: 'PENTA-1092', vaccine: { id: 'v3', name: 'Pentavalente (1ª Dose)', dose_label: '1ª Dose', target_disease: 'Difteria, Tétano, Coqueluche, Hib, Hepatite B', recommended_age_months: 2, is_mandatory_sus: true } },
  { id: 'vr4', baby_id: 'b1', vaccine_id: 'v4', status: 'pending', scheduled_date: '2026-11-15', vaccine: { id: 'v4', name: 'Pentavalente (2ª Dose)', dose_label: '2ª Dose', target_disease: 'Difteria, Tétano, Coqueluche, Hib, Hepatite B', recommended_age_months: 4, is_mandatory_sus: true } },
  { id: 'vr5', baby_id: 'b1', vaccine_id: 'v5', status: 'pending', scheduled_date: '2026-11-15', vaccine: { id: 'v5', name: 'VIP Poliomielite (2ª Dose)', dose_label: '2ª Dose', target_disease: 'Paralisia Infantil', recommended_age_months: 4, is_mandatory_sus: true } },
  { id: 'vr6', baby_id: 'b1', vaccine_id: 'v6', status: 'pending', scheduled_date: '2026-11-15', vaccine: { id: 'v6', name: 'Meningocócica B (Clínica Privada)', dose_label: '1ª Dose', target_disease: 'Meningite Meningocócica do tipo B', recommended_age_months: 4, is_mandatory_sus: false, is_private_clinic: true } },
];

// Dados Iniciais da Gestação
const INITIAL_ULTRASOUNDS: UltrasoundRecord[] = [
  {
    id: 'u1',
    baby_id: 'b2',
    gestational_week: 8,
    exam_date: '2026-06-10',
    exam_name: '1º Ultrassom Transvaginal',
    doctor_or_clinic: 'Laboratório Fleury',
    photo_url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80',
    heart_rate_bpm: 162,
    doctor_report: 'Embrião único com batimentos cardíacos presentes e rítmicos. Saco gestacional regular.',
  },
  {
    id: 'u2',
    baby_id: 'b2',
    gestational_week: 12,
    exam_date: '2026-07-08',
    exam_name: 'Morfológico de 1º Trimestre (TN)',
    doctor_or_clinic: 'Dra. Renata - Medicina Fetal',
    photo_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    heart_rate_bpm: 154,
    doctor_report: 'Translucência nucal normal (1.4 mm). Osso nasal presente. Risco muito baixo para cromossomopatias.',
  },
  {
    id: 'u3',
    baby_id: 'b2',
    gestational_week: 22,
    exam_date: '2026-09-15',
    exam_name: 'Morfológico de 2º Trimestre (3D/4D)',
    doctor_or_clinic: 'Clínica Alta Diagnósticos',
    photo_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    heart_rate_bpm: 148,
    doctor_report: 'Anatomia fetal completa sem alterações. Sexo confirmado: Menina (Maya). Peso estimado: 490g.',
  },
];

const INITIAL_BELLY_PHOTOS: BellyPhoto[] = [
  { id: 'bp1', baby_id: 'b2', week: 12, photo_url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=600&q=80', taken_at: '2026-07-08', caption: 'Primeira curvinha da barriga aparecendo!' },
  { id: 'bp2', baby_id: 'b2', week: 16, photo_url: 'https://images.unsplash.com/photo-1537655780520-1e392ead81f2?auto=format&fit=crop&w=600&q=80', taken_at: '2026-08-05', caption: 'Sentindo as primeiras borboletinhas na barriga.' },
  { id: 'bp3', baby_id: 'b2', week: 20, photo_url: 'https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?auto=format&fit=crop&w=600&q=80', taken_at: '2026-09-02', caption: 'Metade do caminho! Barriguinha já não esconde mais.' },
];

const INITIAL_MATERNAL_LOGS: MaternalHealthLog[] = [
  { id: 'ml1', baby_id: 'b2', recorded_date: '2026-09-02', weight_kg: 62.4, blood_pressure: '110/70', fasting_blood_glucose: 84, symptoms: ['Azia leve', 'Dor na lombar'], notes: 'Consulta pré-natal tranquila.' },
  { id: 'ml2', baby_id: 'b2', recorded_date: '2026-10-01', weight_kg: 64.1, blood_pressure: '115/75', fasting_blood_glucose: 86, symptoms: ['Inchaço nos tornozelos', 'Cansaço'], notes: 'Médico orientou elevar as pernas.' },
];

const INITIAL_MATERNITY_BAG: MaternityBagItem[] = [
  // Bebê
  { id: 'bag1', category: 'baby', name: 'Saída de Maternidade completa', quantity: '1 conjunto', is_packed: true },
  { id: 'bag2', category: 'baby', name: 'Bodies manga longa', quantity: '6 unidades', is_packed: true },
  { id: 'bag3', category: 'baby', name: 'Culotes / Mijões', quantity: '6 unidades', is_packed: true },
  { id: 'bag4', category: 'baby', name: 'Macacões quentinhos', quantity: '4 unidades', is_packed: false },
  { id: 'bag5', category: 'baby', name: 'Paninhos de boca / Fraldinhas', quantity: '8 unidades', is_packed: true },
  { id: 'bag6', category: 'baby', name: 'Fraldas descartáveis RN e P', quantity: '1 pacote de cada', is_packed: false },
  { id: 'bag7', category: 'baby', name: 'Manta suave', quantity: '2 unidades', is_packed: true },
  // Mãe
  { id: 'bag8', category: 'mom', name: 'Camisolas com abertura para amamentar', quantity: '3 unidades', is_packed: true },
  { id: 'bag9', category: 'mom', name: 'Sutiãs de amamentação', quantity: '3 unidades', is_packed: true },
  { id: 'bag10', category: 'mom', name: 'Calcinhas pós-parto confortáveis', quantity: '6 unidades', is_packed: false },
  { id: 'bag11', category: 'mom', name: 'Absorventes pós-parto / Noturnos', quantity: '2 pacotes', is_packed: false },
  { id: 'bag12', category: 'mom', name: 'Pomada de Lanolina para bicos', quantity: '1 bisnaga', is_packed: true },
  // Documentos
  { id: 'bag13', category: 'docs', name: 'Carteirinha do Convênio e RG dos Pais', quantity: 'Originais', is_packed: true },
  { id: 'bag14', category: 'docs', name: 'Cartão de Pré-Natal e Últimos Ultrassons', quantity: 'Pasta de exames', is_packed: true },
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
  
  // Saúde Pediátrica
  vaccines: VaccineRecord[];
  markVaccineAsApplied: (recordId: string, clinic: string, batchNumber?: string) => void;
  addCustomVaccine: (vaccineName: string, targetDisease: string, recommendedMonths: number, isPrivate: boolean) => void;
  growthLogs: GrowthLog[];
  addGrowthLog: (data: { recorded_date: string; weight_kg: number; height_cm: number; head_circumference_cm?: number; notes?: string }) => void;
  medicationLogs: MedicationLog[];
  addMedicationLog: (data: { medicine_name: string; dosage: string; temperature_celsius?: number; interval_hours?: number; administered_by: string; reason?: string; notes?: string }) => void;
  appointments: MedicalAppointment[];
  addAppointment: (data: Omit<MedicalAppointment, 'id' | 'baby_id'>) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  emergencyShare: EmergencyShare;

  // Módulo Gestação (De A a Z)
  ultrasounds: UltrasoundRecord[];
  addUltrasound: (data: Omit<UltrasoundRecord, 'id' | 'baby_id'>) => void;
  bellyPhotos: BellyPhoto[];
  addBellyPhoto: (data: Omit<BellyPhoto, 'id' | 'baby_id'>) => void;
  maternalLogs: MaternalHealthLog[];
  addMaternalLog: (data: Omit<MaternalHealthLog, 'id' | 'baby_id'>) => void;
  maternityBag: MaternityBagItem[];
  toggleBagItem: (id: string) => void;
  addBagItem: (category: MaternityBagItem['category'], name: string, quantity?: string) => void;
  contractions: ContractionRecord[];
  addContraction: (durationSeconds: number, intervalSeconds?: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baby, setBaby] = useState<Baby>(INITIAL_BABY);
  const [family] = useState<Family>(INITIAL_FAMILY);
  const [members] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  
  // Saúde
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(INITIAL_VACCINES);
  const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>(INITIAL_GROWTH_LOGS);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>(INITIAL_APPOINTMENTS);
  const [emergencyShare] = useState<EmergencyShare>(INITIAL_EMERGENCY_SHARE);

  // Gestação
  const [ultrasounds, setUltrasounds] = useState<UltrasoundRecord[]>(INITIAL_ULTRASOUNDS);
  const [bellyPhotos, setBellyPhotos] = useState<BellyPhoto[]>(INITIAL_BELLY_PHOTOS);
  const [maternalLogs, setMaternalLogs] = useState<MaternalHealthLog[]>(INITIAL_MATERNAL_LOGS);
  const [maternityBag, setMaternityBag] = useState<MaternityBagItem[]>(INITIAL_MATERNITY_BAG);
  const [contractions, setContractions] = useState<ContractionRecord[]>([]);

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

  const markVaccineAsApplied = (recordId: string, clinic: string, batchNumber?: string) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.id === recordId
          ? {
              ...v,
              status: 'applied',
              applied_date: new Date().toISOString().split('T')[0],
              clinic_or_post: clinic || 'Posto de Saúde Municipal',
              batch_number: batchNumber || v.batch_number || 'LOTE-2026',
            }
          : v
      )
    );
  };

  const addCustomVaccine = (vaccineName: string, targetDisease: string, recommendedMonths: number, isPrivate: boolean) => {
    const newRecord: VaccineRecord = {
      id: `vr_${Date.now()}`,
      baby_id: baby.id,
      vaccine_id: `v_custom_${Date.now()}`,
      status: 'pending',
      vaccine: {
        id: `v_custom_${Date.now()}`,
        name: vaccineName,
        dose_label: 'Dose Especial',
        target_disease: targetDisease,
        recommended_age_months: recommendedMonths,
        is_mandatory_sus: !isPrivate,
        is_private_clinic: isPrivate,
      },
    };
    setVaccines((prev) => [...prev, newRecord]);
  };

  const addGrowthLog = (data: { recorded_date: string; weight_kg: number; height_cm: number; head_circumference_cm?: number; notes?: string }) => {
    const ageMonths = baby.birth_date ? calculateBabyAge(baby.birth_date).months : 3;
    const percentile = calculateWHOWeightPercentile(data.weight_kg, ageMonths);
    
    const newLog: GrowthLog = {
      id: `g_${Date.now()}`,
      baby_id: baby.id,
      recorded_date: data.recorded_date,
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      head_circumference_cm: data.head_circumference_cm,
      percentile_weight: percentile,
      notes: data.notes,
    };
    setGrowthLogs((prev) => [newLog, ...prev]);
  };

  const addMedicationLog = (data: { medicine_name: string; dosage: string; temperature_celsius?: number; interval_hours?: number; administered_by: string; reason?: string; notes?: string }) => {
    const nowIso = new Date().toISOString();
    const interval = data.interval_hours || 6;
    const nextDose = calculateNextDose(nowIso, interval);

    const newLog: MedicationLog = {
      id: `med_${Date.now()}`,
      baby_id: baby.id,
      medicine_name: data.medicine_name,
      dosage: data.dosage,
      temperature_celsius: data.temperature_celsius,
      administered_at: nowIso,
      next_dose_at: nextDose,
      interval_hours: interval,
      administered_by: data.administered_by,
      reason: data.reason,
      notes: data.notes,
    };
    setMedicationLogs((prev) => [newLog, ...prev]);
  };

  const addAppointment = (data: Omit<MedicalAppointment, 'id' | 'baby_id'>) => {
    const newAppt: MedicalAppointment = {
      ...data,
      id: `appt_${Date.now()}`,
      baby_id: baby.id,
    };
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const addAllergy = (allergy: string) => {
    if (!baby.allergies.includes(allergy)) {
      setBaby((prev) => ({ ...prev, allergies: [...prev.allergies, allergy] }));
    }
  };

  const removeAllergy = (allergy: string) => {
    setBaby((prev) => ({ ...prev, allergies: prev.allergies.filter((a) => a !== allergy) }));
  };

  // Gestação Métodos
  const addUltrasound = (data: Omit<UltrasoundRecord, 'id' | 'baby_id'>) => {
    const newRecord: UltrasoundRecord = {
      ...data,
      id: `us_${Date.now()}`,
      baby_id: baby.id,
    };
    setUltrasounds((prev) => [newRecord, ...prev]);
  };

  const addBellyPhoto = (data: Omit<BellyPhoto, 'id' | 'baby_id'>) => {
    const newRecord: BellyPhoto = {
      ...data,
      id: `bp_${Date.now()}`,
      baby_id: baby.id,
    };
    setBellyPhotos((prev) => [newRecord, ...prev]);
  };

  const addMaternalLog = (data: Omit<MaternalHealthLog, 'id' | 'baby_id'>) => {
    const newRecord: MaternalHealthLog = {
      ...data,
      id: `ml_${Date.now()}`,
      baby_id: baby.id,
    };
    setMaternalLogs((prev) => [newRecord, ...prev]);
  };

  const toggleBagItem = (id: string) => {
    setMaternityBag((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_packed: !item.is_packed } : item))
    );
  };

  const addBagItem = (category: MaternityBagItem['category'], name: string, quantity?: string) => {
    const newItem: MaternityBagItem = {
      id: `bag_${Date.now()}`,
      category,
      name,
      quantity,
      is_packed: false,
    };
    setMaternityBag((prev) => [...prev, newItem]);
  };

  const addContraction = (durationSeconds: number, intervalSeconds?: number) => {
    const newRecord: ContractionRecord = {
      id: `c_${Date.now()}`,
      start_time: new Date().toISOString(),
      duration_seconds: durationSeconds,
      interval_seconds: intervalSeconds,
    };
    setContractions((prev) => [newRecord, ...prev]);
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
        addCustomVaccine,
        growthLogs,
        addGrowthLog,
        medicationLogs,
        addMedicationLog,
        appointments,
        addAppointment,
        addAllergy,
        removeAllergy,
        emergencyShare,
        ultrasounds,
        addUltrasound,
        bellyPhotos,
        addBellyPhoto,
        maternalLogs,
        addMaternalLog,
        maternityBag,
        toggleBagItem,
        addBagItem,
        contractions,
        addContraction,
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
