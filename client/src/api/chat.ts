import { apiUrl } from "./config";

export type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export class ChatApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ChatApiError(data?.message || "AI assistant could not answer right now.", response.status);
  }

  if (!data?.reply) {
    throw new Error("AI assistant returned an empty response.");
  }

  return data.reply as string;
}
