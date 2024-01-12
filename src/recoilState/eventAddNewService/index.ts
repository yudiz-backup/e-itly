import { atom } from "recoil";

// Services List Atom
export const eventAddNewServiceAtom = atom<eventAddNewServiceType[] | undefined>({
  key: "eventAddNewServiceAtom",
  default: undefined,
});
