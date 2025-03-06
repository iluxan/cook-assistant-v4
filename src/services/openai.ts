import axios from 'axios';
import { AIResult } from './types';

export async function getOpenAIResponse(
  recipe: string,
  question: string,
  apiKey: string
): Promise<AIResult> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful cooking assistant. Here is the recipe: ${recipe}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { answer: response.data.choices[0].message.content };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { message: err.response?.data?.error || 'Failed to get answer from OpenAI API' };
    }
    return { message: (err as Error).message || 'Failed to get answer from OpenAI API' };
  }
}