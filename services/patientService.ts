import type { Patient, ClinicalEncounter, PrescribedMedication, Assessment, BiomarkerSet, ClinicalJourneyRecord, ScannedPrescription } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PATIENTS } from '../constants';

// ----- Relational schema (normalized tables) -----

interface DbPatient {
  id: string;
  abha_id: string | null;
  abha_address: string | null;
  abha_linked_at: string | null;
  full_name: string;
  dob: string;
  gender: string;
  contact_number: string;
  email: string | null;
  clinical_status: string;
  joined_at: string;
  reception_notes: string | null;
  visit_type: string | null;
  chief_complaint: string | null;
  assigned_doctor_name: string | null;
  diagnosis: string | null;
  first_diagnosis_date: string | null;
  medical_history: unknown;
  family_history: unknown;
  psychosocial_factors: unknown;
}

interface DbEncounter {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  primary_diagnosis: string;
  secondary_diagnosis: string | null;
  is_confirmed: boolean;
  doctor_notes: string | null;
  therapy_recommended: string | null;
  lab_tests_ordered: boolean;
  supplements_prescribed: boolean;
  finalized_at: string | null;
  created_at: string;
}

interface DbMedication {
  id: string;
  encounter_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration_days: number | null;
  duration_text: string | null;
  route: string;
  instructions: string | null;
}

interface DbAssessment {
  id: string;
  patient_id: string;
  test_type: string;
  raw_score: number;
  responses: Record<number, number>;
  severity: string | null;
  ai_interpretation: string | null;
  assessment_date: string;
}

interface DbBiomarker {
  id: string;
  patient_id: string;
  biomarker_type: string;
  value: number;
  recorded_at: string;
}

interface DbJourney {
  id: string;
  patient_id: string;
  facility_name: string;
  clinician_name: string | null;
  start_date: string;
  end_date: string | null;
  reason_for_visit: string | null;
  outcome: string | null;
  prescribed_medications: string[] | null;
  medication_changes: string[] | null;
}

interface DbPrescription {
  id: string;
  patient_id: string;
  image_storage_url: string;
  raw_ocr_text: string;
  doctor_name: string | null;
  hospital_name: string | null;
  department: string | null;
  diagnosis: string | null;
  items: unknown;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  scanned_at: string;
  notes: string | null;
}

/** Detect if the database has the new relational schema (full_name column) vs legacy (payload). */
async function isRelationalSchema(): Promise<boolean> {
  const { data, error } = await supabase.from('patients').select('id').limit(1);
  if (error) return false;
  if (!data || data.length === 0) return true; // empty table, assume relational
  const row = data[0] as Record<string, unknown>;
  return 'full_name' in row;
}

