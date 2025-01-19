export const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai" },
  { id: "gpt-4", name: "GPT-4", provider: "openai" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
] as const;

export type ModelId = (typeof models)[number]["id"];
export type ModelName = (typeof models)[number]["name"];
export type ModelProvider = (typeof models)[number]["provider"];
export type Model = { id: ModelId; name: ModelName; provider: ModelProvider };

export const modelsById: Map<ModelId, Model> = new Map(models.map((model) => [model.id, model]));

export const DEFAULT_MODEL = "gpt-4o";
