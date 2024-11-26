import { PropsWithChildren } from "react";

export function PageHeader({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}