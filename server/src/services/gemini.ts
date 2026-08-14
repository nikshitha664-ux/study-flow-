import { GoogleGenAI, Type } from '@google/genai';

export const getGeminiClient = (customApiKey?: string) => {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Provide it in environment variables or settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';

export const SYSTEM_PROMPT = `You are AI Workspace Core Engine, a hyper-capable, highly accurate, context-aware AI assistant integrated into a modern productivity platform. Respond with clear markdown formatting, precise syntax, and structured outputs when requested. Prioritize direct solutions over filler conversational intro phrases.`;

export const quizResponseSchema = {
  type: Type.OBJECT,
  properties: {
    quizTitle: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionId: { type: Type.INTEGER },
          questionText: { type: Type.STRING },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ["questionId", "questionText", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["quizTitle", "questions"]
};
