const express = require('express')
const router= express.Router()
const authController = require('../controllers/auth.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const { verifyToken } = require('../middleware/VerifyToken');





router.post('/verify-domain',authController.googleSignin);
router.get('/me',verifyToken,authController.getMe);
router.get('/logout',authController.logout)





module.exports=router