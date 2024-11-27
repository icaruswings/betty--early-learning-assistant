import OpenAI from "openai";
import type { ActionFunction } from "@remix-run/node";
import { Suggestions } from "~/lib/responses";
import { ServerError } from "~/lib/errors";

export const action: ActionFunction = async ({ request }) => {
  const openai = new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

  try {
    const { messages } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant specializing in early childhood education. You're role is to generate follow-up questions that a user might naturally ask after receiving your response. You should make them concise but specific. Return ONLY the questions, one per line, without any numbering or bullets. Make them conversational, like 'Could you tell me more about...' or 'Please help me write the learning story.'",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";
    // Split by newline, remove empty lines and any leading numbers or bullets
    const suggestions = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[-\d.)\s]+/, ""))
      .slice(0, 4);

    return Suggestions(suggestions);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return ServerError("Failed to generate suggestions");
  }
};
