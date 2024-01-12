import { atom } from "recoil";

const SubAdminListAtom = atom<SubAdminListType[] | undefined>({
  key: "SubAdminListAtom",
  default: undefined,
});

export { SubAdminListAtom };
