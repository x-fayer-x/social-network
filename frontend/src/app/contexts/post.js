'use client';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        console.log('posts data :', postData);
    }, [postData]);

    return (
        <PostContext.Provider value={{
            postData,
            setPostData
        }}>
            {children}
        </PostContext.Provider>
    );
}

export const usePost = () => {
    return useContext(PostContext);
};