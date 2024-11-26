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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant specializing in early childhood education, designed to help teachers with their professional needs. Generate conversation starters that address common teaching challenges, curriculum planning, classroom management, and professional development. Focus on questions that teachers would ask, such as 'How can I differentiate instruction for...' or 'What strategies work best for...'. The questions should be specific to teaching scenarios but concise. Return ONLY the questions, one per line, without any numbering or bullets.",
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

    return Response.json({ starters });
  } catch (error) {
    console.error("Error generating starters:", error);
    return Response.json(
      { error: "Failed to generate conversation starters" },
      { status: 500 }
    );
  }
};
