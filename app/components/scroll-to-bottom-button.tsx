import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { forwardRef } from "react";
import type { ButtonProps } from "./ui/button";

type ScrollToBottomButtonProps = Omit<ButtonProps, "children">;

const ScrollToBottomButton = forwardRef<HTMLButtonElement, ScrollToBottomButtonProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        variant="secondary"
        className={`rounded-full shadow-lg ${className}`}
        {...props}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    );
  }
);

ScrollToBottomButton.displayName = "ScrollToBottomButton";

export default ScrollToBottomButton;
