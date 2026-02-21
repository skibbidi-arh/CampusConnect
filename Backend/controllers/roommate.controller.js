const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createListing = async (req, res) => {
    try {
        const { area, fullAddress, floor, currentStudents, studentsInfo, rent, facilities, phone_number, isGirlsOnly } = req.body;
        const userId = req.verifiedUser.user_id;

        const newListing = await prisma.roommateListing.create({
            data: {
                area,
                fullAddress,
                floor,
                currentStudents: parseInt(currentStudents),
                studentsInfo,
                rent: parseInt(rent),
                facilities,
                phone_number,
                isGirlsOnly: Boolean(isGirlsOnly),
                postedBy: userId
            }
        });

        res.status(201).json({ success: true, listing: newListing });
    } catch (error) {
        console.error("CREATE ERROR:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const listings = await prisma.roommateListing.findMany({
            include: {
                user: {
                    select: { user_name: true }
                }
            },
            orderBy: { postedDate: 'desc' }
        });


        const formatted = listings.map(listing => ({
            ...listing,
            userName: listing.user.user_name
        }));

        res.status(200).json({ success: true, listings: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching listings" });
    }
};
exports.deleteListing = async (req, res) => {
    try {
        const listingId = parseInt(req.params.id);
        const userId = req.verifiedUser.user_id;

        const listing = await prisma.roommateListing.findUnique({
            where: { id: listingId }
        });

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        if (listing.postedBy !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this ad" });
        }

        await prisma.roommateListing.delete({
            where: { id: listingId }
        });

        res.status(200).json({ success: true, message: "Listing cancelled successfully" });
    } catch (error) {
        console.error("DELETE ERROR:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};