import { PropsWithChildren } from "react";

type Props = PropsWithChildren<unknown>;

export function PageHeader({ children }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
