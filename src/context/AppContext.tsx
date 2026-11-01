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
  FeedingLog,
  DiaperLog,
  SleepLog,
  TummyTimeLog,
  FirstMilestoneItem,
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
  {
    id: 'p2',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u2',
    author_name: 'Lucas (Papai)',
    author_role_label: 'Pai',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
    caption: '2 meses do nosso gordinho! Olhar atento pra tudo e já fixando os olhinhos nos nossos rostos. 💙',
    milestone_type: 'mesversario',
    milestone_title: '2º Mesversário',
    month_age: 2,
    taken_at: '2026-09-15T10:00:00Z',
    created_at: '2026-09-15T10:30:00Z',
    reactions_count: 4,
    reactions: [
      { id: 'r3', moment_id: 'p2', user_id: 'u1', emoji: '❤️', comment: 'Meu amor todinho!', user_name: 'Marina (Mãe)', created_at: '2026-09-15T11:00:00Z' },
    ],
  },
  {
    id: 'p3',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u1',
    author_name: 'Marina (Mamãe)',
    author_role_label: 'Mãe',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=800&q=80',
    caption: '1º Mês de vida do Théo! O mês mais intenso, desafiador e apaixonante das nossas vidas. 👶🍼',
    milestone_type: 'mesversario',
    milestone_title: '1º Mesversário',
    month_age: 1,
    taken_at: '2026-08-15T16:00:00Z',
    created_at: '2026-08-15T16:45:00Z',
    reactions_count: 6,
    reactions: [
      { id: 'r4', moment_id: 'p3', user_id: 'u3', emoji: '🥺', comment: 'Passa tão rápido!', user_name: 'Vovó Vera', created_at: '2026-08-15T17:00:00Z' },
    ],
  },
  {
    id: 'p4',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u1',
    author_name: 'Marina (Mamãe)',
    author_role_label: 'Mãe',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    caption: 'Primeiro banho de banheira com o papai! No início estranhou a aguinha morna, depois relaxou e quase dormiu. 🛁💛',
    milestone_type: 'first_time',
    milestone_title: 'Primeiro Banho em Casa',
    taken_at: '2026-07-18T18:00:00Z',
    created_at: '2026-07-18T18:30:00Z',
    reactions_count: 7,
    reactions: [
      { id: 'r5', moment_id: 'p4', user_id: 'u2', emoji: '🥰', comment: 'Melhor momento do meu dia!', user_name: 'Lucas (Pai)', created_at: '2026-07-18T19:00:00Z' },
    ],
  },
  {
    id: 'p5',
    family_id: 'f1',
    baby_id: 'b1',
    created_by: 'u2',
    author_name: 'Lucas (Papai)',
    author_role_label: 'Pai',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    caption: 'Primeiro sorriso social espontâneo olhando nos olhos da mamãe! Derrreteu a casa inteira! 😍',
    milestone_type: 'first_time',
    milestone_title: 'Primeiro Sorriso Social',
    taken_at: '2026-08-20T11:20:00Z',
    created_at: '2026-08-20T11:45:00Z',
    reactions_count: 8,
    reactions: [
      { id: 'r6', moment_id: 'p5', user_id: 'u1', emoji: '❤️', comment: 'Chorei de emoção!', user_name: 'Marina (Mãe)', created_at: '2026-08-20T12:00:00Z' },
    ],
  },
];

