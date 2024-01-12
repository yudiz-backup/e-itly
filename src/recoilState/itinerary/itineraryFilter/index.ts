import { atom } from "recoil"
import { localStorageKey } from "src/constants/generics"
import { getItem } from "src/utils/storage"

const userInfoData = getItem(localStorageKey?.userInfo)?.data
const defaultItineraryAppliedOwnerFilter = [{ id: userInfoData?.id, userName: userInfoData?.name }]

const itineraryAppliedOwnerFilter = atom<ItineraryAppliedOwnerFilter>({
    key: "itineraryFilterAtom",
    default: defaultItineraryAppliedOwnerFilter
})

export { itineraryAppliedOwnerFilter }