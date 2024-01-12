import { atom } from "recoil";
const SubAdminFilterAtom = atom<SubAdminFilterType>({
  key: "SubAdminFilterAtom",
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

export { SubAdminFilterAtom };
