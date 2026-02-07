
import React from 'react';
import { EvaluationReport } from '../types';

interface FeedbackReportProps {
  report: EvaluationReport;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ report }) => {
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="p-8 bg-slate-900 text-white flex justify-between items-start">
        <div>
          <h1 className="brand-font text-3xl font-bold tracking-tight">ANATOMY GURU</h1>
          <p className="italic text-slate-400 text-sm">Nothing Left Undissected!!</p>
          <div className="mt-6 space-y-1">
            <h2 className="text-xl font-semibold text-blue-400">{report.testTitle || 'Medical Evaluation'}</h2>
            <p className="text-sm opacity-80">Date: {report.testDate || new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-blue-600 px-4 py-2 rounded-lg inline-block shadow-lg">
            <span className="text-xs uppercase tracking-widest font-bold block opacity-75">Score</span>
            <span className="text-3xl font-bold">{report.totalScore}/{report.maxScore}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest font-bold opacity-60">Student Name</p>
            <p className="text-lg font-semibold">{report.studentName}</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                <th className="px-6 py-4 w-16">Q No</th>
                <th className="px-6 py-4">Feedback</th>
                <th className="px-6 py-4 text-right w-24">Marks</th>
              </tr>
            </thead>
            <tbody>
              {report.questions.map((q, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{q.qNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${q.isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <p className={`font-medium ${q.isCorrect ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {q.feedback}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-600">
                    {q.marks}/{q.maxMarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Marks Row Mobile-style */}
        <div className="flex justify-between items-center py-6 px-6 bg-slate-50 border-t-2 border-slate-200 mt-4 rounded-xl">
          <span className="text-lg font-bold text-slate-800">Total Marks</span>
          <span className="text-2xl font-black text-red-600">{report.totalScore}/{report.maxScore}</span>
        </div>

        {/* General Feedback Sections */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-red-100 pb-2">General Feedback</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs uppercase tracking-widest font-black text-red-600 mb-3">1) Overall Performance</h3>
              <p className="text-slate-700 leading-relaxed font-medium">{report.generalFeedback.overallPerformance}</p>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs uppercase tracking-widest font-black text-red-600 mb-3">2) MCQs</h3>
              <p className="text-slate-700 leading-relaxed font-medium">{report.generalFeedback.mcqs}</p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeedbackList title="3) Content Accuracy" items={report.generalFeedback.contentAccuracy} />
            <FeedbackList title="4) Completeness of Answers" items={report.generalFeedback.completeness} />
            <FeedbackList title="5) Presentation & Diagrams" items={report.generalFeedback.presentation} />
            <FeedbackList title="6) Investigations" items={report.generalFeedback.investigations} />
          </div>

          <section className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
            <h3 className="text-xs uppercase tracking-widest font-black text-red-600 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              What to do next (Action points)
            </h3>
            <ul className="space-y-3">
              {report.generalFeedback.actionPoints.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center text-slate-400 italic text-sm">
          <p>“Discipline beats motivation every day.”</p>
          <p className="mt-2 font-bold text-slate-600">ALL THE BEST ☺</p>
        </div>
      </div>
    </div>
  );
};

const FeedbackList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="text-xs uppercase tracking-widest font-black text-red-600 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2 text-slate-700 text-sm">
          <span className="text-slate-300">•</span>
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default FeedbackReport;
