import { atom } from "recoil";
const blocksFilterAtom = atom<BlocksFilterType>({
  key: "blocksFilterAtom",
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

export { blocksFilterAtom };
