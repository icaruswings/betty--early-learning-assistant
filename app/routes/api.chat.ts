import OpenAI from "openai";
import { PEDAGOGY_PROMPT } from "~/config/prompts";
import type { ActionFunction } from "@remix-run/node";
import { ServerError } from "~/lib/errors";

export const action: ActionFunction = async ({ request }) => {
  // Ensure the request method is POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Parse the incoming request body
  const body = await request.json();
  const { messages: userMessages, model } = body;

  // Combine default messages with user messages
  const messages = [
    {
      role: "system",
      content: PEDAGOGY_PROMPT,
    },
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
    // Create a streaming completion
    const stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
      stream_options: {
        include_usage: true,
      },
    });

    // Create a TransformStream to convert chunks to SSE format
    const encoder = new TextEncoder();
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const content = chunk.choices[0]?.delta?.content || "";
        const data = JSON.stringify({ content });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      },
    });

    // Create a readable stream from the OpenAI stream
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Pipe through the transform stream
    const responseStream = readable.pipeThrough(transformStream);

    // Return the streaming response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return ServerError("Error processing chat request");
  }
};
