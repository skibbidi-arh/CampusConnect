const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');

/**
 * Optional authentication middleware
 * Captures user info if token is present, but allows anonymous access
 * Sets req.verifiedUser if authenticated, otherwise leaves it undefined
 */
exports.optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // No auth header = anonymous user, continue without error
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.verifiedUser = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET || 'Blink');
        
        const user = await prisma.users.findUnique({
            where: { email: decode.email },
            select: { users_id: true, email: true, user_name: true }
        });

        if (user) {
            req.verifiedUser = {
                ...decode,
                user_id: user.users_id,
                user_name: user.user_name
            };
        } else {
            req.verifiedUser = null;
        }
        
        next();
    } catch (error) {
        // Invalid token = treat as anonymous
        console.warn("Optional auth: Invalid token, treating as anonymous");
        req.verifiedUser = null;
        next();
    }
};
