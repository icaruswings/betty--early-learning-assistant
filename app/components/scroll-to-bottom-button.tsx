import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

const ScrollToBottomButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={onClick}>
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
};

export default ScrollToBottomButton;
