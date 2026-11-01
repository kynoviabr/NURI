/**
 * NURI TYPE DEFINITIONS - ENTIDADES E MODELOS DE DADOS
 * Módulo de Saúde Infantil Completo de A a Z
 */

export type UserRole = 'admin' | 'family' | 'caregiver' | 'doctor';
export type BabyStatus = 'gestating' | 'born';
export type BabyGender = 'boy' | 'girl' | 'surprise';
export type MediaType = 'photo' | 'video' | 'milestone_card';
export type MilestoneType = 'routine' | 'mesversario' | 'first_time' | 'gestation' | 'medical';
export type VaccineStatus = 'pending' | 'applied' | 'delayed';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: UserRole;
  relationship_label: string;
  can_post: boolean;
  can_edit_health: boolean;
  profile?: Profile;
}

export interface HealthInsurance {
  plan_name: string;
  card_number: string;
  holder_name: string;
  emergency_phone: string;
  accommodation_type?: string; // Apartamento / Enfermaria
}

export interface Baby {
  id: string;
  family_id: string;
  name: string;
  status: BabyStatus;
  due_date?: string; // YYYY-MM-DD
  birth_date?: string; // YYYY-MM-DD
  gender: BabyGender;
  blood_type?: string;
  birth_weight_kg?: number;
  birth_height_cm?: number;
  allergies: string[];
  conditions?: string[]; // Ex: Refluxo, APLV, Asma
  health_insurance?: HealthInsurance;
  avatar_url?: string;
}

export interface MomentReaction {
  id: string;
  moment_id: string;
  user_id: string;
  emoji?: string;
  comment?: string;
  audio_url?: string;
  user_name?: string;
  created_at: string;
}

export interface Moment {
  id: string;
  family_id: string;
  baby_id: string;
  created_by: string;
  author_name: string;
  author_avatar?: string;
  author_role_label?: string;
  media_type: MediaType;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  milestone_type: MilestoneType;
  milestone_title?: string;
  month_age?: number;
  taken_at: string;
  created_at: string;
  reactions_count?: number;
  reactions?: MomentReaction[];
}

export interface VaccineCatalogItem {
  id: string;
  name: string;
  dose_label: string;
  target_disease: string;
  recommended_age_months: number;
  is_mandatory_sus: boolean;
  is_private_clinic?: boolean;
  description?: string;
}

export interface VaccineRecord {
  id: string;
  baby_id: string;
  vaccine_id: string;
  vaccine: VaccineCatalogItem;
  status: VaccineStatus;
  applied_date?: string;
  scheduled_date?: string;
  batch_number?: string;
  clinic_or_post?: string;
  proof_photo_url?: string;
  notes?: string;
}

// 2. Crescimento e Curvas OMS
export interface GrowthLog {
  id: string;
  baby_id: string;
  recorded_date: string;
  weight_kg: number;
  height_cm: number;
  head_circumference_cm?: number;
  percentile_weight?: string; // Ex: "p50", "p75"
  percentile_height?: string;
  notes?: string;
}

// 3. Medicamentos, Febres e Sintomas
export interface MedicationLog {
  id: string;
  baby_id: string;
  medicine_name: string; // Ex: "Paracetamol", "Dipirona", "Amoxicilina"
  dosage: string; // Ex: "12 gotas", "2.5 ml", "1 comprimido"
  temperature_celsius?: number; // Ex: 38.4 (se associado a febre)
  administered_at: string; // ISO string
  next_dose_at?: string; // Calculado automaticamente pelo intervalo
  interval_hours?: number; // Ex: 6 (a cada 6 horas)
  administered_by: string; // Ex: "Mamãe", "Papai"
  reason?: string; // Ex: "Pico de febre após vacina", "Dor de dente"
  notes?: string;
}

// 4. Consultas Pediátricas
export interface MedicalAppointment {
  id: string;
  baby_id: string;
  doctor_name: string;
  specialty: string; // "Pediatra", "Odontopediatra", "Otorrino"
  clinic_name?: string;
  appointment_date: string;
  questions_to_ask?: string[]; // Dúvidas anotadas pelos pais antes da consulta
  doctor_diagnosis_notes?: string;
  prescription_notes?: string;
  phone?: string;
}

export interface EmergencyPickup {
  name: string;
  document: string;
  phone: string;
  relationship: string;
}

export interface EmergencyShare {
  id: string;
  baby_id: string;
  access_token: string;
  label: string;
  authorized_pickups: EmergencyPickup[];
  emergency_instructions?: string;
  emergency_phones: string[];
  is_active: boolean;
  expires_at?: string;
}

