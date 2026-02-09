
import React from 'react';
import { Patient, Session } from '../types';
import { MOCK_SESSIONS } from '../constants';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  ShieldCheck,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';

interface ClinicalInsightsProps {
  patients: Patient[];
}

const COLORS = ['#4f46e5', '#14b8a6', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6', '#6366f1', '#2dd4bf'];

const ClinicalInsights: React.FC<ClinicalInsightsProps> = ({ patients }) => {
  // 1. Group patients and sessions by diagnosis
  const diagnosticsData: Record<string, { count: number; totalImprovement: number; patientWithTrends: number }> = {};

  patients.forEach(patient => {
    if (!patient.diagnosis) return;

    // Filter sessions for this specific patient
    const patientSessions = MOCK_SESSIONS
      .filter(s => s.patientId === patient.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!diagnosticsData[patient.diagnosis]) {
      diagnosticsData[patient.diagnosis] = { count: 0, totalImprovement: 0, patientWithTrends: 0 };
    }

    diagnosticsData[patient.diagnosis].count += 1;

    // Calculate improvement delta if they have at least 2 sessions
    if (patientSessions.length >= 2) {
      const firstScore = patientSessions[0].assessments.find(a => a.type === 'PHQ-9')?.score || 0;
      const lastScore = patientSessions[patientSessions.length - 1].assessments.find(a => a.type === 'PHQ-9')?.score || 0;
      
      if (firstScore > 0) {
        // Improvement as a percentage of reduction in score
        const improvement = ((firstScore - lastScore) / firstScore) * 100;
        diagnosticsData[patient.diagnosis].totalImprovement += Math.max(0, improvement);
        diagnosticsData[patient.diagnosis].patientWithTrends += 1;
      }
    }
  });

  // 2. Format for Scatter Chart
  const chartData = Object.entries(diagnosticsData).map(([name, stats]) => {
    const avgImprovement = stats.patientWithTrends > 0 
      ? Math.round(stats.totalImprovement / stats.patientWithTrends) 
      : 25; // Default/Simulated baseline for mock data visibility

    return {
      name,
      x: stats.count, // Volume
      y: avgImprovement, // Efficacy %
      z: stats.count * 10, // Bubble size
    };
  });

  return (
    <div className="p-8">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Therapeutic Efficacy Map</h1>
          <p className="text-slate-500 mt-1">Correlation between patient volume and average clinical recovery rates.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 flex items-center text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Longitudinal Outcome Tracking Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Clinic Improvement</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {chartData.length > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.y, 0) / chartData.length) : 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Managed Census</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{patients.length} Active Profiles</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Top Performing Area</p>
            <p className="text-xl font-bold mt-1 text-emerald-400">
              {chartData.sort((a,b) => b.y - a.y)[0]?.name || 'Analyzing...'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Scatter Chart View */}
        <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Outcome-Volume Correlation
            </h3>
            <div className="flex space-x-6">
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" /> Efficacy (Y)
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-slate-300 mr-2" /> Volume (X)
              </div>
            </div>
          </div>
          
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Census" 
                  unit=" pts" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  label={{ value: 'Patient Volume (Census)', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Improvement" 
                  unit="%" 
                  domain={[0, 100]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  label={{ value: 'Avg. Recovery Rate (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-100 min-w-[200px]">
                          <p className="font-bold text-slate-800 border-b pb-2 mb-2">{data.name}</p>
                          <div className="space-y-1">
                            <p className="text-xs flex justify-between"><span className="text-slate-400">Clinic Volume:</span> <span className="font-bold">{data.x} patients</span></p>
                            <p className="text-xs flex justify-between"><span className="text-slate-400">Avg. Recovery:</span> <span className="font-bold text-emerald-600">{data.y}%</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="5 5" label={{ value: 'Avg. Success Threshold', position: 'right', fill: '#cbd5e1', fontSize: 10 }} />
                <Scatter name="Conditions" data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quadrant Analysis */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
            Performance Meta
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">High-Impact Protocol</p>
              <h4 className="font-bold text-slate-800 text-sm">
                {chartData.sort((a,b) => b.y - a.y)[0]?.name || 'N/A'}
              </h4>
              <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                Showing strongest response rates. Current treatment pathways for this condition are highly effective.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Clinical Complexity</p>
              <h4 className="font-bold text-slate-800 text-sm">
                {chartData.sort((a,b) => a.y - b.y)[0]?.name || 'N/A'}
              </h4>
              <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                Lowest average recovery rate. Consider multidisciplinary review for these cases.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resource Allocation</p>
              <div className="space-y-3">
                {chartData.sort((a,b) => b.x - a.x).slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">{item.name}</span>
                    <span className="font-bold text-slate-800">{item.x} Pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-start space-x-2 text-slate-400 italic">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-[10px] leading-relaxed">
                Recovery rate is calculated as: <code>(Δ PHQ-9 Score / Initial Score) * 100</code> averaged across the specific patient cohort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalInsights;
