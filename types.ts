
export interface QuestionFeedback {
  qNo: string;
  feedback: string[]; // Changed to array for bullet points
  marks: number;
  maxMarks: number;
}

export interface GeneralFeedbackSection {
  overallPerformance: string;
  mcqs: string;
  contentAccuracy: string[];
  completeness: string[];
  presentation: string[];
  investigations: string[];
  actionPoints: string[];
}

export interface EvaluationReport {
  studentName: string;
  testTitle: string;
  testDate: string;
  totalScore: number;
  maxScore: number;
  questions: QuestionFeedback[];
  generalFeedback: GeneralFeedbackSection;
}

export interface FileData {
  base64?: string;
  mimeType?: string;
  text?: string;
  name: string;
  isDocx: boolean;
}
