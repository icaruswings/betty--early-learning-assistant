export const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "o1-preview", name: "o1 Preview" },
] as const;

export type ModelId = (typeof models)[number]["id"];

export const DEFAULT_MODEL = "gpt-4o";
