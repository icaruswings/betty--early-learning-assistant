import { atom } from 'jotai';
import type { ModelId } from '~/components/ui/model-selector';

export const sidebarOpenAtom = atom(false);

export const modelSelectionAtom = atom<ModelId>("gpt-4");
