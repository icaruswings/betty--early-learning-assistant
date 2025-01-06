import { LucideIcon } from "lucide-react";
import { usePageHeader } from "./use-page-header";
import { useEffect } from "react";

export default function setPageHeader(icon: LucideIcon | null, title: string) {
  const { setIcon, setTitle } = usePageHeader();

  useEffect(() => {
    setIcon(icon);
    setTitle(title);

    return () => {
      setTitle("");
      setIcon(null);
    };
  }, [setTitle, setIcon]);
}
