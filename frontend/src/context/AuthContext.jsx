import axios from 'axios'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AContext = createContext(null)
export const AuthContext = () => { return useContext(AContext) }

const AutoAuth = ({ children }) => {

    const [User, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const logout = useCallback(() => {
        sessionStorage.removeItem('authToken') 
        setUser(null)
        setLoading(false)
    }, [])

    const fetchCurrentUser = useCallback(async () => {
        setLoading(true);
        const token = sessionStorage.getItem('authToken'); 
        
        if (!token) {
            setUser(null);
            setLoading(false);
            return null;
        }
        console.log(token)
        try {
            console.log(token)
            const response = await axios.get('http://localhost:4000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            console.log(response)
            const verifiedUser = response.data.user;

            if (verifiedUser) {
                setUser(verifiedUser);
                return verifiedUser;
            } else {
                logout(); 
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch current user:", error);
            logout();
            return null;
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        fetchCurrentUser();
        console.log(User)
    }, [fetchCurrentUser])


    return (
        <AContext.Provider value={{ loading, setLoading, User, setUser, logout, fetchCurrentUser }} >{children}</AContext.Provider>
    )
}

export default AutoAuth