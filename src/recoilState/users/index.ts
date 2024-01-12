import { atom } from 'recoil';

const usersAtom = atom<Array<UserModel> | undefined>({
    key: 'usersAtom',
    default: undefined,
});

const usersLoadingAtom = atom<boolean>({
    key: 'usersLoadingAtom',
    default: false,
});

export { usersAtom, usersLoadingAtom };
