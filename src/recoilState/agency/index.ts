import { atom } from "recoil";

// Agency List Atom
export const agency = atom<AgencyType[] | undefined>({
  key: "agencyAtom",
  default: undefined,
});

// Agency Filter Atom
export const agencyFilterAtom = atom<AgencyFilterType>({
  key: "agencyFilterAtom",
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
