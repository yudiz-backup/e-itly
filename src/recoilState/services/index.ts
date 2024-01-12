import { atom } from "recoil";

// Services List Atom
export const services = atom<ServicesType[] | undefined>({
  key: "servicesAtom",
  default: undefined,
});

// Services Filter Atom
export const servicesFilterAtom = atom<ServicesFilterType>({
  key: "servicesFilterAtom",
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
