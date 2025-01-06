import OpenAI from "openai";
import { PEDAGOGY_PROMPT } from "~/config/prompts";
import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { ServerError } from "~/lib/errors";
import { getAuth } from "@clerk/remix/ssr.server";

function ensureHttpMethodAllowed(request: Request, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    throw new Response("Method Not Allowed", { status: 405 });
  }
}

async function ensureSessionExists(args: DataFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export const action: ActionFunction = async (args) => {
  const { request } = args;

  ensureHttpMethodAllowed(request, ["POST"]);
  ensureSessionExists(args);

  // Parse the incoming request body
  const { messages: userMessages, model } = await request.json();

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

    // Create a TransformStream to convert chunks to SSE (Server-sent events) format
    const encoder = new TextEncoder();
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        try {
          if (chunk.choices && chunk.choices[0]?.delta?.content !== undefined) {
            const content = chunk.choices[0].delta.content;
            const data = JSON.stringify({ content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } catch (error) {
          console.error("Error in transform stream:", error);
          const errorData = JSON.stringify({ error: "Error processing stream chunk" });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        }
      },
      flush(controller) {
        try {
          const data = JSON.stringify({ content: "", done: true });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          console.error("Error in transform stream flush:", error);
        }
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
          console.error("Error in readable stream:", error);
          controller.error(error);
        }
      },
      cancel() {
        // Ensure we clean up if the stream is cancelled
        stream.controller.abort();
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
