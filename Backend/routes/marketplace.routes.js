const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getMyPosts,
    getPostById,
    deletePost,
    markPaymentDone,
    confirmPayment
} = require('../controllers/marketplaceController');
const { verifyToken } = require('../middleware/VerifyToken');

// Apply verifyToken middleware to all routes in this router
router.use(verifyToken);

// /api/marketplace
router.route('/')
    .post(createPost)
    .get(getPosts);

// /api/marketplace/my-posts
router.route('/my-posts')
    .get(getMyPosts);

// /api/marketplace/:id
router.route('/:id')
    .get(getPostById)
    .delete(deletePost);

// /api/marketplace/:id/payment-done
router.route('/:id/payment-done')
    .put(markPaymentDone);

// /api/marketplace/:id/confirm-payment
router.route('/:id/confirm-payment')
    .put(confirmPayment);

module.exports = router;
