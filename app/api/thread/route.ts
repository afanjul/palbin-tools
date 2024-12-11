import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured');
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    console.log('Generating Twitter/X thread...');

    const result = await streamText({
      model: openrouter('openai/gpt-4o-mini'),
      messages: [{
        role: 'system',
        content: 'You are a professional social media content creator who specializes in creating engaging Twitter/X threads. Your threads are informative, engaging, and well-structured. Always start each tweet with a number followed by a period and a space (e.g., "1. ", "2. ").'
      }, {
        role: 'user',
        content: `Convert the following content into an engaging Twitter/X thread. 
Each tweet should be under 280 characters and marked with a number.
Make it engaging, use emojis where appropriate, and break down complex ideas into digestible parts.
Add relevant hashtags at the end of the thread.
Keep the original meaning intact while making it more conversational.

Content to convert:
${content}`
      }],
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Log the response data
    const responseBody = await result.response;
    if (responseBody instanceof Response) {
      const reader = responseBody.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log('Streaming response:', decoder.decode(value));
        }
      }
    }

    console.log('Thread generated successfully.');

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Thread generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate thread' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
