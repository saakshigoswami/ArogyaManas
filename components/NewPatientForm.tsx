
import React, { useState } from 'react';
import { Patient, ScannedPrescription } from '../types';
import { DOCTORS } from '../constants';
import { abhaService } from '../services/abhaService';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Stethoscope, 
  ChevronLeft, 
  Save, 
  X,
  FileText,
  Clock,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export interface InitialFromScan {
  patientName?: string;
  diagnosis?: string;
  chiefComplaint?: string;
  receptionNotes?: string;
  scannedPrescription?: ScannedPrescription;
}

interface NewPatientFormProps {
  onSave: (patient: Patient) => void;
  onCancel: () => void;
  initialFromScan?: InitialFromScan;
}

function getInitialFormData(initialFromScan?: InitialFromScan) {
  const nameParts = initialFromScan?.patientName?.trim()?.split(/\s+/) ?? [];
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') ?? '';
  return {
    firstName,
    lastName,
    dob: '',
    gender: 'Female' as const,
    phone: '',
    email: '',
    abhaNumber: '',
    abhaAddress: '',
    visitType: 'New Consultation' as 'New Consultation' | 'Follow-up' | 'Emergency',
    chiefComplaint: initialFromScan?.chiefComplaint ?? '',
    assignedDoctor: DOCTORS[0],
    receptionNotes: initialFromScan?.receptionNotes ?? '',
  };
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSave, onCancel, initialFromScan }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(initialFromScan));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const abha = abhaService.toAbhaInfo(formData.abhaNumber, formData.abhaAddress);
    const newPatient: Patient = {
      id: `p${Math.floor(Math.random() * 1000)}`,
      name: `${formData.firstName} ${formData.lastName}`.trim() || 'Unknown',
      dob: formData.dob,
      gender: formData.gender,
      contact: formData.phone,
      joinedAt: new Date().toISOString().split('T')[0],
      abha,
      diagnosis: initialFromScan?.diagnosis,
      clinicalStatus: 'In Progress',
      visitType: formData.visitType,
      chiefComplaint: formData.chiefComplaint,
      assignedDoctor: formData.assignedDoctor,
      receptionNotes: formData.receptionNotes,
      prescriptions: initialFromScan?.scannedPrescription ? [initialFromScan.scannedPrescription] : undefined,
      clinicalJourney: initialFromScan?.scannedPrescription ? [{
        date: initialFromScan.scannedPrescription.date,
        facility: initialFromScan.scannedPrescription.hospitalName ?? 'External',
        clinician: initialFromScan.scannedPrescription.doctorName ?? '',
        reasonForVisit: initialFromScan.scannedPrescription.diagnosis ?? 'From scanned record',
        prescribedMedications: initialFromScan.scannedPrescription.items.map(i => `${i.name} ${i.dosage}`),
      }] : undefined,
    };
    onSave(newPatient);
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-slate-800 font-medium";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Patient Intake – General Details</h1>
            <p className="text-slate-500">
              {initialFromScan?.scannedPrescription
                ? 'Details pre-filled from scanned record. Fill any empty fields (e.g. name, DOB, contact) and register.'
                : 'New arrivals processed by reception for clinical assignment.'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="flex items-center px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-bold"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex items-center px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Register Patient
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Basic Identity */}
        <div className="bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center">
            <User className="w-4 h-4 text-indigo-600 mr-2" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Basic Identity</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>First Name</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                placeholder="First Name"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Last Name</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                placeholder="Last Name"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Date of Birth</label>
              <input 
                required
                type="date" 
                className={inputClasses}
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Gender</label>
              <select 
                className={inputClasses}
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Phone Number</label>
              <input 
                required
                type="tel" 
                className={inputClasses}
                placeholder="+91"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Email (Optional)</label>
              <input 
                type="email" 
                className={inputClasses}
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section: ABHA (Ayushman Bharat Health Account) */}
        <div className="bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center">
            <ShieldCheck className="w-4 h-4 text-indigo-600 mr-2" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">ABHA (Health ID) – Optional</h3>
          </div>
          <div className="p-8 space-y-4">
            <p className="text-xs text-slate-500 mb-4">
              Link this patient to their Ayushman Bharat Health Account for ABDM-compliant record linking. You can enter details manually or use Scan QR / Verify with OTP when your facility is connected to ABDM.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>ABHA Number (14 digits)</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  maxLength={18}
                  className={inputClasses}
                  placeholder="e.g. 12345678901234"
                  value={formData.abhaNumber}
                  onChange={e => setFormData({ ...formData, abhaNumber: abhaService.normalizeAbhaNumber(e.target.value) })}
                />
                {formData.abhaNumber && !abhaService.isValidAbhaNumber(formData.abhaNumber) && (
                  <p className="text-[10px] text-amber-600 mt-1 ml-1">Enter 14 digits</p>
                )}
              </div>
              <div>
                <label className={labelClasses}>ABHA Address</label>
                <input 
                  type="text" 
                  className={inputClasses}
                  placeholder="e.g. user@abdm"
                  value={formData.abhaAddress}
                  onChange={e => setFormData({ ...formData, abhaAddress: e.target.value })}
                />
                {formData.abhaAddress && !abhaService.isValidAbhaAddress(formData.abhaAddress) && (
                  <p className="text-[10px] text-amber-600 mt-1 ml-1">Format: name@abdm</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Visit Context */}
        <div className="bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center">
            <Clock className="w-4 h-4 text-indigo-600 mr-2" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Visit Context</h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className={labelClasses}>Visit Type</label>
              <div className="grid grid-cols-3 gap-4">
                {['New Consultation', 'Follow-up', 'Emergency'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, visitType: type as any})}
                    className={`py-3 rounded-xl text-xs font-bold transition border-2 ${
                      formData.visitType === type 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClasses}>Chief Complaint</label>
              <textarea 
                required
                className={`${inputClasses} h-24 resize-none`}
                placeholder="Primary reason for visit..."
                value={formData.chiefComplaint}
                onChange={e => setFormData({...formData, chiefComplaint: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section: Administrative */}
        <div className="bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center">
            <UserCheck className="w-4 h-4 text-indigo-600 mr-2" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Administrative</h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className={labelClasses}>Assigned Doctor</label>
              <select 
                className={inputClasses}
                value={formData.assignedDoctor}
                onChange={e => setFormData({...formData, assignedDoctor: e.target.value})}
              >
                {DOCTORS.map(doc => <option key={doc} value={doc}>{doc}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Receptionist Notes for Doctor (Optional)</label>
              <textarea 
                className={`${inputClasses} h-24 resize-none`}
                placeholder="Add any administrative context..."
                value={formData.receptionNotes}
                onChange={e => setFormData({...formData, receptionNotes: e.target.value})}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPatientForm;
