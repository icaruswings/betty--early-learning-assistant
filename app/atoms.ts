import { atom } from "jotai";
import { defaultModel, type ModelId } from "~/components/model-selector";

export const sidebarOpenAtom = atom(false);

export const modelSelectionAtom = atom<ModelId>(defaultModel);
