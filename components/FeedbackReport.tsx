
import React from 'react';
import { EvaluationReport } from '../types';

interface FeedbackReportProps {
  report: EvaluationReport;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ report }) => {
  const audit = report.summationAudit;

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden border border-slate-100 report-container">
      {/* Header */}
      <div className="relative p-10 bg-slate-900 text-white">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200">
             <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" fill="none" />
             <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-[10px] font-black px-2 py-0.5 rounded tracking-[0.2em] uppercase">Official</span>
            </div>
            <h1 className="brand-font text-4xl font-black tracking-tight mb-1">ANATOMY GURU</h1>
            <p className="italic text-slate-400 text-sm tracking-wide">Nothing Left Undissected!!</p>
            
            <div className="mt-10 pt-6 border-t border-white/10">
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Examination Title</h2>
              <p className="text-2xl font-semibold">{report.testTitle || 'Structured Medical Assessment'}</p>
              <p className="text-xs text-slate-400 mt-2 font-mono uppercase">Reference Date: {report.testDate || new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-1 rounded-2xl shadow-xl mb-4">
              <div className="bg-slate-900 px-6 py-4 rounded-[calc(1rem-2px)] text-center min-w-[140px]">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black block text-blue-400 mb-1">Faculty's Stated Total</span>
                <span className="text-4xl font-black">
                  {report.totalScore}<span className="text-slate-500 text-xl mx-0.5">/</span>{report.maxScore}
                </span>
                <div className="h-1 w-full bg-slate-800 mt-3 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(report.totalScore / report.maxScore) * 100}%` }} 
                   />
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Student Credentials</p>
              <p className="text-xl font-bold border-b-2 border-red-500/50 pb-1">{report.studentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Detailed Itemized Evaluation</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-100 mb-6">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <th className="px-8 py-5 w-24">Item #</th>
                <th className="px-8 py-5">Evaluator Feedback & Improvement Strategy</th>
                <th className="px-8 py-5 text-right w-32">Weightage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.questions.map((q, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{q.qNo}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${q.isCorrect ? 'bg-emerald-400 ring-4 ring-emerald-50' : 'bg-red-400 ring-4 ring-red-50'}`} />
                      <div>
                        <p className={`font-semibold leading-relaxed ${q.isCorrect ? 'text-emerald-800' : 'text-slate-800'}`}>
                          {q.feedback}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="inline-block px-3 py-1 bg-slate-100 rounded-md font-mono font-bold text-slate-600">
                      {q.marks}/{q.maxMarks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summation Audit Section */}
        <section className={`mb-10 p-6 rounded-2xl border-2 transition-all ${audit.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-200'}`}>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${audit.isCorrect ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                  {audit.isCorrect ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  )}
                </div>
                <div>
                  <h4 className={`text-[10px] uppercase font-black tracking-[0.2em] ${audit.isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>Summation Audit & Calculation Check</h4>
                  <p className={`font-bold text-lg ${audit.isCorrect ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {audit.isCorrect ? 'Mathematical Validation Passed' : 'Discrepancy Detected in Manual Totalling'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                 <div className="px-4 py-2 bg-white/50 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Stated</span>
                    <span className="text-xl font-black text-slate-700">{audit.manualTotal}</span>
                 </div>
                 <div className="px-4 py-2 bg-white/50 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Calculated</span>
                    <span className="text-xl font-black text-blue-600">{audit.calculatedTotal}</span>
                 </div>
              </div>
           </div>
           {!audit.isCorrect && (
             <div className="mt-4 pt-4 border-t border-amber-200">
               <p className="text-sm text-amber-800 font-medium italic">
                 Note: Individual question marks sum to {audit.calculatedTotal}, but the faculty has stated a total of {audit.manualTotal}. {audit.discrepancyMessage || 'Please verify the final scorecard.'}
               </p>
             </div>
           )}
        </section>

        {/* Global Competency Metrics */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Global Competency Feedback</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <section className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">01. Overall Performance</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium text-lg italic">"{report.generalFeedback.overallPerformance}"</p>
            </section>

            <section className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                </div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">02. MCQ Competency</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">{report.generalFeedback.mcqs}</p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeedbackList title="03. Content Accuracy" items={report.generalFeedback.contentAccuracy} color="blue" />
            <FeedbackList title="04. Scope & Completeness" items={report.generalFeedback.completeness} color="emerald" />
            <FeedbackList title="05. Visual Presentation" items={report.generalFeedback.presentation} color="indigo" />
            <FeedbackList title="06. Clinical Investigations" items={report.generalFeedback.investigations} color="rose" />
          </div>

          <section className="mt-12 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <svg width="150" height="150" fill="white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-blue-400"></span>
              Strategic Action Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.generalFeedback.actionPoints.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start text-white/90">
                  <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 text-center">
          <div className="inline-block p-1 bg-slate-50 rounded-full mb-4">
             <div className="px-6 py-2 bg-white rounded-full text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] shadow-sm">
                Generated via AnatomyGuru AI Evaluate v3.5
             </div>
          </div>
          <p className="italic text-slate-500 text-sm">“Discipline beats motivation every day.”</p>
          <p className="mt-2 font-black text-slate-900 tracking-tighter uppercase">ALL THE BEST ☺</p>
        </div>
      </div>
    </div>
  );
};

const FeedbackList: React.FC<{ title: string; items: string[]; color: string }> = ({ title, items, color }) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100'
  };

  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-5 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${colorMap[color].split(' ')[0]}`}></span>
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-slate-700 text-sm group">
            <span className="text-slate-200 group-hover:text-blue-400 transition-colors">•</span>
            <span className="font-medium leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeedbackReport;
