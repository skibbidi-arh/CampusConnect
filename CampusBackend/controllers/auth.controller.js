const bcrypt = require('bcrypt');
const prisma = require('../src/config/prisma.js')
const generateJWT = require('../middleware/auth.middleware.js');
const adminAuth = require('../firebase.js'); // imported correctly
const e = require('express');

exports.googleSignin = async (req, res) => {
    const firebaseIdToken = req.body.token;
    const REQUIRED_DOMAIN = 'iut-dhaka.edu';

    if (!firebaseIdToken) {
        return res.status(400).json({ error: 'Token is missing.' });
    }

    try {
        // VALIDATED UNDER NEW SDK
        const decodedToken = await adminAuth.verifyIdToken(firebaseIdToken);

        const userEmail = decodedToken.email;
        const firebaseUID = decodedToken.uid;

        const domain = userEmail.split('@').pop();

        // if (domain !== REQUIRED_DOMAIN) {
        //     await adminAuth.revokeRefreshTokens(firebaseUID);
        //     return res.status(403).json({
        //         error: 'Unauthorized Domain',
        //         message: `Only @${REQUIRED_DOMAIN} email allowed.`,
        //     });
        // }

        await generateJWT.generate(decodedToken, res);
        const user = await prisma.users.upsert({
            where: { email: userEmail },

            update: {

                user_name: userEmail.split('@')[0],
            },

            create: {

                user_name: userEmail.split('@')[0],
                email: userEmail
            },

            select: { email: true, user_name: true ,phone_number:true}
        });
        console.log(user)

        res.status(200).json({
            message: "Google Login Successful", user
        });

    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({
            error: "Invalid Firebase token",
            message: error.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        req.cookies['token'] = '';
        console.log('done')
         res.status(200).json({ success: true, message: "Successfully logged out" })
    } catch (error) { 
             res.status(500).json({ success:false, message: "Error while logging out" })

    }



}
exports.getMe = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const user = await prisma.users.findUnique({
            where: { users_id: userId },
            select: {
                users_id: true,
                user_name: true,
                email: true,
                phone_number: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Server error while fetching user data" });
    }
};
