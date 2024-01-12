import React from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const PrivateAuthRoute = () => {
    const [isUser, setIsUser] = useState<any>(undefined);
    const navigate = useNavigate();
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        setIsUser(user);
        return user;
    });
    return isUser?.uid ? navigate('/') : <Outlet />;
};
export default PrivateAuthRoute;
