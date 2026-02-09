
import { Patient, Session, Collaborator } from './types';

export const DOCTORS = [
  "Dr. Aditi Rao",
  "Dr. Vikram Malhotra",
  "Dr. Priya Mani",
  "Dr. Amit Shah"
];

export const MEDICATIONS_LIST = [
  "Fluoxetine", "Sertraline", "Escitalopram", "Paroxetine", "Fluvoxamine",
  "Venlafaxine", "Desvenlafaxine", "Duloxetine",
  "Amitriptyline", "Nortriptyline",
  "Bupropion", "Mirtazapine",
  "Alprazolam", "Clonazepam", "Lorazepam", "Diazepam",
  "Quetiapine", "Risperidone", "Olanzapine", "Aripiprazole",
  "Lithium", "Sodium Valproate", "Lamotrigine", "Carbamazepine"
];

export const DIAGNOSES_LIST = [
  "Major Depressive Disorder",
  "Generalized Anxiety Disorder",
  "Bipolar I Disorder",
  "Bipolar II Disorder",
  "Panic Disorder",
  "Social Anxiety Disorder",
  "Obsessive-Compulsive Disorder",
  "Post-Traumatic Stress Disorder",
  "Schizophrenia",
  "Schizoaffective Disorder",
  "Adult ADHD",
  "Adjustment Disorder"
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Ananya Sharma',
    dob: '1985-05-12',
    gender: 'Female',
    contact: '+91 98765 43210',
    joinedAt: '2023-11-01',
    abha: { abhaNumber: '12345678901234', abhaAddress: 'ananya.sharma@abdm', linkedAt: '2023-11-01' },
    diagnosis: 'Major Depressive Disorder',
    clinicalStatus: 'Under Treatment',
    assignedDoctor: 'Dr. Aditi Rao',
    visitType: 'Follow-up',
    firstDiagnosisDate: '2015-06-20',
    psychosocialFactors: ['Workplace Pressure (Corporate)', 'Marital Conflict', 'Primary Caregiver for elderly parent'],
    clinicalJourney: [
      {
        date: '2015-06-20',
        endDate: '2018-11-12',
        facility: 'City Care Hospital',
        clinician: 'Dr. S. Verma',
        reasonForVisit: 'Persistent insomnia and weight loss',
        outcome: 'Initial diagnosis of MDD',
        prescribedMedications: ['Fluoxetine 20mg'],
      },
      {
        date: '2018-11-12',
        endDate: '2021-04-05',
        facility: 'Wellness Mind Clinic',
        clinician: 'Dr. Priya Mani',
        reasonForVisit: 'Relapse after job change',
        outcome: 'Adjustment of antidepressant dosage',
        prescribedMedications: ['Sertraline 50mg', 'Clonazepam 0.25mg PRN'],
        medicationChanges: ['Switched Fluoxetine to Sertraline', 'Added Clonazepam']
      },
      {
        date: '2021-04-05',
        endDate: '2023-11-01',
        facility: 'Global Health Center',
        clinician: 'Dr. Amit Shah',
        reasonForVisit: 'Post-pandemic anxiety',
        outcome: 'CBT recommended',
        prescribedMedications: ['Escitalopram 10mg'],
        medicationChanges: ['Switched Sertraline to Escitalopram']
      }
    ],
    familyHistory: [
      {
        relation: 'Father',
        status: 'Diagnosed',
        condition: 'Bipolar II Disorder',
        onsetAge: 42,
        severity: 'Severe',
        notes: 'History of hospitalization, managed with Lithium'
      },
      {
        relation: 'Mother',
        status: 'Healthy',
        notes: 'No reported psychiatric history'
      },
      {
        relation: 'Paternal Grandmother',
        status: 'Deceased',
        condition: 'Schizoaffective Disorder',
        onsetAge: 30,
        severity: 'Chronic',
        notes: 'Long-term institutionalization'
      },
      {
        relation: 'Paternal Grandfather',
        status: 'Healthy',
        notes: 'Hypertension only'
      },
      {
        relation: 'Brother',
        status: 'Diagnosed',
        condition: 'GAD',
        onsetAge: 25,
        severity: 'Mild',
        notes: 'Intermittent therapy, no medication'
      }
    ],
    medicalHistory: [
      {
        id: 'm1',
        name: 'Type 2 Diabetes',
        startDate: '2018-04-10',
        isMedicated: true,
        medications: [
          { name: 'Metformin', dosage: '500mg', isCurrent: true, frequency: 'Twice daily', startDate: '2018-04-10', drugClass: 'Anti-diabetic' },
        ]
      }
    ],
    biomarkers: {
      weight: [
        { date: '2023-11-01', value: 68 },
        { date: '2023-12-15', value: 70 },
        { date: '2024-01-20', value: 72 },
        { date: '2024-03-14', value: 71 }
      ],
      systolicBP: [
        { date: '2023-11-01', value: 130 },
        { date: '2023-12-15', value: 135 },
        { date: '2024-01-20', value: 142 },
        { date: '2024-03-14', value: 138 }
      ],
      diastolicBP: [
        { date: '2023-11-01', value: 85 },
        { date: '2023-12-15', value: 88 },
        { date: '2024-01-20', value: 92 },
        { date: '2024-03-14', value: 90 }
      ],
      sleepHours: [
        { date: '2023-11-01', value: 4 },
        { date: '2023-12-15', value: 5 },
        { date: '2024-01-20', value: 6.5 },
        { date: '2024-03-14', value: 7 }
      ],
      vitaminD: [
        { date: '2023-11-01', value: 12 },
        { date: '2024-01-20', value: 24 },
        { date: '2024-03-14', value: 31 }
      ],
      vitaminB12: [
        { date: '2023-11-01', value: 180 },
        { date: '2024-01-20', value: 280 },
        { date: '2024-03-14', value: 350 }
      ],
      hbA1c: [
        { date: '2023-11-01', value: 6.8 },
        { date: '2024-03-14', value: 6.4 }
      ]
    }
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    patientId: 'p1',
    date: '2023-11-01',
    clinicianName: 'Dr. Aditi Rao',
    notes: 'Initial evaluation. Patient reports pervasive low mood and fatigue.',
    symptoms: ['Insomnia', 'Low mood', 'Anhedonia'],
    status: 'unknown',
    assessments: [
      { type: 'PHQ-9', score: 18, date: '2023-11-01', responses: {} },
      { type: 'GAD-7', score: 12, date: '2023-11-01', responses: {} }
    ],
    vitals: [
      { name: 'Vitamin B12', value: 180, unit: 'pg/mL', status: 'low' },
      { name: 'Vitamin D', value: 12, unit: 'ng/mL', status: 'low' }
    ]
  },
  {
    id: 's2',
    patientId: 'p1',
    date: '2023-12-15',
    clinicianName: 'Dr. Aditi Rao',
    notes: 'Started supplementation. Mood remains low but energy is slightly better.',
    symptoms: ['Low mood', 'Better energy'],
    status: 'improving',
    assessments: [
      { type: 'PHQ-9', score: 14, date: '2023-12-15', responses: {} },
      { type: 'GAD-7', score: 9, date: '2023-12-15', responses: {} }
    ]
  }
];

export const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 'c1',
    name: 'Dr. Vikram Malhotra',
    role: 'Psychiatrist',
    specialization: 'Adult ADHD & Addiction',
    hospital: 'Fortis Memorial, Gurugram',
    contact: 'v.malhotra@fortis.in',
    cases: [
      { patientName: 'Sohan Patel', diagnosis: 'Adult ADHD', status: 'Stable' },
      { patientName: 'Meera Iyer', diagnosis: 'Bipolar II Disorder', status: 'Critical' }
    ]
  }
];
