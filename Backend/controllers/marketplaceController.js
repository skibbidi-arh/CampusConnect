const MarketplacePost = require('../models/MarketplacePost');

// @desc    Create a new post
// @route   POST /api/marketplace
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, category, description, images, location, price, phone_number } = req.body;

        // User ID comes from auth middleware, mapped to users_id in postgres
        const sellerId = req.verifiedUser.user_id;
        const sellerName = req.verifiedUser.email || 'Anonymous'; // fallback

        if (!title || !category || !description || !location || price === undefined || !phone_number) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const newPost = new MarketplacePost({
            sellerId,
            sellerName,
            title,
            category,
            description,
            images: images || [],
            location,
            price,
            phone_number,
        });

        const savedPost = await newPost.save();
        res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ success: false, message: 'Server error creating post' });
    }
};

// @desc    Get all posts (with optional search and category filters)
// @route   GET /api/marketplace
// @access  Private
const getPosts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = { paymentStatus: 'Pending' }; // Default to show only pending items

        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search on title
        }

        const posts = await MarketplacePost.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error in getPosts:', error);
        res.status(500).json({ success: false, message: 'Server error fetching posts' });
    }
};

// @desc    Get posts by the logged-in user
// @route   GET /api/marketplace/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const posts = await MarketplacePost.find({ sellerId: userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error in getMyPosts:', error);
        res.status(500).json({ success: false, message: 'Server error fetching your posts' });
    }
};

// @desc    Get single post by ID
// @route   GET /api/marketplace/:id
// @access  Private
const getPostById = async (req, res) => {
    try {
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Error in getPostById:', error);
        res.status(500).json({ success: false, message: 'Server error fetching post' });
    }
};

// @desc    Delete a post (only if user is the seller)
// @route   DELETE /api/marketplace/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        // Use deleteOne on the model or the document
        await MarketplacePost.deleteOne({ _id: post._id });
        res.status(200).json({ success: true, message: 'Post removed' });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({ success: false, message: 'Server error deleting post' });
    }
};

// @desc    Buyer marks payment as done
// @route   PUT /api/marketplace/:id/payment-done
// @access  Private
const markPaymentDone = async (req, res) => {
    try {
        const buyerId = req.verifiedUser.user_id;
        const buyerName = req.verifiedUser.email || 'Anonymous';
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId === buyerId) {
            return res.status(400).json({ success: false, message: 'You cannot buy your own item' });
        }

        post.paymentStatus = 'Payment Done';
        post.buyerId = buyerId;
        post.buyerName = buyerName;

        const updatedPost = await post.save();
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error in markPaymentDone:', error);
        res.status(500).json({ success: false, message: 'Server error updating payment status' });
    }
};

// @desc    Seller confirms payment
// @route   PUT /api/marketplace/:id/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
    try {
        const sellerId = req.verifiedUser.user_id;
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: 'Not authorized to confirm payment for this post' });
        }

        if (post.paymentStatus !== 'Payment Done') {
            return res.status(400).json({ success: false, message: 'Payment must be marked as done by buyer first' });
        }

        // If payment confirmed, the item is sold and can be deleted from active listings
        await MarketplacePost.deleteOne({ _id: post._id });

        res.status(200).json({ success: true, message: 'Payment confirmed and post removed' });
    } catch (error) {
        console.error('Error in confirmPayment:', error);
        res.status(500).json({ success: false, message: 'Server error confirming payment' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    getPostById,
    deletePost,
    markPaymentDone,
    confirmPayment
};
