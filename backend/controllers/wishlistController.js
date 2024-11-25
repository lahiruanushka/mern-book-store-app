import Wishlist from "../models/wishlistModel.js"

export const wishlistController = {
    // Get user's wishlist
    getWishlist: async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({
                userId: req.user.userId
            });
            if (!wishlist) {
                return res.json({
                    items: []
                });
            }
            res.json(wishlist);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },
    // Add item to wishlist
    addToWishlist: async (req, res) => {
        try {
            const {
                bookId,
                title,
                price,
            } = req.body;

            let wishlist = await Wishlist.findOne({
                userId: req.user.userId
            });

            if (!wishlist) {
                wishlist = new Wishlist({
                    userId: req.user.userId,
                    items: []
                });
            }
            // Check if item already exists
            if (wishlist.items.find(item => item.bookId.toString() === bookId)) {
                return res.status(400).json({
                    message: 'Item already in wishlist'
                });
            }
            wishlist.items.push({
                bookId,
                title,
                price,
            });
            await wishlist.save();
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Remove item from wishlist
    removeFromWishlist: async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({
                userId: req.user.userId
            });
            if (!wishlist) {
                return res.status(404).json({
                    message: 'Wishlist not found'
                });
            }
            wishlist.items = wishlist.items.filter(item => item.bookId.toString() !== req.params.bookId);
            await wishlist.save();
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}