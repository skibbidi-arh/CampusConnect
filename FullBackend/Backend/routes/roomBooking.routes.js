const express = require('express');
const router = express.Router();
const roommateController = require('../controllers/roommate.controller');
const { verifyToken } = require('../middleware/VerifyToken');

router.get('/all', roommateController.getAllListings);


router.post('/create', verifyToken, roommateController.createListing);
router.delete('/delete/:id', verifyToken, roommateController.deleteListing);
module.exports = router;