import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "o1-preview", name: "o1 Preview" },
] as const;

export type ModelId = (typeof models)[number]["id"];

interface ModelSelectorProps {
  model: ModelId;
  onChange: (model: ModelId) => void;
}

export function ModelSelector({ model, onChange }: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.id === model);

  return (
    <Select defaultValue={model} value={model} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{selectedModel?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
