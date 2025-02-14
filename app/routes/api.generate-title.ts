import OpenAI from "openai";
import type { ActionFunction } from "@remix-run/node";
import { ensureHttpMethodAllowed, ensureSessionExists } from "~/lib/middleware";
import { ServerError } from "~/lib/responses";
import { STARTER_PROMPT } from "~/config/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { chatCompletion } from "~/services/chat.server";
import { ModelId } from "~/lib/constants";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const Schema = z.object({
  title: z.string(),
});

export const action: ActionFunction = async (args) => {
  const { request } = args;

  ensureHttpMethodAllowed(request, ["POST"]);
  await ensureSessionExists(args);

  const parser = StructuredOutputParser.fromZodSchema(Schema);

  const { messages: previousMessages } = await request.json();

  console.log({ previousMessages });

  const messages = [
    new SystemMessage(`${STARTER_PROMPT}
      ${parser.getFormatInstructions()}
    `),
    new HumanMessage(`
      Generate a descriptive title for this conversation about early childhood education.
      - Generate a title that captures the main topic or question discussed.
      - Keep it under 60 characters.
      - Return ONLY the title, nothing else.
    `),
    ...previousMessages,
  ];

  const response = await chatCompletion(messages, ModelId["GPT4o-mini"]);
  return parser.parse(response.content as string);
};
