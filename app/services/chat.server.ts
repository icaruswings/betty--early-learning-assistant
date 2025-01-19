import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ModelId } from "~/lib/constants";

type LangChainMessage = AIMessage | HumanMessage;

export async function streamChatCompletion(messages: LangChainMessage[], modelId: ModelId) {
  const model = new ChatOpenAI({
    model: modelId,
    temperature: 0.7,
    configuration: {
      baseURL: "https://oai.hconeai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      },
    },
  });

  return await model.streamEvents(messages, {
    version: "v2",
    encoding: "text/event-stream",
  });
}
