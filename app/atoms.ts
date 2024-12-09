import { atom } from "jotai";
import { DEFAULT_MODEL, type ModelId } from "~/lib/constants";

export const sidebarOpenAtom = atom<boolean>(false);

export const modelSelectionAtom = atom<ModelId>(DEFAULT_MODEL);

export const conversationStartersAtom = atom<{
  starters: string[];
  lastFetched: number | null;
}>({
  starters: [],
  lastFetched: null,
});
