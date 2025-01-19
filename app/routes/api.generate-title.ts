import OpenAI from "openai";
import type { ActionFunction } from "@remix-run/node";
import { ensureHttpMethodAllowed, ensureSessionExists } from "~/lib/middleware";
import { ServerError } from "~/lib/responses";

export const action: ActionFunction = async (args) => {
  const { request } = args;

  ensureHttpMethodAllowed(request, ["POST"]);
  await ensureSessionExists(args);

  const openai = new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Response("Bad Request: messages array is required", { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that generates concise, descriptive titles for conversations about early childhood education. Generate a title that captures the main topic or question discussed. Keep it under 60 characters. Return ONLY the title, nothing else.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 30, // Titles should be short
    });

    const title = completion.choices[0]?.message?.content?.trim() || "New Conversation";

    return new Response(JSON.stringify({ title }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating title:", error);

    if (error instanceof ServerError) {
      throw error;
    }

    throw new Response("Internal Server Error", { status: 500 });
  }
};
