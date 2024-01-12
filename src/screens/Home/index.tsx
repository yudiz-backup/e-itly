import React from 'react'
import { useRecoilValue } from 'recoil';
import { accountAtom } from 'src/recoilState/account';


function Home() {
    const account: AccountType | undefined = useRecoilValue(accountAtom);

    return (
        <>Home {account ? account.emailId + ' ' + account.isAdmin : 'loading'}</>
    );
}

export default Home;
