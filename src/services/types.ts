export interface Recipe {
  id: string;
  content: string;
  createdAt: Date;
}

export interface DebugInfo {
  request: any;
  response?: any;
  error?: any;
}

export interface AIResponse {
  answer: string;
  debug?: DebugInfo;
}

export interface AIError {
  message: string;
  debug?: DebugInfo;
}

export type AIResult = AIResponse | AIError;

export const isAIError = (result: AIResult): result is AIError => {
  return 'message' in result;
};