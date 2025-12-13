import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // <-- MUST import useCallback
import axios from 'axios';
import { AuthContext } from './AuthContext';

const RecieverContext = createContext(null);

export const useRecieverContext = () => {
    return useContext(RecieverContext);
};

const RecieverProvider = ({ children }) => {
    
    const AuthContextValue = AuthContext();
    if (!AuthContextValue) {
        return null;
    }
    const { User } = AuthContextValue;
    const currentUserEmail = User?.email || User?.user?.email;

    const [recievers, setRecievers] = useState([]);
    const [recieverLoading, setRecieverLoading] = useState(true);
    const [recieverError, setRecieverError] = useState(null);

    // FIX 1: Wrap fetchRecievers in useCallback to stabilize the function identity.
    const fetchRecievers = useCallback(async () => {
        setRecieverLoading(true);
        setRecieverError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/request/all', {
                withCredentials: true
            });
            const requestList = response.data.requests;
            console.log(requestList); 
            
            setRecievers(requestList); 
            setRecieverLoading(false);
            
        } catch (error) {
            setRecieverError(error.response?.data?.message || 'Failed to fetch blood requests list');
            setRecieverLoading(false);
            setRecievers([]);
        }
    // CRITICAL: Empty dependency array means this function is only created once, ensuring stability.
    }, []); 
    
    // FIX 2: Wrap createReciever in useCallback, as it's exposed and depends on fetchRecievers
    const createReciever = useCallback(async (requestData) => {
        setRecieverLoading(true);
        setRecieverError(null);
        console.log('Creating reciever with data:', requestData);
        try {
            const response = await axios.post('http://localhost:4000/api/request/create', requestData, {
                withCredentials: true
            });
            console.log('Reciever created:', response.data);
            
            // Depends on fetchRecievers, which is stable, so no loop is created here.
            await fetchRecievers(); 
            
            return response.data;

        } catch (error) {
            setRecieverLoading(false);
            const msg = error.response?.data?.message || 'Failed to create request';
            setRecieverError(msg);
            throw new Error(msg);
        }
    }, [fetchRecievers]); // Depends on stable fetchRecievers

    // This useEffect is now safe because fetchRecievers is stable.
    useEffect(() => {
        if (currentUserEmail) {
            fetchRecievers();
        } else {
            setRecievers([]);
            setRecieverLoading(false);
        }
    }, [currentUserEmail, fetchRecievers]);

    return (
        <RecieverContext.Provider 
            value={{
                recievers,
                recieverLoading,
                recieverError,
                fetchRecievers,
                createReciever,
            }}
        >
            {children}
        </RecieverContext.Provider>
    );
};

export default RecieverProvider;