const jwt = require('jsonwebtoken');

exports.generate = async (user, res) => {

    const token = jwt.sign({ email: user.email }, 'Blink');

    const isDev = process.env.NODE_ENV !== "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: !isDev ? true : false,       
        sameSite: !isDev ? "None" : "Lax",  
    });

    console.log("TOKEN_SET:", token);
};
