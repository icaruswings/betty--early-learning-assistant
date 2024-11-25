import OpenAI from "openai";
import { DEFAULT_MESSAGES } from "~/config/assistant.config";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  // Ensure the request method is POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Parse the incoming request body
  const body = await request.json();
  const { messages: userMessages, model = "gpt-3.5-turbo" } = body;

  // Combine default messages with user messages
  const messages = [
    ...DEFAULT_MESSAGES,
    ...userMessages.filter((msg: any) => msg.role === "user"),
  ];

  // Initialize OpenAI client
  const openai = new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

  try {
    // Create a completion
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7, // Balanced between consistency and creativity
      max_tokens: 1000, // Reasonable limit for detailed responses
    });

    // Return the completion as a JSON response
    return Response.json({
      content: completion.choices[0]?.message?.content || "",
      model: model,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json(
      { error: "Error processing chat request" },
      { status: 500 }
    );
  }
};
