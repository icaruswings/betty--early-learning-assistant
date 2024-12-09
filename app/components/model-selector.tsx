import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAtom } from "jotai";
import { modelSelectionAtom } from "~/atoms";
import { models, ModelId, DEFAULT_MODEL } from "~/lib/constants";

export function ModelSelector() {
  const [model, setModel] = useAtom(modelSelectionAtom);
  const selectedModel = models.find((m) => m.id === model);

  return (
    <Select value={model} onValueChange={(v: ModelId) => setModel(v)}>
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
