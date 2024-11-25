'use client';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import Cookies from 'js-cookie';

const UserContext = createContext();

// suspense component 

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [asyncUser, setAsyncUser] = useState(null);

    useEffect(() => {
        const userSession = Cookies.get('user');
        if (userSession && user === null) {
            setUser(JSON.parse(userSession));
        }
        console.log("contexte user chargé", userSession)
    }, []);
    useEffect(() => {
        if (asyncUser != null) {
            setUser(asyncUser);
        }
    }, [asyncUser]);
    return (
        <UserContext.Provider value={{
            user,
            setUser, 
            asyncUser, 
            setAsyncUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};