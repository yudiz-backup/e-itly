import { atom } from "recoil";

// Supplier List Atom
export const supplier = atom<SupplierType[] | undefined>({
    key: "supplierAtom",
    default: undefined,
});

// Supplier Filter Atom
export const supplierFilterAtom = atom<SupplierFilterType>({
    key: "supplierFilterAtom",
    default: {
        limit: 10,
        prevEndBeforeDocId: "",
        nextStartAfterDocId: "",
        search: "",
        firstDocId: "",
        change: false,
        page: 1
    },
});