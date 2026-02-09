
import React from 'react';
import { Patient } from '../types';
import { Search, Plus, User, MoreVertical, Calendar, UserCheck } from 'lucide-react';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddNew: () => void;
  dataSource?: 'supabase' | 'mock' | null;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient, onAddNew, dataSource }) => {
  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Patient Directory</h1>
          <p className="text-slate-500 mt-1">Manage and track psychological history across sessions.</p>
          {dataSource && (
            <p className="text-slate-400 text-xs mt-1">
              {dataSource === 'supabase' ? `Loaded from Supabase (${patients.length} patients)` : 'Using demo data — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel to connect.'}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search patients by name, ID or diagnosis..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-600 font-bold text-xs uppercase tracking-widest">
          <option>All Statuses</option>
          <option>In Progress</option>
          <option>Under Treatment</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <div 
            key={patient.id} 
            onClick={() => onSelectPatient(patient)}
            className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow hover:border-indigo-300 hover:shadow-lg transition cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition">
                <User className="w-6 h-6 text-indigo-600 group-hover:text-white transition" />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                patient.clinicalStatus === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
                patient.clinicalStatus === 'Under Treatment' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
              }`}>
                {patient.clinicalStatus || 'Pending'}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1">{patient.name}</h3>
            <p className="text-sm text-slate-500 mb-4 truncate">{patient.diagnosis || patient.chiefComplaint || 'Diagnosis Pending'}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-50 space-y-3">
              <div className="flex items-center text-xs text-slate-600 font-bold">
                 <UserCheck className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                 <span className="text-slate-400 font-medium mr-1 uppercase text-[9px]">Assigned:</span> {patient.assignedDoctor || 'Unassigned'}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined</span>
                  <p className="text-xs text-slate-700 font-bold flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" /> {patient.joinedAt}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visit Type</span>
                  <p className="text-xs text-slate-700 font-bold flex items-center mt-1">
                    {patient.visitType || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
