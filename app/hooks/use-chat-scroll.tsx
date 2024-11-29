import { MutableRefObject, useEffect, useRef } from "react";

export function useChatScroll<T>(
  dep: T
): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
    }
  }, [dep]);

  return ref;
}
