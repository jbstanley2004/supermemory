import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";

export type ModelEnv = {
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL?: string; // Cloudflare AI Gateway base URL for OpenAI (optional)
  OPENAI_MODEL?: string;
};

export function createOpenAIProvider(env: ModelEnv): OpenAIProvider {
  return createOpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL || undefined
  });
}

