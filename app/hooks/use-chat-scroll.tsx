/**
 * A custom hook that manages automatic scrolling behavior for chat messages.
 * It provides a ref that can be attached to a scrollable container and will
 * automatically scroll to the latest content when the dependency changes.
 * 
 * @template T The type of the dependency that triggers scroll updates
 * @param {T} dep - The dependency value that triggers scroll updates when changed
 * @returns {MutableRefObject<HTMLDivElement | null>} A ref to attach to the scrollable container
 */

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
