import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AContext = createContext(null)
export const AuthContext = () => { return useContext(AContext) }

const AutoAuth = ({ children }) => {

    useEffect(() => {
        if (User === null) {
            const tempUser = JSON.parse(localStorage.getItem('user'));
            if (tempUser !== null) {
                setUser(tempUser)
            }
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
        // Optionally redirect the user after logout
        return
    }

    // New function to fetch or verify the current user from the server
    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            // NOTE: Replace with your actual backend route path if different
            const response = await axios.get('http://localhost:4000/api/auth/me', {
                withCredentials: true // Important for sending cookies/JWTs
            });

            const verifiedUser = response.data.user;

            if (verifiedUser) {
                setUser(verifiedUser);
                localStorage.setItem('user', JSON.stringify(verifiedUser));
                return verifiedUser;
            } else {
                // Handle case where server returns 200 but no user data
                logout();
                return null;
            }
        } catch (error) {
            // Typically handles 401 Unauthorized or other network errors
            console.error("Failed to fetch current user:", error);
            // If the user's session is invalid, clear storage and log out
            logout();
            return null;
        } finally {
            setLoading(false);
        }
    };

    const [User, setUser] = useState(null)
    const [loading, setLoading] = useState(false)


    return (
        <AContext.Provider value={{ loading, setLoading, User, setUser, logout, fetchCurrentUser }} >{children}</AContext.Provider>
    )
}

export default AutoAuth