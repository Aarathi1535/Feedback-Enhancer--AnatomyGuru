
import React, { useState } from 'react';
import { generateStructuredFeedback } from './services/geminiService';
import { EvaluationReport, FileData } from './types';
import FileUploader from './components/FileUploader';
import FeedbackReport from './components/FeedbackReport';
// @ts-ignore
import mammoth from 'mammoth';

const App: React.FC = () => {
  const [sourceDoc, setSourceDoc] = useState<File | null>(null);
  const [dirtyFeedbackDoc, setDirtyFeedbackDoc] = useState<File | null>(null);
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File): Promise<FileData> => {
    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (isDocx) {
      // Extract text for Word docs
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return {
        text: result.value,
        name: file.name,
        isDocx: true
      };
    } else {
      // Base64 for PDF/Images
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
      });
      return {
        base64,
        mimeType: file.type,
        name: file.name,
        isDocx: false
      };
    }
  };

  const handleAnalyze = async () => {
    if (!sourceDoc || !dirtyFeedbackDoc) {
      setError("Please upload both documents before proceeding.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sourceData = await processFile(sourceDoc);
      const feedbackData = await processFile(dirtyFeedbackDoc);

      const result = await generateStructuredFeedback(sourceData, feedbackData);
      setReport(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. If you're using Word docs, try converting to PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">A</div>
            <span className="brand-font text-xl font-bold tracking-tight">AnatomyGuru Eval</span>
          </div>
          {report && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const content = `Evaluation Report: ${report.studentName}\nScore: ${report.totalScore}/${report.maxScore}\n\nQuestions:\n` + 
                    report.questions.map(q => `${q.qNo}: ${q.feedback} (${q.marks}/${q.maxMarks})`).join('\n') +
                    `\n\nOverall Performance: ${report.generalFeedback.overallPerformance}`;
                  navigator.clipboard.writeText(content);
                  alert("Report copied! You can now paste it directly into MS Word.");
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors flex items-center gap-2"
              >
                Copy for Word
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Download PDF
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {!report ? (
          <div className="max-w-3xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Feedback Streamlining</h1>
              <p className="text-lg text-slate-600">Upload PDF or MS Word documents to generate professional reports.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <FileUploader
                label="Source Document"
                description="QP + Key + Student Answers (PDF/Docx/Img)"
                onFileSelect={setSourceDoc}
                selectedFile={sourceDoc}
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
              />
              <FileUploader
                label="Dirty Feedback"
                description="Manual Feedback & Marks (PDF/Docx/Img)"
                onFileSelect={setDirtyFeedbackDoc}
                selectedFile={dirtyFeedbackDoc}
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !sourceDoc || !dirtyFeedbackDoc}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing Documents...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Analyze & Generate
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 left-0 no-print mb-8">
              <button 
                onClick={() => setReport(null)}
                className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back
              </button>
            </div>
            <FeedbackReport report={report} />
          </div>
        )}
      </main>

      <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none no-print">
        <svg width="400" height="400" viewBox="0 0 400 400"><path d="M100,50 Q150,0 200,50 T300,50" stroke="black" fill="none" /></svg>
      </div>
    </div>
  );
};

export default App;
