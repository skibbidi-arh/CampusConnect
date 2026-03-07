const MarketplacePost = require('../models/MarketplacePost');
const prisma = require('../src/config/prisma');

// @desc    Create a new post
// @route   POST /api/marketplace
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, category, description, images, location, price, phone_number, preOrderEnabled } = req.body;

        // User ID comes from auth middleware, mapped to users_id in postgres
        const sellerId = req.verifiedUser.user_id;
        const sellerName = req.verifiedUser.email || 'Anonymous'; // fallback

        if (!title || !category || !description || price === undefined || !phone_number) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const newPost = new MarketplacePost({
            sellerId,
            sellerName,
            title,
            category,
            description,
            images: images || [],
            location: location || 'N/A',
            price,
            phone_number,
            preOrderEnabled: preOrderEnabled || false,
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

        // Fetch seller details from Users table
        const seller = await prisma.users.findUnique({
            where: { users_id: post.sellerId },
            select: {
                user_name: true,
                email: true,
                dept: true,
                batch: true
            }
        });

        // Add seller details to post object
        const postWithSellerDetails = {
            ...post.toObject(),
            sellerUsername: seller?.user_name || 'N/A',
            sellerEmail: seller?.email || 'N/A',
            sellerDept: seller?.dept || 'N/A',
            sellerBatch: seller?.batch || 'N/A'
        };

        res.status(200).json({ success: true, post: postWithSellerDetails });
    } catch (error) {
        console.error('Error in getPostById:', error);
        res.status(500).json({ success: false, message: 'Server error fetching post' });
    }
};

// @desc    Update a post (only if user is the seller)
// @route   PUT /api/marketplace/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
        }

        const { title, category, description, images, location, price, phone_number, preOrderEnabled } = req.body;

        // Update fields if provided
        if (title !== undefined) post.title = title;
        if (category !== undefined) post.category = category;
        if (description !== undefined) post.description = description;
        if (images !== undefined) post.images = images;
        if (location !== undefined) post.location = location;
        if (price !== undefined) post.price = price;
        if (phone_number !== undefined) post.phone_number = phone_number;
        if (preOrderEnabled !== undefined) post.preOrderEnabled = preOrderEnabled;

        const updatedPost = await post.save();
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error in updatePost:', error);
        res.status(500).json({ success: false, message: 'Server error updating post' });
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

// @desc    Submit a pre-order with transaction ID
// @route   POST /api/marketplace/:id/pre-order
// @access  Private
const submitPreOrder = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const userName = req.verifiedUser.email || 'Anonymous';
        const { transactionId } = req.body;

        if (!transactionId || transactionId.trim() === '') {
            return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (!post.preOrderEnabled) {
            return res.status(400).json({ success: false, message: 'Pre-order is not enabled for this item' });
        }

        if (post.sellerId === userId) {
            return res.status(400).json({ success: false, message: 'You cannot pre-order your own item' });
        }

        // Check if user already has a pre-order
        const existingPreOrder = post.preOrders.find(po => po.userId === userId);
        if (existingPreOrder) {
            return res.status(400).json({ success: false, message: 'You have already submitted a pre-order for this item' });
        }

        // Add pre-order
        post.preOrders.push({
            userId,
            userName,
            transactionId: transactionId.trim()
        });

        const updatedPost = await post.save();
        res.status(200).json({ success: true, post: updatedPost, message: 'Pre-order submitted successfully' });
    } catch (error) {
        console.error('Error in submitPreOrder:', error);
        res.status(500).json({ success: false, message: 'Server error submitting pre-order' });
    }
};

// @desc    Verify a pre-order (seller only)
// @route   PUT /api/marketplace/:id/pre-order/:preOrderId/verify
// @access  Private
const verifyPreOrder = async (req, res) => {
    try {
        const sellerId = req.verifiedUser.user_id;
        const { id, preOrderId } = req.params;

        const post = await MarketplacePost.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: 'Not authorized to verify pre-orders for this post' });
        }

        const preOrder = post.preOrders.id(preOrderId);
        if (!preOrder) {
            return res.status(404).json({ success: false, message: 'Pre-order not found' });
        }

        preOrder.verified = true;
        const updatedPost = await post.save();

        res.status(200).json({ success: true, post: updatedPost, message: 'Pre-order verified successfully' });
    } catch (error) {
        console.error('Error in verifyPreOrder:', error);
        res.status(500).json({ success: false, message: 'Server error verifying pre-order' });
    }
};

// @desc    Mark product as ready (seller only)
// @route   PUT /api/marketplace/:id/mark-ready
// @access  Private
const markProductReady = async (req, res) => {
    try {
        const sellerId = req.verifiedUser.user_id;
        const { collectionLocation } = req.body;
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
        }

        if (!post.preOrderEnabled) {
            return res.status(400).json({ success: false, message: 'This is not a pre-order item' });
        }

        if (!collectionLocation || !collectionLocation.trim()) {
            return res.status(400).json({ success: false, message: 'Collection location is required' });
        }

        post.productStatus = 'ready';
        post.collectionLocation = collectionLocation;
        const updatedPost = await post.save();

        res.status(200).json({ success: true, post: updatedPost, message: 'Product marked as ready' });
    } catch (error) {
        console.error('Error in markProductReady:', error);
        res.status(500).json({ success: false, message: 'Server error marking product as ready' });
    }
};

// @desc    Get all pre-orders for a post (seller only)
// @route   GET /api/marketplace/:id/pre-orders
// @access  Private
const getPreOrders = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        const post = await MarketplacePost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Allow seller to view all pre-orders, or buyers to view their own
        if (post.sellerId !== userId) {
            // Check if the user has a pre-order
            const userPreOrder = post.preOrders.find(po => po.userId === userId);
            if (!userPreOrder) {
                return res.status(403).json({ success: false, message: 'Not authorized to view pre-orders for this post' });
            }
            // Return only user's own pre-order
            return res.status(200).json({ success: true, preOrders: [userPreOrder], productStatus: post.productStatus });
        }

        // Seller can see all pre-orders
        res.status(200).json({ success: true, preOrders: post.preOrders, productStatus: post.productStatus });
    } catch (error) {
        console.error('Error in getPreOrders:', error);
        res.status(500).json({ success: false, message: 'Server error fetching pre-orders' });
    }
};

// @desc    Get all orders made by the user
// @route   GET /api/marketplace/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const userId = req.verifiedUser.user_id;
        
        // Find all posts where the user has a pre-order
        const posts = await MarketplacePost.find({
            'preOrders.userId': userId
        }).sort({ updatedAt: -1 });

        // Map posts to include only relevant user's pre-order info
        const orders = posts.map(post => {
            const userPreOrder = post.preOrders.find(po => po.userId === userId);
            return {
                postId: post._id,
                title: post.title,
                price: post.price,
                category: post.category,
                images: post.images,
                sellerName: post.sellerName,
                phone_number: post.phone_number,
                location: post.location,
                productStatus: post.productStatus,
                collectionLocation: post.collectionLocation,
                preOrder: userPreOrder,
                createdAt: post.createdAt
            };
        });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error in getMyOrders:', error);
        res.status(500).json({ success: false, message: 'Server error fetching your orders' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost,
    submitPreOrder,
    verifyPreOrder,
    markProductReady,
    getPreOrders,
    getMyOrders
};
