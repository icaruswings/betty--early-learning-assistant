import OpenAI from "openai";
import { type LoaderFunction } from "@remix-run/node";
import { ServerError } from "~/lib/errors";
import { Starters } from "~/lib/responses";
import { STARTER_PROMPT } from "~/config/prompts";
import { getAuth } from "@clerk/remix/ssr.server";

export const loader: LoaderFunction = async (args) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const openai = new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: STARTER_PROMPT,
        },
        {
          role: "user",
          content: "Generate 4 conversation starters focused on teaching scenarios",
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";
    const starters = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, ""))
      .slice(0, 4);

    return Starters(starters);
  } catch (error) {
    console.error("Error generating starters:", error);
    return ServerError("Failed to generate conversation starters");
  }
};
