import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 

const DonorContext = createContext(null);

export const useDonorContext = () => {
    return useContext(DonorContext);
};

const DonorProvider = ({ children }) => {
    const { User } = AuthContext();
    
    // 🛑 REMOVED THE CRASHING LINE: if(User===null){return null;}
    
    // Use the AuthContext status directly to determine user's email
    const currentUserEmail = User?.email || User?.user?.email;

    const [donors, setDonors] = useState([]);
    const [isRegisteredDonor, setIsRegisteredDonor] = useState(false);
    const [donorLoading, setDonorLoading] = useState(true);
    const [donorError, setDonorError] = useState(null);

    // FIX 1: Wrap fetchDonorsAndCheckStatus in useCallback to stabilize the function.
    const fetchDonorsAndCheckStatus = useCallback(async () => {
        
        // 🚨 ADDED GUARD: Do not run fetch if there is no logged-in email.
        if (!currentUserEmail) {
            setDonorLoading(false);
            return;
        }

        setDonorLoading(true);
        setDonorError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/donor/getAllDonors', {
                withCredentials: true
            });
            const donorList = response.data.donors;
            console.log('Fetched Donors:', donorList);
            
            const isDonor = donorList.some(
                donor => (donor.email || donor.user?.email || donor.contact?.email) === currentUserEmail
            );

            setDonors(donorList);
            setIsRegisteredDonor(isDonor);
            setDonorLoading(false);
            
        } catch (error) {
            setDonorError(error.response?.data?.message || 'Failed to fetch donor list');
            setDonorLoading(false);
            setDonors([]);
            setIsRegisteredDonor(false);
        }
    }, [currentUserEmail]); 
    
    // FIX 2: Wrap toggleDonorStatus in useCallback.
    const toggleDonorStatus = useCallback(async () => {
        
        // 🚨 ADDED GUARD
        if (!currentUserEmail) {
            throw new Error("Cannot toggle status: User not logged in.");
        }

        setDonorLoading(true);
        setDonorError(null);
        try {
            const response = await axios.put('http://localhost:4000/api/donor/toggleDonorStatus', {}, {
                withCredentials: true
            });
            
            await fetchDonorsAndCheckStatus(); 
            console.log('Toggled Donor Status:', response.data);
            
            return response.data;

        } catch (error) {
            setDonorLoading(false);
            const msg = error.response?.data?.message || 'Failed to toggle status';
            setDonorError(msg);
            throw new Error(msg);
        }
    }, [fetchDonorsAndCheckStatus, currentUserEmail]); // Added currentUserEmail dependency

    // This useEffect is now safe because fetchDonorsAndCheckStatus is stable and has guards.
    useEffect(() => {
        if (currentUserEmail) {
            fetchDonorsAndCheckStatus();
        } else {
            // Reset state if user logs out or is null on first load
            setDonors([]);
            setIsRegisteredDonor(false);
            setDonorLoading(false);
        }
    }, [currentUserEmail, fetchDonorsAndCheckStatus]);

    return (
        <DonorContext.Provider 
            value={{
                donors,
                isRegisteredDonor,
                donorLoading,
                donorError,
                fetchDonorsAndCheckStatus,
                toggleDonorStatus,
                setDonors
            }}
        >
            {children}
        </DonorContext.Provider>
    );
};

export default DonorProvider;