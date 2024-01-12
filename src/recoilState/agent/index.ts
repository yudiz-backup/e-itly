import { atom } from "recoil";

// Agency List Atom
export const agent = atom<AgentType[] | undefined>({
  key: "agentAtom",
  default: undefined,
});

// Agency Filter Atom
export const agentFilterAtom = atom<AgentFilterType>({
  key: "agentFilterAtom",
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
