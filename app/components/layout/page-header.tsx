import { PropsWithChildren } from "react";

export function PageHeader({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex items-center justify-between p-4 pl-14 md:pl-4 border-b">
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
}
