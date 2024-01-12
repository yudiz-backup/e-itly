import { atom } from 'recoil';

const accountAtom = atom<AccountType | undefined>({
    key: 'accountAtom',
    default: undefined,
});

export { accountAtom };
