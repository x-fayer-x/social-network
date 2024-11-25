'use client';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(data);
    }, [data]);

    const [asyncData, setAsyncData] = useState(null);

    useEffect(() => {
        const dataSession = localStorage.getItem('data');
        if (dataSession && data === null) {
            setData(JSON.parse(dataSession));
        }
        console.log("Contexte user chargé", dataSession);
    }, []);

    useEffect(() => {
        if (asyncData != null) {
            setData(asyncData);
            localStorage.setItem('data', JSON.stringify(asyncData));
        }
    }, [asyncData]);

    return (
        <LoadingContext.Provider value={{
            loading,
            setLoading,
            data,
            setData,
        }}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    return useContext(LoadingContext);
};
