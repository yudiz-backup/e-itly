import { atom } from "recoil";

// Agency List Atom
export const region = atom<RegionType[] | undefined>({
  key: "regionAtom",
  default: undefined,
});

// Agency Filter Atom
export const regionFilterAtom = atom<RegionFilterType>({
  key: "regionFilterAtom",
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
