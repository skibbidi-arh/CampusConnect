import { useState, useEffect, useMemo } from 'react'
import { AlertCircle, Phone, MapPin, Calendar, X, Trash2, Filter } from 'lucide-react'
import { useRecieverContext } from '../../../context/RecieverContext'
import { useDonorContext } from '../../../context/DonorContext'
import { AuthContext } from '../../../context/AuthContext'
import axios from 'axios'

export default function BloodRequests() {
    const { User } = AuthContext();
    const currentUserEmail = User?.email || User?.user?.email;

    const {
        recievers: contextRequests, // Source of truth from context
        recieverLoading,
        recieverError,
        fetchRecievers // Function to refresh data
    } = useRecieverContext()

    const { isRegisteredDonor } = useDonorContext()

    // 1. Filter States
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
    const [searchLocation, setSearchLocation] = useState('');
    const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
    const [minDueDate, setMinDueDate] = useState(''); // New state for filtering by date

    // Local State for Display Array (Filtering target)
    const [filteredRequests, setFilteredRequests] = useState([]);

    // Other States
    const [isCancelling, setIsCancelling] = useState(null); 
    const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


    // 2. Initial Data Fetch (Runs once on component mount or user change)
    useEffect(() => {
        // Fetch only if the context hasn't loaded data yet
        if (!contextRequests || contextRequests.length === 0) {
            fetchRecievers()
        }
    }, [fetchRecievers])

    // 3. EFFECTIVE FILTERING: Runs ONLY when the source data or filters change
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Current date for comparison

        const processedList = (contextRequests ?? []).filter(request => {
            
            // Filter 1: Blood Group
            const matchesBloodGroup = selectedBloodGroup === 'all' || request.blood_group === selectedBloodGroup;
            
            // Filter 2: Location Search
            const locationMatch = request.location 
                ? request.location.toLowerCase().includes(searchLocation.toLowerCase())
                : false;
                
            // Filter 3: Emergency Status
            const matchesEmergency = !showEmergencyOnly || request.is_emergency;

            // Filter 4: Due Date (Only show requests due on or after the selected min date)
            const matchesDueDate = !minDueDate || (request.deadline && request.deadline >= minDueDate);
            
            // Ensure requests that are already past due are filtered out, or just focus on the minDueDate.
            // For simplicity, we'll ensure the request is not explicitly in the past if no min date is set.
            const isFutureOrToday = !request.due_date || request.due_date >= today;

            return matchesBloodGroup && locationMatch && matchesEmergency && matchesDueDate && isFutureOrToday;
        });

        setFilteredRequests(processedList);
    }, [contextRequests, selectedBloodGroup, searchLocation, showEmergencyOnly, minDueDate]);

    // 4. Cancellation Handler (Adjusted URL to /cancel/)
    const handleCancelRequest = async (requestId) => {
        if (!window.confirm("Are you sure you want to cancel this blood request?")) {
            return;
        }

        setIsCancelling(requestId);
        try {
            console.log("Cancelling request with ID:", requestId);
            
            // Using the agreed-upon /cancel/ endpoint for better semantic DELETE operation
            await axios.delete(`http://localhost:4000/api/request/cancel/${requestId}`, {
                withCredentials: true
            });

            // Refresh the list from the context after successful deletion
            await fetchRecievers();

        } catch (error) {
            console.error("Error cancelling request:", error.response?.data?.message || error.message);
            alert(`Failed to cancel request: ${error.response?.data?.message || 'Server error.'}`);
        } finally {
            setIsCancelling(null);
        }
    };

    if (recieverLoading) {
        return <div className="text-center py-12 text-lg font-semibold text-gray-700">Loading blood requests...</div>
    }

    if (recieverError) {
        return <div className="text-center py-12 text-lg font-semibold text-red-600">Error fetching requests: {recieverError}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Blood Requests</h2>

                {/* --- FILTER SECTION --- */}
                <div className="rounded-2xl bg-white p-4 shadow-md flex flex-wrap gap-4 items-center">
                    <Filter className="h-5 w-5 text-gray-500" />
                    
                    {/* Blood Group Filter */}
                    <select
                        value={selectedBloodGroup}
                        onChange={(e) => setSelectedBloodGroup(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                    >
                        {bloodGroups.map(group => (
                            <option key={group} value={group}>
                                {group === 'all' ? 'All Groups' : group}
                            </option>
                        ))}
                    </select>

                    {/* Location Search Input */}
                    <input
                        type="text"
                        placeholder="Location..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 w-32 sm:w-auto"
                    />

                    {/* Due Date Filter */}
                    <input
                        type="date"
                        value={minDueDate}
                        onChange={(e) => setMinDueDate(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 w-32 sm:w-auto"
                        title="Filter by Minimum Due Date"
                    />

                    {/* Emergency Filter */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="emergencyFilter"
                            checked={showEmergencyOnly}
                            onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
                        />
                        <label htmlFor="emergencyFilter" className="cursor-pointer text-sm font-medium text-gray-700">
                            Emergency
                        </label>
                    </div>
                </div>
                {/* --- END FILTER SECTION --- */}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
            </div>

            {/* Blood Requests List */}
            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-lg text-gray-600">No blood requests found matching your filters.</p>
                    </div>
                ) : (
                    filteredRequests.map((request) => {
                        const isCurrentUserRequest = request.email === currentUserEmail;

                        // Use request_id or a fallback for the key and ID
                        const reqId = request.request_id || request.id; 
                        const currentlyCancelling = isCancelling === reqId;
                        const dueDate = request.deadline ? new Date(request.deadline).toLocaleDateString
                        
                        ('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                        }) : {dueDate};


                        return (
                            <div
                                key={reqId}
                                className={`rounded-2xl border-l-4 p-6 shadow-lg transition hover:shadow-xl ${
                                    request.is_emergency
                                        ? 'border-[#e50914] bg-gradient-to-r from-red-50 to-pink-50'
                                        : 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-3 flex items-center gap-3">
                                            <span className="inline-block rounded-full bg-[#e50914] px-4 py-1 text-lg font-bold text-white">
                                                {request.blood_group}
                                            </span>
                                            {request.is_emergency && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                                    <AlertCircle className="h-3 w-3" />
                                                    EMERGENCY
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold text-gray-800">
                                            {request.user_name || request.requester}
                                            {isCurrentUserRequest && (
                                                <span className="ml-2 text-sm text-blue-600">(Your Request)</span>
                                            )}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-[#e50914]" />
                                                <span className="font-semibold">{request.phone_number || request.contact}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-[#e50914]" />
                                                <span>{request.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-[#e50914]" />
                                                <span>Needed by: {dueDate}</span>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-gray-500">{request.timePosted || 'Recently posted'}</p>
                                    </div>

                                    {/* Conditional Buttons */}
                                    {isCurrentUserRequest ? (
                                        <button
                                            onClick={() => handleCancelRequest(reqId)}
                                            className="ml-4 flex items-center justify-center gap-2 rounded-full bg-gray-500 px-4 py-2 font-semibold text-white shadow-lg transition hover:bg-gray-600 disabled:opacity-50"
                                            disabled={currentlyCancelling}
                                        >
                                            {currentlyCancelling ? (
                                                'Cancelling...'
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4" />
                                                    Cancel Request
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        isRegisteredDonor && (
                                            <button className="ml-4 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-2 font-semibold text-white shadow-lg transition hover:shadow-xl">
                                                Contact
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}