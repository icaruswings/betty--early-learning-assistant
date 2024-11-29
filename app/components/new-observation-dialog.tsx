import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ObservationChat } from "./observation-chat";
import { PageHeader } from "./layout/page-header";

interface NewObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (observation: string) => void;
}

export function NewObservationDialog({
  open,
  onOpenChange,
  onSave,
}: NewObservationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 rounded-none">
        <PageHeader>
          <h3 className="text-lg font-semibold">New Observation</h3>
        </PageHeader>
        <div className="flex-1 overflow-hidden">
          <ObservationChat onSave={onSave} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