/** Fetch all patients from normalized tables. Returns [] if not configured or on error. */
export async function fetchPatients(): Promise<Patient[]> {
  if (!isSupabaseConfigured()) return [];
  const relational = await isRelationalSchema();
  if (!relational) return fetchPatientsLegacy();

  const { data: patients, error: pe } = await supabase
    .from('patients')
    .select('*')
    .order('updated_at', { ascending: false });
  if (pe || !patients?.length) {
    if (pe) console.warn('[patientService] fetchPatients error:', pe.message);
    return [];
  }

  const ids = (patients as DbPatient[]).map((p) => p.id);
  const [encountersRes, assessmentsRes, biomarkersRes, journeyRes, prescriptionsRes] = await Promise.all([
    supabase.from('clinical_encounters').select('*').in('patient_id', ids),
    supabase.from('assessments').select('*').in('patient_id', ids),
    supabase.from('biomarkers').select('*').in('patient_id', ids),
    supabase.from('clinical_journey').select('*').in('patient_id', ids),
    supabase.from('scanned_prescriptions').select('*').in('patient_id', ids),
  ]);

  const encounters = (encountersRes.data ?? []) as DbEncounter[];
  const encounterIds = encounters.map((e) => e.id);
  const { data: medications } = encounterIds.length
    ? await supabase.from('prescribed_medications').select('*').in('encounter_id', encounterIds)
    : { data: [] };
  const meds = (medications ?? []) as DbMedication[];

  const encounterByPatient = new Map<string, DbEncounter[]>();
  for (const e of encounters) {
    if (!encounterByPatient.has(e.patient_id)) encounterByPatient.set(e.patient_id, []);
    encounterByPatient.get(e.patient_id)!.push(e);
  }
  const medsByEncounter = new Map<string, DbMedication[]>();
  for (const m of meds) {
    if (!medsByEncounter.has(m.encounter_id)) medsByEncounter.set(m.encounter_id, []);
    medsByEncounter.get(m.encounter_id)!.push(m);
  }

  const assessments = (assessmentsRes.data ?? []) as DbAssessment[];
  const biomarkers = (biomarkersRes.data ?? []) as DbBiomarker[];
  const journey = (journeyRes.data ?? []) as DbJourney[];
  const prescriptions = (prescriptionsRes.data ?? []) as DbPrescription[];

  const assessmentsByPatient = groupBy(assessments, 'patient_id');
  const biomarkersByPatient = groupBy(biomarkers, 'patient_id');
  const journeyByPatient = groupBy(journey, 'patient_id');
  const prescriptionsByPatient = groupBy(prescriptions, 'patient_id');

  return (patients as DbPatient[]).map((p) =>
    mapDbToPatient(
      p,
      encounterByPatient.get(p.id) ?? [],
      medsByEncounter,
      assessmentsByPatient.get(p.id) ?? [],
      biomarkersByPatient.get(p.id) ?? [],
      journeyByPatient.get(p.id) ?? [],
      prescriptionsByPatient.get(p.id) ?? []
    )
  );
}

function groupBy<T>(arr: T[], key: keyof T): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const x of arr) {
    const k = String((x as Record<string, unknown>)[key as string]);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return m;
}

function mapDbToPatient(
  p: DbPatient,
  encounters: DbEncounter[],
  medsByEncounter: Map<string, DbMedication[]>,
  assessments: DbAssessment[],
  biomarkers: DbBiomarker[],
  journey: DbJourney[],
  prescriptions: DbPrescription[]
): Patient {
  const sortedEncounters = [...encounters].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const latestEncounter = sortedEncounters[0];
  const currentEncounter: ClinicalEncounter | undefined = latestEncounter
    ? {
        primaryDiagnosis: latestEncounter.primary_diagnosis,
        secondaryDiagnosis: latestEncounter.secondary_diagnosis ?? undefined,
        isConfirmed: latestEncounter.is_confirmed,
        medications: (medsByEncounter.get(latestEncounter.id) ?? []).map((m) => ({
          name: m.medicine_name,
          dosage: m.dosage,
          frequency: m.frequency as PrescribedMedication['frequency'],
          duration: m.duration_text ?? (m.duration_days ? `${m.duration_days} days` : ''),
          route: m.route as PrescribedMedication['route'],
          instructions: m.instructions ?? undefined,
        })),
        labTestsOrdered: latestEncounter.lab_tests_ordered,
        supplementsPrescribed: latestEncounter.supplements_prescribed,
        therapyRecommended: latestEncounter.therapy_recommended ?? '',
        doctorNotes: latestEncounter.doctor_notes ?? '',
      }
    : undefined;

  const biomarkerSet = toBiomarkerSet(biomarkers);

  return {
    id: p.id,
    name: p.full_name,
    dob: p.dob,
    gender: p.gender,
    contact: p.contact_number,
    joinedAt: p.joined_at.split('T')[0],
    abha:
      p.abha_id || p.abha_address
        ? {
            abhaNumber: p.abha_id ?? undefined,
            abhaAddress: p.abha_address ?? undefined,
            linkedAt: p.abha_linked_at ?? undefined,
          }
        : undefined,
    diagnosis: p.diagnosis ?? undefined,
    firstDiagnosisDate: p.first_diagnosis_date ?? undefined,
    medicalHistory: (p.medical_history as Patient['medicalHistory']) ?? undefined,
    clinicalJourney: journey.map((j) => ({
      date: j.start_date,
      endDate: j.end_date ?? undefined,
      facility: j.facility_name,
      clinician: j.clinician_name ?? '',
      reasonForVisit: j.reason_for_visit ?? '',
      outcome: j.outcome ?? undefined,
      prescribedMedications: j.prescribed_medications ?? undefined,
      medicationChanges: j.medication_changes ?? undefined,
    })),
    psychosocialFactors: (p.psychosocial_factors as string[]) ?? undefined,
    familyHistory: (p.family_history as Patient['familyHistory']) ?? undefined,
    prescriptions: prescriptions.map((r) => ({
      id: r.id,
      date: r.scanned_at.split('T')[0],
      hospitalName: r.hospital_name ?? undefined,
      doctorName: r.doctor_name ?? undefined,
      department: r.department ?? undefined,
      diagnosis: r.diagnosis ?? undefined,
      imageUrl: r.image_storage_url,
      rawText: r.raw_ocr_text,
      items: (r.items as ScannedPrescription['items']) ?? [],
      verifiedBy: r.verified_by ?? '',
      verifiedAt: r.verified_at ?? '',
      notes: r.notes ?? undefined,
    })),
    biomarkers: biomarkerSet,
    clinicalStatus: (p.clinical_status as Patient['clinicalStatus']) ?? undefined,
    assignedDoctor: p.assigned_doctor_name ?? undefined,
    visitType: (p.visit_type as Patient['visitType']) ?? undefined,
    chiefComplaint: p.chief_complaint ?? undefined,
    receptionNotes: p.reception_notes ?? undefined,
    currentEncounter: currentEncounter,
  };
}

