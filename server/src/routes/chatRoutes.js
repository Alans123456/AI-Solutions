import express from "express";
import { listContent } from "../db/contentRepository.js";

export const chatRoutes = express.Router();

const contentTypes = ["services", "projects", "blog", "events", "careers", "testimonials", "gallery", "team", "faqs"];
const typeLabels = {
  services: "services",
  projects: "projects",
  blog: "blog posts",
  events: "events",
  careers: "vacancies",
  testimonials: "testimonials",
  gallery: "gallery images",
  team: "team members",
  faqs: "FAQs"
};
const singularTypeLabels = {
  services: "service",
  projects: "project",
  blog: "blog post",
  events: "event",
  careers: "vacancy",
  testimonials: "testimonial",
  gallery: "gallery image",
  team: "team member",
  faqs: "FAQ"
};

const aliases = {
  service: "services",
  services: "services",
  project: "projects",
  projects: "projects",
  portfolio: "projects",
  blog: "blog",
  blogs: "blog",
  post: "blog",
  posts: "blog",
  event: "events",
  events: "events",
  career: "careers",
  careers: "careers",
  vacancy: "careers",
  vacancies: "careers",
  job: "careers",
  jobs: "careers",
  role: "careers",
  roles: "careers",
  testimonial: "testimonials",
  testimonials: "testimonials",
  review: "testimonials",
  reviews: "testimonials",
  gallery: "gallery",
  image: "gallery",
  images: "gallery",
  photo: "gallery",
  photos: "gallery",
  team: "team",
  member: "team",
  members: "team",
  faq: "faqs",
  faqs: "faqs",
  question: "faqs",
  questions: "faqs"
};

const training = `You are the AI Solution website assistant.
Answer using the provided WEBSITE DATA first. Do not invent counts, names, prices, dates, events, projects, team members, FAQs, or services.
If a user asks for a count, answer with one short sentence and the exact number.
If a user asks for a list, list the matching item names briefly.
For project-specific pricing or timelines, direct visitors to the contact page after giving available website data.`;

const normalizeMessages = (messages) => {
  const normalized = messages
    .slice(-8)
    .map((message) => ({
      role: message.role === "bot" ? "model" : "user",
      text: String(message.text || "").trim()
    }))
    .filter((message) => message.text);

  while (normalized[0]?.role === "model") {
    normalized.shift();
  }

  return normalized;
};

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function providerError(message, status = 502) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function latestUserMessage(messages) {
  return [...messages].reverse().find((message) => message.role === "user")?.text || "";
}

function configuredProvider() {
  const requestedProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const providerKeys = {
    gemini: process.env.GEMINI_API_KEY?.trim(),
    deepseek: process.env.DEEPSEEK_API_KEY?.trim(),
    github: process.env.GITHUB_MODELS_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim()
  };

  if (requestedProvider && providerKeys[requestedProvider]) {
    return requestedProvider;
  }

  if (providerKeys.github) return "github";
  if (providerKeys.deepseek) return "deepseek";
  if (providerKeys.gemini) return "gemini";

  return null;
}

function missingProviderMessage() {
  const requestedProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (requestedProvider === "github") {
    return "GitHub Models is not configured on the server. Add GITHUB_MODELS_TOKEN to server/.env and restart the backend.";
  }
  if (requestedProvider === "deepseek") {
    return "DeepSeek is not configured on the server. Add DEEPSEEK_API_KEY to server/.env and restart the backend.";
  }
  if (requestedProvider === "gemini") {
    return "Gemini is not configured on the server. Add GEMINI_API_KEY to server/.env and restart the backend.";
  }

  return "AI chat is not configured on the server. Add one key to server/.env: GEMINI_API_KEY, DEEPSEEK_API_KEY, or GITHUB_MODELS_TOKEN, then restart the backend.";
}

async function getWebsiteData() {
  const entries = await Promise.all(
    contentTypes.map(async (type) => [type, await listContent(type)])
  );

  return Object.fromEntries(entries);
}

function summarizeItem(type, item) {
  switch (type) {
    case "services":
      return `${item.title}: ${item.description || ""} Pricing: ${item.pricing || "Not listed"}`;
    case "projects":
      return `${item.title}: ${item.description || ""} Client: ${item.client || "Not listed"} Industry: ${item.industry || "Not listed"}`;
    case "blog":
      return `${item.title}: ${item.excerpt || ""}`;
    case "events":
      return `${item.title}: ${item.description || ""} Date: ${item.date || "Not listed"}`;
    case "careers":
      return `${item.title}: ${item.summary || ""} Department: ${item.department || "Not listed"} Location: ${item.location || "Not listed"}`;
    case "testimonials":
      return `${item.clientName || item.title}: ${item.testimonial || ""}`;
    case "gallery":
      return `${item.title}: ${item.description || ""}`;
    case "team":
      return `${item.name}: ${item.role || ""}. ${item.bio || ""}`;
    case "faqs":
      return `${item.question || item.title}: ${item.answer || ""}`;
    default:
      return item.title || item.name || item.question || "Untitled";
  }
}

