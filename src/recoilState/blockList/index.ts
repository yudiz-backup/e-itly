import { atom } from "recoil";

const BlockListAtom = atom<BlockType[] | undefined>({
  key: "BlockListAtom",
  default: undefined,
});

export { BlockListAtom };
