import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAtom } from "jotai";
import { modelSelectionAtom } from "~/atoms";

export const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "o1-preview", name: "o1 Preview" },
] as const;

export type ModelId = (typeof models)[number]["id"];

export function ModelSelector() {
  const [model, setModel] = useAtom(modelSelectionAtom);
  const selectedModel = models.find((m) => m.id === model);

  return (
    <Select value={model} onValueChange={setModel}>
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
