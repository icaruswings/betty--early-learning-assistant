export enum ModelId {
  GPT4o = "gpt-4o",
  "GPT4o-mini" = "gpt-4o-mini",
}

export enum ModelProvider {
  "OpenAI" = "openai",
}

export type ModelDefinition = { id: ModelId; provider: ModelProvider };

export const models: ModelDefinition[] = [
  { id: ModelId.GPT4o, provider: ModelProvider.OpenAI },
  { id: ModelId["GPT4o-mini"], provider: ModelProvider.OpenAI },
] as const;

export const modelsById: Map<ModelId, ModelDefinition> = new Map(
  models.map((model) => [model.id, model])
);

export const DEFAULT_MODEL = modelsById.get(ModelId["GPT4o-mini"]);
