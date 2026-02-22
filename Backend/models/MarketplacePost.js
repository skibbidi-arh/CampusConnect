const mongoose = require('mongoose');

const marketplacePostSchema = new mongoose.Schema({
  sellerId: {
    type: Number, // Maps to the Postgres `users_id`
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Home items',
      'Laptop, PC and PC parts',
      'Books, Study materials',
      'Bikes and cycles',
      'Others'
    ]
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String], // Array of base64 strings or URLs
    default: []
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  phone_number: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Payment Done'],
    default: 'Pending'
  },
  buyerId: {
    type: Number, // The user who marked 'Payment Done'
    default: null
  },
  buyerName: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const MarketplacePost = mongoose.model('MarketplacePost', marketplacePostSchema);

module.exports = MarketplacePost;
