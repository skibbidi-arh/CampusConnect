const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');
exports.verifyToken = async (req, res, next) => {
    const token = req.cookies['token']

    
    if (!token) {
        console.log("Error: No JWT token found in cookies.");
        
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required. No session token found." 
        });
    }

    try {
    
        const decode = jwt.verify(token, 'Blink')
        console.log("TOKEN DECODED:", decode);

       const user = await prisma.users.findUnique({
            where: {
        
                email: decode.email, 
            },
            include: {
                
            },
        });
        decode.user_id= user.users_id
        console.log('ashceh')
        req.verifiedUser = decode
        console.log(decode)
        next()
    }
    catch (error) {
        console.error("Error: Invalid or expired JWT.", error.message);
        res.clearCookie('token'); 
        return res.status(403).json({ 
            success: false, 
            message: "Invalid session. Please log in again." 
        });
    }

}
