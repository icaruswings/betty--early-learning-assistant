import { type LoaderFunction } from "@remix-run/node";
import { STARTER_PROMPT } from "~/config/prompts";
import { ensureSessionExists } from "~/lib/middleware";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { chatCompletion } from "~/services/chat.server";
import { ModelId } from "~/lib/constants";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const Schema = z.object({
  starters: z.array(z.string()),
});

export const loader: LoaderFunction = async (args) => {
  await ensureSessionExists(args);

  const parser = StructuredOutputParser.fromZodSchema(Schema);

  const messages = [
    new SystemMessage(`${STARTER_PROMPT}
      ${parser.getFormatInstructions()}
    `),
    new HumanMessage(`
      Generate 4 conversation starters.
      - write them in the first person as if they are being asked by an educator.
    `),
  ];

  const response = await chatCompletion(messages, ModelId["GPT4o-mini"]);
  return parser.parse(response.content as string);
};
