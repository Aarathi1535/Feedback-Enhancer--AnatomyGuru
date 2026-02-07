
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationReport, FileData } from "../types";

export const generateStructuredFeedback = async (
  sourceDoc: FileData,
  dirtyFeedbackDoc: FileData
): Promise<EvaluationReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a world-class Medical Evaluator for Anatomy Guru. 
    You will be provided with two sets of documents:
    1. Source Document: Contains Question Paper, Answer Key, and Student's Handwritten Answers.
    2. Dirty Feedback Document: Contains messy, informal, manual teacher feedback and marks.

    Your Goal:
    - Deeply study the student's handwritten answers and compare them with the Answer Key.
    - Read and interpret the "Dirty Feedback" (manual notes) and align it with the actual student answers.
    - Generate a professional, structured evaluation report.
    - For EVERY question: Provide a 1-2 line feedback for improvement if marks are lost. If full marks are given, state "Correct Answer."
    - Ensure question numbers (Q No) match precisely.
    - Calculate the total score carefully (sum of marks obtained / sum of max marks).
    - Provide a "General Feedback" section similar to the provided sample, divided into: Overall Performance, MCQs, Content Accuracy, Completeness of Answers, Presentation & Diagrams, Investigations, and Action Points.

    FORMATTING RULES:
    - Return ONLY valid JSON.
    - Be professional, encouraging, but academically rigorous.
  `;

  // Helper to create the correct part based on file type
  const createPart = (data: FileData, label: string) => {
    if (data.isDocx && data.text) {
      return [
        { text: `${label}: (Extracted from Word Document)` },
        { text: data.text }
      ];
    } else if (data.base64 && data.mimeType) {
      return [
        { text: `${label}: (Binary File)` },
        { inlineData: { data: data.base64, mimeType: data.mimeType } }
      ];
    }
    return [{ text: `${label}: No data available.` }];
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          ...createPart(sourceDoc, "Source Document (QP + Key + Student Answers)"),
          ...createPart(dirtyFeedbackDoc, "Dirty Feedback Document (Manual Notes)"),
          { text: "Please process these and return the evaluation report in JSON format." }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          studentName: { type: Type.STRING },
          testTitle: { type: Type.STRING },
          testDate: { type: Type.STRING },
          totalScore: { type: Type.NUMBER },
          maxScore: { type: Type.NUMBER },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                qNo: { type: Type.STRING },
                feedback: { type: Type.STRING },
                marks: { type: Type.NUMBER },
                maxMarks: { type: Type.NUMBER },
                isCorrect: { type: Type.BOOLEAN }
              },
              required: ["qNo", "feedback", "marks", "maxMarks", "isCorrect"]
            }
          },
          generalFeedback: {
            type: Type.OBJECT,
            properties: {
              overallPerformance: { type: Type.STRING },
              mcqs: { type: Type.STRING },
              contentAccuracy: { type: Type.ARRAY, items: { type: Type.STRING } },
              completeness: { type: Type.ARRAY, items: { type: Type.STRING } },
              presentation: { type: Type.ARRAY, items: { type: Type.STRING } },
              investigations: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["overallPerformance", "mcqs", "contentAccuracy", "completeness", "presentation", "investigations", "actionPoints"]
          }
        },
        required: ["studentName", "testTitle", "totalScore", "maxScore", "questions", "generalFeedback"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as EvaluationReport;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not generate structured feedback. Please try again with clearer documents.");
  }
};