function toBiomarkerSet(rows: DbBiomarker[]): BiomarkerSet | undefined {
  if (!rows.length) return undefined;
  const byType = groupBy(rows, 'biomarker_type');
  const toRecords = (key: keyof BiomarkerSet) =>
    (byType.get(key) ?? []).map((r) => ({ date: r.recorded_at, value: r.value }));
  return {
    weight: toRecords('weight'),
    systolicBP: toRecords('systolicBP'),
    diastolicBP: toRecords('diastolicBP'),
    sleepHours: toRecords('sleepHours'),
    vitaminD: toRecords('vitaminD'),
    vitaminB12: toRecords('vitaminB12'),
    hbA1c: byType.has('hbA1c') ? toRecords('hbA1c') : undefined,
  };
}

/** Save patient to normalized tables (upsert patient + related rows). */
export async function insertPatient(patient: Patient): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const relational = await isRelationalSchema();
  if (!relational) return insertPatientLegacy(patient);

  const { error: patientError } = await supabase.from('patients').upsert(
    {
      id: patient.id,
      abha_id: patient.abha?.abhaNumber ?? null,
      abha_address: patient.abha?.abhaAddress ?? null,
      abha_linked_at: patient.abha?.linkedAt ?? null,
      full_name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      contact_number: patient.contact,
      email: patient.contact.includes('@') ? patient.contact : null,
      clinical_status: patient.clinicalStatus ?? 'New',
      joined_at: patient.joinedAt,
      reception_notes: patient.receptionNotes ?? null,
      visit_type: patient.visitType ?? null,
      chief_complaint: patient.chiefComplaint ?? null,
      assigned_doctor_name: patient.assignedDoctor ?? null,
      diagnosis: patient.diagnosis ?? null,
      first_diagnosis_date: patient.firstDiagnosisDate ?? null,
      medical_history: patient.medicalHistory ?? null,
      family_history: patient.familyHistory ?? null,
      psychosocial_factors: patient.psychosocialFactors ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (patientError) {
    console.warn('[patientService] insertPatient patients error:', patientError.message);
    return false;
  }

  // Encounters: delete existing and re-insert current (or we could upsert by a stable encounter id)
  const { data: existingEncounters } = await supabase
    .from('clinical_encounters')
    .select('id')
    .eq('patient_id', patient.id);
  if (existingEncounters?.length) {
    await supabase.from('prescribed_medications').delete().in('encounter_id', existingEncounters.map((e) => e.id));
    await supabase.from('clinical_encounters').delete().eq('patient_id', patient.id);
  }

  if (patient.currentEncounter) {
    const { data: enc } = await supabase
      .from('clinical_encounters')
      .insert({
        patient_id: patient.id,
        primary_diagnosis: patient.currentEncounter.primaryDiagnosis,
        secondary_diagnosis: patient.currentEncounter.secondaryDiagnosis ?? null,
        is_confirmed: patient.currentEncounter.isConfirmed,
        doctor_notes: patient.currentEncounter.doctorNotes ?? null,
        therapy_recommended: patient.currentEncounter.therapyRecommended ?? null,
        lab_tests_ordered: patient.currentEncounter.labTestsOrdered ?? false,
        supplements_prescribed: patient.currentEncounter.supplementsPrescribed ?? false,
      })
      .select('id')
      .single();
    if (enc?.id && patient.currentEncounter.medications?.length) {
      await supabase.from('prescribed_medications').insert(
        patient.currentEncounter.medications.map((m) => ({
          encounter_id: enc.id,
          medicine_name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration_text: m.duration,
          route: m.route,
          instructions: m.instructions ?? null,
        }))
      );
    }
  }

  // Assessments: replace all for this patient
  await supabase.from('assessments').delete().eq('patient_id', patient.id);
  // (We don't have assessments on Patient type directly; they're on Session. So skip unless we add session/assessment sync.)

  // Biomarkers
  await supabase.from('biomarkers').delete().eq('patient_id', patient.id);
  if (patient.biomarkers) {
    const rows: { patient_id: string; biomarker_type: string; value: number; recorded_at: string }[] = [];
    const push = (type: string, records: { date: string; value: number }[]) => {
      records.forEach((r) => rows.push({ patient_id: patient.id, biomarker_type: type, value: r.value, recorded_at: r.date }));
    };
    push('weight', patient.biomarkers.weight ?? []);
    push('systolicBP', patient.biomarkers.systolicBP ?? []);
    push('diastolicBP', patient.biomarkers.diastolicBP ?? []);
    push('sleepHours', patient.biomarkers.sleepHours ?? []);
    push('vitaminD', patient.biomarkers.vitaminD ?? []);
    push('vitaminB12', patient.biomarkers.vitaminB12 ?? []);
    if (patient.biomarkers.hbA1c) push('hbA1c', patient.biomarkers.hbA1c);
    if (rows.length) await supabase.from('biomarkers').insert(rows);
  }

  // Clinical journey
  await supabase.from('clinical_journey').delete().eq('patient_id', patient.id);
  if (patient.clinicalJourney?.length) {
    await supabase.from('clinical_journey').insert(
      patient.clinicalJourney.map((j) => ({
        patient_id: patient.id,
        facility_name: j.facility,
        clinician_name: j.clinician || null,
        start_date: j.date,
        end_date: j.endDate ?? null,
        reason_for_visit: j.reasonForVisit ?? null,
        outcome: j.outcome ?? null,
        prescribed_medications: j.prescribedMedications ?? null,
        medication_changes: j.medicationChanges ?? null,
      }))
    );
  }

  // Scanned prescriptions: we don't delete/re-insert on every save; only add new ones via scanner. So skip here.
  return true;
}

export async function updatePatientInSupabase(patient: Patient): Promise<boolean> {
  return insertPatient(patient);
}

/** Legacy: single-table payload (old migration). */
interface LegacyRow {
  id: string;
  payload: Patient;
}
async function fetchPatientsLegacy(): Promise<Patient[]> {
  const { data, error } = await supabase.from('patients').select('id, payload').order('updated_at', { ascending: false });
  if (error) {
    console.warn('[patientService] fetchPatientsLegacy error:', error.message);
    return [];
  }
  return (data ?? []).map((row: LegacyRow) => row.payload);
}
async function insertPatientLegacy(patient: Patient): Promise<boolean> {
  const { error } = await supabase.from('patients').upsert(
    { id: patient.id, payload: patient, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
  if (error) {
    console.warn('[patientService] insertPatientLegacy error:', error.message);
    return false;
  }
  return true;
}

/** Seed demo patients if no patients exist. Uses MOCK_PATIENTS and relational save. */
export async function seedDemoDataIfEmpty(): Promise<Patient[]> {
  if (!isSupabaseConfigured()) return [];
  const existing = await fetchPatients();
  if (existing.length > 0) return existing;
  for (const patient of MOCK_PATIENTS) {
    await insertPatient(patient);
  }
  return fetchPatients();
}