// ==============================================================================
// 5. MÓDULO DE GESTAÇÃO COMPLETO (DE A A Z)
// ==============================================================================

export interface UltrasoundRecord {
  id: string;
  baby_id: string;
  gestational_week: number;
  exam_date: string;
  exam_name: string; // Ex: "1º Ultrassom Transvaginal", "Morfológico 1º Trimestre", "Ecografia 3D"
  doctor_or_clinic?: string;
  photo_url: string;
  heart_rate_bpm?: number; // Ex: 154 bpm
  gestational_age_estimated?: string;
  doctor_report?: string;
}

export interface BellyPhoto {
  id: string;
  baby_id: string;
  week: number;
  photo_url: string;
  taken_at: string;
  caption?: string;
}

export interface MaternalHealthLog {
  id: string;
  baby_id: string;
  recorded_date: string;
  weight_kg?: number;
  blood_pressure?: string; // Ex: "110/70"
  fasting_blood_glucose?: number; // mg/dL
  symptoms: string[]; // Ex: ["Enjoo matinal", "Azia", "Inchaço nos pés"]
  notes?: string;
}

export interface MaternityBagItem {
  id: string;
  category: 'baby' | 'mom' | 'partner' | 'docs';
  name: string;
  quantity?: string;
  is_packed: boolean;
}

export interface ContractionRecord {
  id: string;
  start_time: string;
  duration_seconds: number;
  interval_seconds?: number;
}

// ==============================================================================
// 6. MÓDULO DE ROTINA DIÁRIA DO BEBÊ (DE A A Z)
// ==============================================================================

export type FeedingType = 'breast' | 'bottle' | 'solid';
export type BottleContent = 'formula' | 'breast_milk' | 'water' | 'juice' | 'other';
export type SolidAcceptance = 'great' | 'good' | 'little' | 'refused';

export interface FeedingLog {
  id: string;
  baby_id: string;
  type: FeedingType;
  start_time: string; // ISO string
  end_time?: string;
  // Se for seio
  left_breast_seconds?: number;
  right_breast_seconds?: number;
  last_breast_used?: 'left' | 'right';
  // Se for mamadeira / copo
  bottle_volume_ml?: number;
  bottle_content?: BottleContent;
  // Se for introdução alimentar sólida
  solid_food_name?: string;
  solid_acceptance?: SolidAcceptance;
  notes?: string;
  logged_by: string; // "Mamãe", "Papai", "Babá"
}

export type DiaperType = 'pee' | 'poo' | 'both' | 'dry';
export type DiaperPooColor = 'yellow' | 'green' | 'brown' | 'black' | 'red' | 'white';
export type DiaperPooConsistency = 'liquid' | 'pasty' | 'formed' | 'hard';
export type DiaperPeeVolume = 'light' | 'normal' | 'heavy';

export interface DiaperLog {
  id: string;
  baby_id: string;
  timestamp: string; // ISO string
  type: DiaperType;
  poo_color?: DiaperPooColor;
  poo_consistency?: DiaperPooConsistency;
  pee_volume?: DiaperPeeVolume;
  clinical_alert?: string; // Ex: "Atenção: Fezes brancas exigem avaliação médica urgente"
  notes?: string;
  logged_by: string;
}

export type SleepType = 'nap' | 'night';
export type SleepLocation = 'crib' | 'arms' | 'stroller' | 'bed' | 'other';
export type SleepQuality = 'calm' | 'agitated' | 'restless';

export interface SleepLog {
  id: string;
  baby_id: string;
  start_time: string; // ISO string
  end_time?: string; // Se undefined/null, está dormindo agora
  duration_minutes?: number;
  sleep_type: SleepType;
  location?: SleepLocation;
  quality?: SleepQuality;
  notes?: string;
  logged_by: string;
}

export interface TummyTimeLog {
  id: string;
  baby_id: string;
  timestamp: string;
  duration_minutes: number;
  notes?: string;
  logged_by: string;
}

// ==============================================================================
// 7. MÓDULO DE MEMÓRIAS & ÁLBUM INTELIGENTE (DE A A Z)
// ==============================================================================

export interface FirstMilestoneItem {
  id: string;
  baby_id: string;
  key: string;
  title: string;
  category: 'social' | 'motor' | 'feeding' | 'growth' | 'celebration';
  expected_age_months: number;
  icon: string;
  description: string;
  achieved_date?: string;
  photo_url?: string;
  notes?: string;
  logged_by?: string;
}

