import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback } from "ai";
import { createDataStreamResponse, streamText } from "ai";
import { createOpenAIProvider } from "../model";

export type Env = {
  Chat: DurableObjectNamespace<Chat>;
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
};

export class Chat extends AIChatAgent<Env> {
  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    const openai = createOpenAIProvider(this.env);
    const modelId = this.env.OPENAI_MODEL || "gpt-4o-mini";

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model: openai(modelId),
          messages: this.messages,
          onFinish
        });
        result.mergeIntoDataStream(dataStream);
      }
    });
  }
}

