/**
 * NURI TYPE DEFINITIONS - ENTIDADES E MODELOS DE DADOS
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
  relationship_label: string; // Ex: "Mãe", "Vovó", "Dindo"
  can_post: boolean;
  can_edit_health: boolean;
  profile?: Profile;
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
  allergies: string[];
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
  month_age?: number; // Para badge de mesversário
  taken_at: string;
  created_at: string;
  reactions_count?: number;
  comments_count?: number;
  reactions?: MomentReaction[];
}

export interface VaccineCatalogItem {
  id: string;
  name: string;
  dose_label: string;
  target_disease: string;
  recommended_age_months: number;
  is_mandatory_sus: boolean;
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
}

export interface GrowthLog {
  id: string;
  baby_id: string;
  recorded_date: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  notes?: string;
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
