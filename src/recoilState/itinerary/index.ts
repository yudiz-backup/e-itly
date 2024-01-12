import { atom } from "recoil";

const itineraryAtom = atom<ItineraryType | undefined>({
    key: "itineraryAtom",
    default: undefined,
});

const itineraryVersionAtom = atom<ItineraryType | undefined>({
    key: "itineraryVersionAtom",
    default: undefined
})

export { itineraryAtom, itineraryVersionAtom };