function buildWebsiteContext(data) {
  const lines = ["WEBSITE DATA:"];

  for (const type of contentTypes) {
    const items = data[type] || [];
    lines.push(`${typeLabels[type]} count: ${items.length}`);
    const summaries = items.slice(0, 8).map((item) => `- ${summarizeItem(type, item)}`);
    lines.push(...summaries);
  }

  return lines.join("\n");
}

function mentionedType(question) {
  const normalized = question.toLowerCase();
  const words = normalized.match(/[a-z]+/g) || [];

  for (const word of words) {
    if (aliases[word]) return aliases[word];
  }

  return null;
}

function directDataAnswer(question, data) {
  const normalized = question.toLowerCase();
  const type = mentionedType(question);
  if (!type) return null;

  const items = data[type] || [];
  const label = typeLabels[type];
  const asksCount =
    /\b(how many|count|number of|total)\b/.test(normalized) ||
    normalized.trim().startsWith("how much");

  if (asksCount) {
    const countLabel = items.length === 1 ? singularTypeLabels[type] : label;
    return `There ${items.length === 1 ? "is" : "are"} ${items.length} ${countLabel}.`;
  }

  const asksList = /\b(list|show|what are|which|names?)\b/.test(normalized);
  if (asksList) {
    if (!items.length) return `There are no ${label} available right now.`;
    const names = items.map((item) => item.title || item.name || item.question || item.clientName).filter(Boolean);
    return `The ${label} are: ${names.join(", ")}.`;
  }

  return null;
}

async function getGeminiReply(messages, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }]
        })),
        generationConfig: { temperature: 0.6, maxOutputTokens: 300 }
      })
    }
  );

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw providerError(data.error?.message || data.message || "Gemini service failed.", response.status);
  }

  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim();
}

async function getDeepSeekReply(messages, systemPrompt) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!apiKey) {
    return null;
  }

  let response;

  try {
    response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({
            role: message.role === "model" ? "assistant" : "user",
            content: message.text
          }))
        ],
        temperature: 0.6,
        max_tokens: 300,
        stream: false
      })
    });
  } catch (error) {
    throw providerError(
      error instanceof Error
        ? `DeepSeek request failed: ${error.message}`
        : "DeepSeek request failed before the API returned a response."
    );
  }

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw providerError(data.error?.message || data.message || "DeepSeek service failed.", response.status);
  }

  return data.choices?.[0]?.message?.content?.trim();
}

async function getGithubReply(messages, systemPrompt) {
  const apiKey = process.env.GITHUB_MODELS_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  const model = process.env.GITHUB_MODEL || "openai/gpt-4.1-mini";

  if (!apiKey) {
    return null;
  }

  let response;

  try {
    response = await fetch("https://models.github.ai/inference/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2026-03-10",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({
            role: message.role === "model" ? "assistant" : "user",
            content: message.text
          }))
        ],
        temperature: 0.6,
        max_tokens: 300,
        stream: false
      })
    });
  } catch (error) {
    throw providerError(
      error instanceof Error
        ? `GitHub Models request failed: ${error.message}`
        : "GitHub Models request failed before the API returned a response."
    );
  }

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw providerError(data.message || data.error?.message || "GitHub Models service failed.", response.status);
  }

  return data.choices?.[0]?.message?.content?.trim();
}

chatRoutes.post("/chat", async (req, res, next) => {
  try {
    const rawMessages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const messages = normalizeMessages(rawMessages);

    if (messages.length === 0) {
      return res.status(400).json({ message: "Please send a message for the assistant to answer." });
    }

    const websiteData = await getWebsiteData();
    const directReply = directDataAnswer(latestUserMessage(messages), websiteData);
    if (directReply) {
      return res.json({ reply: directReply });
    }

    const systemPrompt = `${training}\n\n${buildWebsiteContext(websiteData)}`;
    const provider = configuredProvider();
    if (!provider) {
      return res.status(503).json({ message: missingProviderMessage() });
    }

    const reply =
      provider === "github"
        ? await getGithubReply(messages, systemPrompt)
        : provider === "deepseek"
          ? await getDeepSeekReply(messages, systemPrompt)
          : await getGeminiReply(messages, systemPrompt);

    return res.json({ reply: reply || "I could not generate a reply right now." });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
});
