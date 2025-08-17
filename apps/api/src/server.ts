import { routeAgentRequest } from "agents";
import { generateText } from "ai";
import { createOpenAIProvider } from "./model";
import type { Env } from "./agents/chat";
export { Chat } from "./agents/chat";

function withCORS(res: Response, req: Request): Response {
  const headers = new Headers(res.headers);
  const origin = req.headers.get("Origin") || "*";
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }), request);
    }

    // Title generation endpoint used by the web app
    if (url.pathname === "/chat/title" && request.method === "POST") {
      try {
        const { input } = await request.json().catch(() => ({ input: "" }));
        const promptText = typeof input === "string" ? input.slice(0, 800) : "Untitled";
        const openai = createOpenAIProvider(env);
        const model = env.OPENAI_MODEL || "gpt-4o-mini";
        const { text } = await generateText({
          model: openai(model),
          prompt: `Generate a concise, human-friendly title (max 8 words) for this chat reply:\n\n${promptText}\n\nTitle:`
        });
        return withCORS(new Response(text.trim(), { status: 200 }), request);
      } catch (e) {
        return withCORS(new Response("", { status: 500 }), request);
      }
    }

    // Route all other requests to the agent (handles /chat streaming via AI SDK format)
    const routed = await routeAgentRequest(request, env, { prefix: "" });
    if (routed) return withCORS(routed, request);

    return withCORS(new Response("Not found", { status: 404 }), request);
  }
} satisfies ExportedHandler<Env>;
