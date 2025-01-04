import { createContext, useContext, useState, PropsWithChildren } from "react";
import { type LucideIcon } from "lucide-react";

interface PageHeaderContext {
  title: string;
  Icon: LucideIcon | null;
  setTitle: (title: string) => void;
  setIcon: (IconComponent: LucideIcon | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContext | undefined>(undefined);

export function PageHeaderProvider({ children }: PropsWithChildren<unknown>) {
  const [title, setTitle] = useState("");
  const [IconComponent, setIcon] = useState<LucideIcon | null>(null);

  return (
    <PageHeaderContext.Provider value={{ title, Icon: IconComponent, setTitle, setIcon }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);

  if (context === undefined) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider");
  }

  return context;
}
