const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  thinkingSteps: string[];
  processingTime: number;
  tokenUsage?: {
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
  };
}

export class AIService {
  static async generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    temperature: number = 0.7
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const thinkingSteps: string[] = [];

    thinkingSteps.push('Analyzing user input...');

    const conversationText = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nassistant:`;

    thinkingSteps.push('Generating AI response...');

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: 2000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';
      const usageMetadata = data.usageMetadata;

      const processingTime = Date.now() - startTime;

      return {
        content,
        thinkingSteps,
        processingTime,
        tokenUsage: usageMetadata
          ? {
              promptTokens: usageMetadata.promptTokenCount,
              responseTokens: usageMetadata.candidatesTokenCount,
              totalTokens: usageMetadata.totalTokenCount,
            }
          : undefined,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      return {
        content: 'I apologize, but I encountered an error generating a response. Please try again.',
        thinkingSteps,
        processingTime: Date.now() - startTime,
      };
    }
  }
}