const INITIAL_FIRST_MILESTONES: FirstMilestoneItem[] = [
  {
    id: 'fm1',
    baby_id: 'b1',
    key: 'first_smile',
    title: 'Primeiro Sorriso Social',
    category: 'social',
    expected_age_months: 2,
    icon: '😊',
    description: 'Aquele sorriso em resposta à voz ou ao rosto dos pais.',
    achieved_date: '2026-08-20',
    photo_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    notes: 'Sorriu olhando fixamente nos olhos da mamãe após a mamada.',
    logged_by: 'Papai (Lucas)',
  },
  {
    id: 'fm2',
    baby_id: 'b1',
    key: 'first_bath',
    title: 'Primeiro Banho em Casa',
    category: 'growth',
    expected_age_months: 1,
    icon: '🛁',
    description: 'O primeiro banho no quartinho com aguinha morna e carinho.',
    achieved_date: '2026-07-18',
    photo_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    notes: 'Papai deu o banho com muito cuidado, Théo relaxou na água.',
    logged_by: 'Mamãe (Marina)',
  },
  {
    id: 'fm3',
    baby_id: 'b1',
    key: 'first_laugh',
    title: 'Primeira Risadinha Alta',
    category: 'social',
    expected_age_months: 3,
    icon: '😂',
    description: 'Gargalhadinha gostosa que enche a casa de alegria.',
    achieved_date: '2026-10-05',
    photo_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    notes: 'Deu risada alta das cócegas na barriguinha que a vovó fez.',
    logged_by: 'Vovó Vera',
  },
  {
    id: 'fm4',
    baby_id: 'b1',
    key: 'rolled_over',
    title: 'Rolou pela Primeira Vez',
    category: 'motor',
    expected_age_months: 4,
    icon: '🤸',
    description: 'Virou do abdômen para as costas ou vice-versa no tapetinho.',
    logged_by: undefined,
  },
  {
    id: 'fm5',
    baby_id: 'b1',
    key: 'first_tooth',
    title: 'Primeiro Dentinho de Leite',
    category: 'growth',
    expected_age_months: 6,
    icon: '🦷',
    description: 'A pontinha branquinha surgindo na gengiva inferior.',
    logged_by: undefined,
  },
  {
    id: 'fm6',
    baby_id: 'b1',
    key: 'first_solid',
    title: 'Primeira Papinha / Frutinha',
    category: 'feeding',
    expected_age_months: 6,
    icon: '🥣',
    description: 'Início da introdução alimentar aos 6 meses!',
    logged_by: undefined,
  },
  {
    id: 'fm7',
    baby_id: 'b1',
    key: 'sat_up',
    title: 'Sentou sem Apoio',
    category: 'motor',
    expected_age_months: 7,
    icon: '🧸',
    description: 'Equilíbrio firme sentado no chão explorando brinquedos.',
    logged_by: undefined,
  },
  {
    id: 'fm8',
    baby_id: 'b1',
    key: 'crawled',
    title: 'Engatinhou pela Casa',
    category: 'motor',
    expected_age_months: 8,
    icon: '🐾',
    description: 'Autonomia motora para explorar todos os cômodos.',
    logged_by: undefined,
  },
  {
    id: 'fm9',
    baby_id: 'b1',
    key: 'first_steps',
    title: 'Primeiros Passinhos',
    category: 'motor',
    expected_age_months: 12,
    icon: '🚶',
    description: 'Os passos mais emocionantes rumo aos braços dos pais.',
    logged_by: undefined,
  },
  {
    id: 'fm10',
    baby_id: 'b1',
    key: 'first_word',
    title: 'Primeira Palavrinha',
    category: 'social',
    expected_age_months: 11,
    icon: '🗣️',
    description: 'Mamãe, Papai ou outra palavrinha mágica falada com intenção.',
    logged_by: undefined,
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

// Dados Iniciais de Rotina Diária
const getRecentIso = (hoursAgo: number, minutesAgo: number = 0) => {
  const d = new Date(Date.now() - (hoursAgo * 60 + minutesAgo) * 60 * 1000);
  return d.toISOString();
};

const INITIAL_FEEDINGS: FeedingLog[] = [
  {
    id: 'f1',
    baby_id: 'b1',
    type: 'breast',
    start_time: getRecentIso(2, 15),
    end_time: getRecentIso(1, 55),
    left_breast_seconds: 720,
    right_breast_seconds: 480,
    last_breast_used: 'right',
    notes: 'Mamou super bem, arrotou sem regurgitar.',
    logged_by: 'Mamãe (Marina)',
  },
  {
    id: 'f2',
    baby_id: 'b1',
    type: 'bottle',
    start_time: getRecentIso(5, 30),
    end_time: getRecentIso(5, 10),
    bottle_volume_ml: 120,
    bottle_content: 'breast_milk',
    notes: 'Leite materno ordenhado na mamadeira anticólica.',
    logged_by: 'Papai (Lucas)',
  },
  {
    id: 'f3',
    baby_id: 'b1',
    type: 'breast',
    start_time: getRecentIso(8, 45),
    end_time: getRecentIso(8, 20),
    left_breast_seconds: 900,
    right_breast_seconds: 600,
    last_breast_used: 'left',
    notes: 'Mamada da manhã tranquila.',
    logged_by: 'Mamãe (Marina)',
  },
];

const INITIAL_DIAPERS: DiaperLog[] = [
  {
    id: 'd1',
    baby_id: 'b1',
    timestamp: getRecentIso(1, 10),
    type: 'both',
    poo_color: 'yellow',
    poo_consistency: 'pasty',
    pee_volume: 'normal',
    notes: 'Amarelo ouro típico, pele íntegra.',
    logged_by: 'Mamãe (Marina)',
  },
  {
    id: 'd2',
    baby_id: 'b1',
    timestamp: getRecentIso(4, 20),
    type: 'pee',
    pee_volume: 'heavy',
    notes: 'Xixi abundante e claro.',
    logged_by: 'Papai (Lucas)',
  },
  {
    id: 'd3',
    baby_id: 'b1',
    timestamp: getRecentIso(7, 40),
    type: 'both',
    poo_color: 'yellow',
    poo_consistency: 'pasty',
    pee_volume: 'normal',
    logged_by: 'Mamãe (Marina)',
  },
  {
    id: 'd4',
    baby_id: 'b1',
    timestamp: getRecentIso(11, 0),
    type: 'pee',
    pee_volume: 'normal',
    logged_by: 'Mamãe (Marina)',
  },
];

const INITIAL_SLEEPS: SleepLog[] = [
  {
    id: 's1',
    baby_id: 'b1',
    start_time: getRecentIso(4, 0),
    end_time: getRecentIso(2, 45),
    duration_minutes: 75,
    sleep_type: 'nap',
    location: 'crib',
    quality: 'calm',
    notes: 'Soneca relaxada com ruído branco.',
    logged_by: 'Mamãe (Marina)',
  },
  {
    id: 's2',
    baby_id: 'b1',
    start_time: getRecentIso(12, 0),
    end_time: getRecentIso(6, 30),
    duration_minutes: 330,
    sleep_type: 'night',
    location: 'crib',
    quality: 'calm',
    notes: 'Noite tranquila com apenas 1 despertar breve para mamar.',
    logged_by: 'Papai (Lucas)',
  },
];

const INITIAL_TUMMY_TIMES: TummyTimeLog[] = [
  {
    id: 'tt1',
    baby_id: 'b1',
    timestamp: getRecentIso(3, 0),
    duration_minutes: 10,
    notes: 'Sustentou a cabecinha olhando para brinquedos coloridos.',
    logged_by: 'Mamãe (Marina)',
  },
];

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

  // Módulo Rotina Diária (De A a Z)
  feedings: FeedingLog[];
  addFeedingLog: (data: Omit<FeedingLog, 'id'>) => void;
  diapers: DiaperLog[];
  addDiaperLog: (data: Omit<DiaperLog, 'id'>) => void;
  sleeps: SleepLog[];
  addSleepLog: (data: Omit<SleepLog, 'id'>) => void;
  finishActiveSleep: (sleepId: string) => void;
  tummyTimes: TummyTimeLog[];
  addTummyTimeLog: (data: Omit<TummyTimeLog, 'id'>) => void;

  // Módulo Memórias & Álbum Inteligente (De A a Z)
  addMomentReaction: (momentId: string, reaction: { emoji?: string; comment?: string; user_name: string }) => void;
  firstMilestones: FirstMilestoneItem[];
  updateFirstMilestone: (key: string, data: { achieved_date: string; photo_url?: string; notes?: string; logged_by?: string }) => void;
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

  // Rotina Diária
  const [feedings, setFeedings] = useState<FeedingLog[]>(INITIAL_FEEDINGS);
  const [diapers, setDiapers] = useState<DiaperLog[]>(INITIAL_DIAPERS);
  const [sleeps, setSleeps] = useState<SleepLog[]>(INITIAL_SLEEPS);
  const [tummyTimes, setTummyTimes] = useState<TummyTimeLog[]>(INITIAL_TUMMY_TIMES);

  // Memórias & Álbum
  const [firstMilestones, setFirstMilestones] = useState<FirstMilestoneItem[]>(INITIAL_FIRST_MILESTONES);



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

  // Rotina Diária Handlers
  const addFeedingLog = (data: Omit<FeedingLog, 'id'>) => {
    const newRecord: FeedingLog = {
      ...data,
      id: `f_${Date.now()}`,
    };
    setFeedings((prev) => [newRecord, ...prev]);
  };

  const addDiaperLog = (data: Omit<DiaperLog, 'id'>) => {
    const newRecord: DiaperLog = {
      ...data,
      id: `d_${Date.now()}`,
    };
    setDiapers((prev) => [newRecord, ...prev]);
  };

  const addSleepLog = (data: Omit<SleepLog, 'id'>) => {
    const newRecord: SleepLog = {
      ...data,
      id: `s_${Date.now()}`,
    };
    setSleeps((prev) => [newRecord, ...prev]);
  };

  const finishActiveSleep = (sleepId: string) => {
    const nowIso = new Date().toISOString();
    setSleeps((prev) =>
      prev.map((s) => {
        if (s.id === sleepId) {
          const startMs = new Date(s.start_time).getTime();
          const durationMin = Math.max(1, Math.round((Date.now() - startMs) / (1000 * 60)));
          return {
            ...s,
            end_time: nowIso,
            duration_minutes: durationMin,
          };
        }
        return s;
      })
    );
  };

  const addTummyTimeLog = (data: Omit<TummyTimeLog, 'id'>) => {
    const newRecord: TummyTimeLog = {
      ...data,
      id: `tt_${Date.now()}`,
    };
    setTummyTimes((prev) => [newRecord, ...prev]);
  };

  // Memórias & Marcos Handlers
  const addMomentReaction = (momentId: string, reaction: { emoji?: string; comment?: string; user_name: string }) => {
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === momentId) {
          const newReaction = {
            id: `r_${Date.now()}`,
            moment_id: momentId,
            user_id: 'u1',
            emoji: reaction.emoji,
            comment: reaction.comment,
            user_name: reaction.user_name || 'Família',
            created_at: new Date().toISOString(),
          };
          return {
            ...m,
            reactions_count: (m.reactions_count || 0) + (reaction.emoji ? 1 : 0),
            reactions: [...(m.reactions || []), newReaction],
          };
        }
        return m;
      })
    );
  };

  const updateFirstMilestone = (key: string, data: { achieved_date: string; photo_url?: string; notes?: string; logged_by?: string }) => {
    setFirstMilestones((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              achieved_date: data.achieved_date,
              photo_url: data.photo_url || item.photo_url,
              notes: data.notes !== undefined ? data.notes : item.notes,
              logged_by: data.logged_by || 'Mamãe',
            }
          : item
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
        feedings,
        addFeedingLog,
        diapers,
        addDiaperLog,
        sleeps,
        addSleepLog,
        finishActiveSleep,
        tummyTimes,
        addTummyTimeLog,
        firstMilestones,
        updateFirstMilestone,
        addMomentReaction,
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
