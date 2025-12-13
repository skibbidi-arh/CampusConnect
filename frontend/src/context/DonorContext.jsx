import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // <-- MUST import useCallback
import axios from 'axios';
import { AuthContext } from './AuthContext'; 

const DonorContext = createContext(null);

export const useDonorContext = () => {
    return useContext(DonorContext);
};

const DonorProvider = ({ children }) => {
    const { User } = AuthContext();
    if(User===null){return null;}
    const currentUserEmail = User?.email || User?.user?.email;

    const [donors, setDonors] = useState([]);
    const [isRegisteredDonor, setIsRegisteredDonor] = useState(false);
    const [donorLoading, setDonorLoading] = useState(true);
    const [donorError, setDonorError] = useState(null);

    // FIX 1: Wrap fetchDonorsAndCheckStatus in useCallback to stabilize the function.
    const fetchDonorsAndCheckStatus = useCallback(async () => {
        setDonorLoading(true);
        setDonorError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/donor/getAllDonors', {
                withCredentials: true
            });
            const donorList = response.data.donors;
            console.log('Fetched Donors:', donorList);
            
            // NOTE: currentUserEmail is used inside this function, but since it comes from AuthContext,
            // we should assume AuthContext is stable and doesn't change on every render.
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
    // CRITICAL: Depend on currentUserEmail since it's used inside the function logic.
    // However, if AuthContext is causing a re-render where currentUserEmail changes 
    // identity even when the value is the same, you have a deeper AuthContext issue.
    // We assume here currentUserEmail only changes when the user truly logs in/out.
    }, [currentUserEmail]); 
    
    // FIX 2: Wrap toggleDonorStatus in useCallback.
    const toggleDonorStatus = useCallback(async () => {
        setDonorLoading(true);
        setDonorError(null);
        try {
            const response = await axios.put('http://localhost:4000/api/donor/toggleDonorStatus', {}, {
                withCredentials: true
            });
            
            // Re-fetch data immediately after successful toggle
            await fetchDonorsAndCheckStatus(); 
            console.log('Toggled Donor Status:', response.data);
            
            return response.data;

        } catch (error) {
            setDonorLoading(false);
            const msg = error.response?.data?.message || 'Failed to toggle status';
            setDonorError(msg);
            throw new Error(msg);
        }
    // CRITICAL: Depend on stable fetchDonorsAndCheckStatus
    }, [fetchDonorsAndCheckStatus]); 

    // This useEffect is now safe because fetchDonorsAndCheckStatus is stable.
    useEffect(() => {
        if (currentUserEmail) {
            fetchDonorsAndCheckStatus();
        } else {
            setDonors([]);
            setIsRegisteredDonor(false);
            setDonorLoading(false);
        }
    // CRITICAL: Depend on currentUserEmail and the stable fetch function
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