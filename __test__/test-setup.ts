import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { vi } from 'vitest';
expect.extend(matchers);

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    createBrowserRouter: vi.fn(),
}));

vi.mock('recoil', () => ({
    RecoilRoot: vi.fn(),
    atom: vi.fn((val) => {
        return val;
    }),
    useRecoilState: vi.fn((ok) => {
        return ['ok', () => {}];
    }),
}));

vi.mock('recoil/account', () => ({
    accountAtom: 'account',
}));

const mockedUserInfo = Object.freeze({
    // force read-only
    // mocked user info here - display name, email, etc
    email: 'example@example.com',
    providerData: [{ providerId: 'password' }],
});

const authFunc = vi.fn((_authMock, onChangeCallback) => {
    // increase this delay to emulate slower connections
    // const timeOut = setTimeout(onChangeCallback(mockedUserInfo), 2000);

    const unsubscriber = () => {
        //   clearTimeout(timeOut)
    };

    // auth is "resolved" already, fire callback immediately
    onChangeCallback(mockedUserInfo);

    return unsubscriber;
});

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => {
        return {
            currentUser: {
                email: 'test@gmail.com',
                uid: '12345',
                emailVerified: true,
                reload: vi.fn(),
                getIdTokenResult: vi.fn(() => {
                    return {
                        claims: {
                            email: 'user@mail.com',
                            admin: true,
                        },
                    };
                }),
            },
        };
    }),
    onIdTokenChanged: authFunc,
    onAuthStateChanged: authFunc,
    sendEmailVerification: vi.fn(),
    confirmPasswordReset: vi.fn(),
    applyActionCode: vi.fn(),
    signInWithEmailAndPassword: vi.fn(() => {
        return Promise.resolve({ user: mockedUserInfo });
    }),
    createUserWithEmailAndPassword: vi.fn(() => {
        return Promise.resolve({ user: mockedUserInfo });
    }),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
    signInWithPhoneNumber: vi.fn(),
}));
