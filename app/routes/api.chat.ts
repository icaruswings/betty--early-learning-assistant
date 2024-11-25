import type { ActionFunctionArgs } from "@remix-run/node";
import OpenAI from "openai";
import { DEFAULT_MESSAGES } from "../config/assistant.config";

export async function action({ request }: ActionFunctionArgs) {
  // Ensure the request method is POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Parse the incoming request body
  const body = await request.json();
  const { messages: userMessages } = body;

  // Combine default messages with user messages
  const messages = [
    ...DEFAULT_MESSAGES,
    ...userMessages.filter((msg: any) => msg.role === "user"),
  ];

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // Create a completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7, // Balanced between consistency and creativity
      max_tokens: 1000, // Reasonable limit for detailed responses
    });

    // Return the completion as a JSON response
    return new Response(
      JSON.stringify({
        content: completion.choices[0]?.message?.content || "",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Error processing chat request", { status: 500 });
  }
}
