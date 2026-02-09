
import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { sourceDoc, dirtyFeedbackDoc } = JSON.parse(event.body);

    if (!process.env.API_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "API Key not configured in environment." }) 
      };
    }

    // Using gemini-3-pro-preview for handling 100+ marks papers and deep reasoning
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are a Senior Clinical Evaluator at Anatomy Guru. Your task is to process medical examination papers with EXTREME precision.

      DOCUMENTS PROVIDED:
      1. Source: Question Paper + Master Key + Student's Handwritten/Typed Answers.
      2. Evaluator Notes: Messy marks and brief human feedback.

      CRITICAL OBJECTIVES:
      - ANALYSIS: Do NOT provide generic feedback. Compare the student's answer DIRECTLY to the Master Key. Identify specific missing medical terms, diagnostic criteria (e.g., Ranson's, Atlanta classification), or management steps (e.g., IV fluids, specific antibiotics).
      - FORMAT: Return feedback for EACH question as an array of concise bullet points (strings). Focus on: Correctness, Gaps, and Improvement steps.
      - INTERNAL AUDIT: Calculate the sum of all individual marks. Compare this to the 'totalScore' provided by the human evaluator. If there is a math error in the evaluator's total, use the CORRECTED total for the final report's 'totalScore' field, but ensure individual marks reflect the student's actual performance.
      - SCALABILITY: You are processing a high-stakes exam. Be thorough even for long papers (100+ marks).

      FEEDBACK STYLE (Match Provided Reference):
      - "Include definition and pathology."
      - "Mention Atlanta classification and Ranson's score."
      - "Improve evaluation: write RFT, USG abdomen, urine routine."
    `;

    const createPart = (data: any, label: string) => {
      if (data.isDocx && data.text) {
        return [
          { text: `${label}: (Extracted Text Content)\n${data.text}` }
        ];
      } else if (data.base64 && data.mimeType) {
        return [
          { text: `${label}: (Visual Data Attached)` },
          { inlineData: { data: data.base64, mimeType: data.mimeType } }
        ];
      }
      return [{ text: `${label}: No data available.` }];
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Upgraded to Pro for larger/repeated use reliability
      contents: [
        {
          parts: [
            ...createPart(sourceDoc, "MASTER_DATA"),
            ...createPart(dirtyFeedbackDoc, "HUMAN_EVALUATOR_NOTES"),
            { text: "Generate the itemized professional evaluation. Ensure feedback is specific to the student's gaps in knowledge based on the master key." }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Increase thinking budget for large papers
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentName: { type: Type.STRING },
            testTitle: { type: Type.STRING },
            testDate: { type: Type.STRING },
            totalScore: { type: Type.NUMBER, description: "Mathematically audited total score" },
            maxScore: { type: Type.NUMBER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  qNo: { type: Type.STRING },
                  feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
                  marks: { type: Type.NUMBER },
                  maxMarks: { type: Type.NUMBER }
                },
                required: ["qNo", "feedback", "marks", "maxMarks"]
              }
            },
            generalFeedback: {
              type: Type.OBJECT,
              properties: {
                overallPerformance: { type: Type.STRING },
                mcqs: { type: Type.STRING, description: "Used for listing Topics/Syllabus" },
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

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: response.text,
    };
  } catch (error: any) {
    console.error("Evaluation Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "The medical synthesis engine encountered a temporary timeout. Please try with smaller chunks or check API availability." }),
    };
  }
};
