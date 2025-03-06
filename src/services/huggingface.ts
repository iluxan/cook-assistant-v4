import axios from 'axios';
import { AIResult } from './types';

export async function getHuggingFaceResponse(
  recipe: string,
  question: string,
  apiKey: string
): Promise<AIResult> {
  const requestData = {
    inputs: `Answer this cooking question based on the recipe. Be specific and helpful.

Recipe:
${recipe}

Question: ${question}`,
    parameters: {
      max_new_tokens: 250,
      temperature: 0.3,
      top_p: 0.95,
      do_sample: true
    }
  };

  try {
    const response = await axios.post(
      //'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { 
      answer: response.data[0].generated_text,
      debug: {
        request: requestData,
        response: response.data
      }
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { 
        message: err.response?.data?.error || 'Failed to get answer from Hugging Face API',
        debug: {
          request: requestData,
          error: err.response?.data
        }
      };
    }
    return { 
      message: (err as Error).message || 'Failed to get answer from Hugging Face API',
      debug: {
        request: requestData,
        error: err
      }
    };
  }
}