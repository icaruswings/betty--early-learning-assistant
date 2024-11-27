import { atom } from "jotai";
import { DEFAULT_MODEL, type ModelId } from "~/components/model-selector";

export const sidebarOpenAtom = atom(false);

export const modelSelectionAtom = atom<ModelId>(DEFAULT_MODEL);
