import OpenAI from "openai";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const openai = new OpenAI({
    baseURL: "https://oai.hconeai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specializing in early education and teaching. Generate 4 engaging conversation starters that would help teachers get started with using the AI assistant. Each starter should be a question about different aspects of teaching and education. Make them concise but specific.",
        },
        {
          role: "user",
          content: "Generate 4 conversation starters.",
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";
    const starters = content
      .split("\n")
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, ""))
      .slice(0, 4);

    return Response.json({ starters });
  } catch (error) {
    console.error("Error generating starters:", error);
    return Response.json(
      { error: "Failed to generate conversation starters" },
      { status: 500 }
    );
  }
};
