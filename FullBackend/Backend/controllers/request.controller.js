// requestController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.createBloodRequest = async (req, res) => {
    // 1. Get User ID from authentication middleware
    const requesterId = req.verifiedUser.user_id; 
    
    // 2. Data received from the frontend form (RequestModal)
    const { blood_group, location, deadline } = req.body; 
    console.log(req.body)

    // 3. Basic Validation
    if (!blood_group || !location || !deadline) {
        return res.status(400).json({ 
            message: 'Missing required fields: blood group, location, and deadline are necessary.' 
        });
    }

    try {
        const deadlineDate = new Date(deadline);
        const now = new Date();
            console.log(deadlineDate, now)
        // Server-side validation for future date (mirroring frontend check)
        if (isNaN(deadlineDate.getTime()) || deadlineDate <= now) {
            return res.status(400).json({
                message: 'Invalid deadline. The requested time must be a valid date in the future.'
            });
        }
        
        // 4. Create the BloodRequest record
        const newRequest = await prisma.bloodRequest.create({
            data: {
                requesterId: requesterId,
                blood_group: blood_group,
                location: location,
                deadline: deadlineDate, // Use the Date object
            },
            // Include user data so the client knows who made the request (for display)
            include: {
                requester: {
                    select: { user_name: true, phone_number: true }
                }
            }
        });

        // 5. Success response
        res.status(201).json({ 
            message: 'Blood request created successfully and is now active.', 
            request: newRequest 
        });

        // ⚠️ NEXT STEP IDEA: After this, trigger a notification service 
        // to alert nearby donors that a request matching their blood group has been created.

    } catch (error) {
        console.error('Error during blood request creation:', error);
        res.status(500).json({ 
            message: 'Could not process blood request due to a server error.' 
        });
    }
};
exports.cancelBloodRequest = async (req, res) => {
    // 1. Get IDs
    const requesterId = req.verifiedUser.user_id; 
    const requestId = parseInt(req.params.requestId); 
    console.log(req.params)

    // Basic validation
    if (isNaN(requestId)) {
        return res.status(400).json({ message: 'Invalid request ID provided for cancellation.' });
    }

    try {
        // 2. Find the request and verify ownership
        const requestToCancel = await prisma.bloodRequest.findUnique({
            where: {
                request_id: requestId,
            },
            select: {
                requesterId: true, // Only need the requester ID for the check
            }
        });

        // 3. Check if the request exists
        if (!requestToCancel) {
            return res.status(404).json({
                message: 'Blood request not found.'
            });
        }
        
        // 4. Authorization check: Ensure the authenticated user is the requester
        if (requestToCancel.requesterId !== requesterId) {
            return res.status(403).json({
                message: 'You are not authorized to cancel this blood request.'
            });
        }

        // 5. Delete the BloodRequest record
        await prisma.bloodRequest.delete({
            where: { 
                request_id: requestId 
            },
        });

        // 6. Success response
        res.status(200).json({ 
            message: `Blood request ID ${requestId} successfully cancelled.`
        });

    } catch (error) {
        console.error('Error during blood request cancellation:', error);
        res.status(500).json({ 
            message: 'Could not process cancellation due to a server error.' 
        });
    }
};
exports.getAllRequests = async (req, res) => {
    try {
        // 1. Query the BloodRequest table and include the related User data.
        const requests = await prisma.bloodRequest.findMany({
            // Order by creation date to show the newest requests first
            orderBy: {
                createdAt: 'desc',
            },
            // Include the requester (User model) to fetch contact details
            include: {
                requester: {
                    select: {
                        users_id: true,
                        user_name: true,
                        phone_number: true, // Crucial for contacting the requester
                        email: true,
                    },
                },
            },
        });

        // 2. Format the data for the frontend
        const formattedRequests = requests.map(req => ({
            requestId: req.request_id,
            blood_group: req.blood_group,
            location: req.location,
            deadline: req.deadline,
            createdAt: req.createdAt,
            
            // Requester/Contact Info
           
                user_name: req.requester.user_name,
                phone_number: req.requester.phone_number,
                email: req.requester.email,
            
        }));

        // 3. Success response
        res.status(200).json({ 
            success: true,
            count: formattedRequests.length,
            requests: formattedRequests 
        });

    } catch (error) {
        console.error('Error retrieving blood request list:', error);
        res.status(500).json({ 
            message: 'Could not retrieve blood request list due to a server error.' 
        });
    }
};