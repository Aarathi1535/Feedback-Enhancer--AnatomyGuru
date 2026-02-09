
import React from 'react';
import { EvaluationReport } from '../types';

interface FeedbackReportProps {
  report: EvaluationReport;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ report }) => {
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-none sm:shadow-sm border-0 sm:border border-slate-200 p-4 sm:p-12 print-container">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2">
           <img src="https://anatomyguru.in/wp-content/uploads/2021/04/Anatomy-Guru-Logo.png" alt="Anatomy Guru" className="h-20 object-contain" onError={(e) => {
             e.currentTarget.style.display = 'none';
           }} />
           {!document.querySelector('img[alt="Anatomy Guru"]') && (
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-slate-800">ANATOMY GURU<sup>®</sup></h1>
                <p className="text-xs italic text-slate-600 border-t border-slate-300 mt-1 pt-1">Nothing Left Undissected !!</p>
              </div>
           )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-red-600 font-bold text-lg underline uppercase">{report.testTitle || 'General Medicine Test'}</h2>
          <p className="text-xs font-bold text-slate-800 mt-1 italic">
            Topics: {report.generalFeedback.mcqs || 'Clinical Correlation & Management'}
          </p>
          <p className="text-blue-700 font-bold text-sm mt-1">Date: {report.testDate}</p>
        </div>
      </div>

      {/* Student Info Bar */}
      <div className="border border-slate-300 p-2 mb-0 bg-white">
        <p className="text-red-600 font-bold text-sm">Student Name: <span className="text-slate-900 font-black">{report.studentName}</span></p>
      </div>

      {/* Main Table - Matching Image exactly */}
      <table className="w-full border-collapse border border-slate-400 text-xs">
        <thead>
          <tr className="text-red-600 font-bold">
            <th className="border border-slate-400 p-2 w-16 text-center">Q No</th>
            <th className="border border-slate-400 p-2 text-center">Feedback</th>
            <th className="border border-slate-400 p-2 w-20 text-center">Marks</th>
          </tr>
        </thead>
        <tbody>
          {report.questions.map((q, idx) => (
            <tr key={idx}>
              <td className="border border-slate-400 p-2 text-center font-bold align-top">{q.qNo}</td>
              <td className="border border-slate-400 p-3 align-top">
                <ul className="list-disc pl-4 space-y-1">
                  {q.feedback.map((item, fIdx) => (
                    <li key={fIdx} className="text-slate-800 font-medium leading-relaxed">{item}</li>
                  ))}
                </ul>
              </td>
              <td className="border border-slate-400 p-2 text-center font-bold align-top">
                {q.marks}
              </td>
            </tr>
          ))}
          {/* Total Row */}
          <tr className="font-black bg-slate-50">
             <td colSpan={2} className="border border-slate-400 p-2 text-right uppercase tracking-wider">Aggregate Performance Score</td>
             <td className="border border-slate-400 p-2 text-center text-blue-700 text-sm">
                {report.totalScore} / {report.maxScore}
             </td>
          </tr>
        </tbody>
      </table>

      {/* Page Footer for Print */}
      <div className="flex justify-between items-center mt-4 text-[10px] text-slate-400 font-bold uppercase no-print">
        <span>Academic Integrity Verified</span>
        <span>Page 1 of 1</span>
      </div>

      {/* Professional General Feedback - Styled as per Medical Report */}
      <div className="mt-12 space-y-8 no-print-sections">
        <div className="border-l-4 border-red-600 pl-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">01. Clinical Synthesis</h3>
           <p className="text-sm font-medium italic text-slate-700 leading-relaxed">"{report.generalFeedback.overallPerformance}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <FeedbackGroup title="Clinical Investigations" items={report.generalFeedback.investigations} />
           <FeedbackGroup title="Scope & Completeness" items={report.generalFeedback.completeness} />
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl">
           <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-4">Strategic Action Points</h3>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {report.generalFeedback.actionPoints.map((item, idx) => (
               <li key={idx} className="flex gap-3 text-sm font-medium opacity-90">
                 <span className="text-red-500 font-black">0{idx+1}.</span> {item}
               </li>
             ))}
           </ul>
        </div>
      </div>

      <div className="mt-12 text-center pt-8 border-t border-slate-100">
        <p className="text-xs font-black text-slate-900 tracking-[0.3em]">ALL THE BEST ☺</p>
      </div>
    </div>
  );
};

const FeedbackGroup: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="text-xs font-bold text-slate-600 flex gap-2">
          <span className="text-red-400">•</span> {item}
        </li>
      ))}
    </ul>
  </div>
);

export default FeedbackReport;
