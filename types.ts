
/** ABHA (Ayushman Bharat Health Account) – 14-digit health ID and address for ABDM linking */
export interface AbhaInfo {
  abhaNumber?: string;   // 14-digit ABHA number
  abhaAddress?: string;  // e.g. user@abdm
  linkedAt?: string;     // ISO date when linked
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  contact: string;
  joinedAt: string;
  abha?: AbhaInfo;
  diagnosis?: string;
  medicalHistory?: MedicalIllness[];
  firstDiagnosisDate?: string;
  clinicalJourney?: ClinicalJourneyRecord[];
  psychosocialFactors?: string[];
  familyHistory?: FamilyNode[];
  prescriptions?: ScannedPrescription[];
  biomarkers?: BiomarkerSet;
  // New clinical workflow fields
  clinicalStatus?: 'New' | 'In Progress' | 'Under Treatment';
  assignedDoctor?: string;
  visitType?: 'New Consultation' | 'Follow-up' | 'Emergency';
  chiefComplaint?: string;
  receptionNotes?: string;
  currentEncounter?: ClinicalEncounter;
}

export interface ClinicalEncounter {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  isConfirmed: boolean;
  medications: PrescribedMedication[];
  labTestsOrdered: boolean;
  supplementsPrescribed: boolean;
  therapyRecommended: string;
  doctorNotes: string;
}

export interface PrescribedMedication {
  name: string;
  dosage: string;
  frequency: 'OD' | 'BD' | 'TDS' | 'HS' | 'PRN';
  duration: string;
  route: 'Oral' | 'Injection' | 'Other';
  instructions?: string;
}

export interface BiomarkerRecord {
  date: string;
  value: number;
}

export interface BiomarkerSet {
  weight: BiomarkerRecord[];
  systolicBP: BiomarkerRecord[];
  diastolicBP: BiomarkerRecord[];
  sleepHours: BiomarkerRecord[];
  vitaminD: BiomarkerRecord[];
  vitaminB12: BiomarkerRecord[];
  hbA1c?: BiomarkerRecord[];
}

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  confidence: 'high' | 'medium' | 'low';
  drugClass?: 'SSRI' | 'SNRI' | 'Antipsychotic' | 'Anxiolytic' | 'Hypnotic' | 'Mood Stabilizer' | 'Other';
}

export interface ScannedPrescription {
  id: string;
  date: string;
  hospitalName?: string;
  doctorName?: string;
  department?: string;
  diagnosis?: string;
  imageUrl: string;
  rawText: string;
  items: PrescriptionItem[];
  verifiedBy: string;
  verifiedAt: string;
  notes?: string;
}

export interface ClinicalJourneyRecord {
  date: string;
  endDate?: string; // For medication bars
  facility: string;
  clinician: string;
  reasonForVisit: string;
  outcome?: string;
  prescribedMedications?: string[];
  medicationChanges?: string[]; // "Dosage increased", "Switched from X to Y"
}

export interface FamilyNode {
  relation: string;
  status: 'Healthy' | 'Diagnosed' | 'Deceased' | 'Unknown';
  condition?: string;
  onsetAge?: number;
  severity?: 'Mild' | 'Moderate' | 'Severe' | 'Chronic';
  notes?: string;
  children?: FamilyNode[];
}

export interface Medication {
  name: string;
  dosage: string;
  isCurrent: boolean;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  drugClass?: string;
}

export interface MedicalIllness {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  isMedicated: boolean;
  medications: Medication[];
}

export interface VitalRecord {
  name: 'Vitamin B12' | 'Vitamin D' | 'Vitamin A';
  value: number;
  unit: string;
  status: 'low' | 'optimal' | 'high';
}

export interface Assessment {
  type: 'PHQ-9' | 'GAD-7';
  score: number;
  responses: Record<number, number>;
  date: string;
  severity?: string;
  aiInterpretation?: string;
}

export interface Session {
  id: string;
  patientId: string;
  date: string;
  clinicianName: string;
  notes: string;
  symptoms: string[];
  status: 'improving' | 'stable' | 'worsening' | 'unknown';
  assessments: Assessment[];
  vitals?: VitalRecord[];
}

export interface AIInsight {
  summary: string;
  trendAnalysis: string;
  clinicalFlags: string[];
  keyChanges: string[];
  confidence: number;
}

export interface CollaboratorCase {
  patientName: string;
  diagnosis: string;
  status: 'Critical' | 'Stable' | 'Improving' | 'New Intake';
}

export interface Collaborator {
  id: string;
  name: string;
  role: 'Psychiatrist' | 'Clinical Psychologist' | 'Therapist';
  specialization: string;
  hospital: string;
  cases: CollaboratorCase[];
  contact: string;
}
