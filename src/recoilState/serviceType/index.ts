import { atom } from "recoil";

// Service-Type List Atom
export const serviceTypeListAtom = atom<ServiceTypeType[] | undefined>({
  key: "serviceTypeListAtom",
  default: undefined,
});

// Service-Type Filter Atom
export const serviceTypeFilterAtom = atom<ServiceTypeFilterType>({
  key: "serviceTypeFilterAtom",
  default: {
    limit: 10,
    prevEndBeforeDocId: "",
    nextStartAfterDocId: "",
    search: "",
    firstDocId: "",
    change: false,
    page: 1,
  },
});