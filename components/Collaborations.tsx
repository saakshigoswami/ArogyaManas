
import React, { useState } from 'react';
import { MOCK_COLLABORATORS } from '../constants';
import { Search, UserPlus, Mail, Building2, ChevronRight, Briefcase, Filter } from 'lucide-react';
import { Collaborator } from '../types';

const Collaborations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollaborators = MOCK_COLLABORATORS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Team Distribution</h1>
          <p className="text-slate-500 mt-1">Coordinate with collaborating psychiatrists and psychologists.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm">
          <UserPlus className="w-5 h-5 mr-2" />
          Connect Professional
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, hospital, or specialization..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCollaborators.map((collaborator) => (
          <div key={collaborator.id} className="bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden group hover:border-indigo-300 transition-all duration-300">
            {/* Collaborator Header */}
            <div className="p-6 border-b border-slate-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{collaborator.name}</h3>
                    <p className="text-sm font-semibold text-indigo-600">{collaborator.role}</p>
                    <div className="flex items-center mt-1 text-slate-500 text-xs">
                      <Building2 className="w-3 h-3 mr-1" /> {collaborator.hospital}
                    </div>
                  </div>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content: Specialization and Cases */}
            <div className="p-6">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Core Specialization</span>
                <p className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 italic">
                  "{collaborator.specialization}"
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Shared/Observed Cases</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{collaborator.cases.length} Total</span>
                </div>
                <div className="space-y-3">
                  {collaborator.cases.map((patientCase, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-3">
                          <Briefcase className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{patientCase.patientName}</p>
                          <p className="text-[10px] text-slate-500">{patientCase.diagnosis}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          patientCase.status === 'Critical' ? 'bg-rose-50 text-rose-600' :
                          patientCase.status === 'Improving' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {patientCase.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 italic">Last case update: Today, 2:30 PM</span>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Request Consultation</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collaborations;
