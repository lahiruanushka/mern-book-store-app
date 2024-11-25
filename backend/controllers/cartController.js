import Cart from "../models/cartModel.js";

export const cartController = {
    // Get user's cart
    getCart: async (req, res) => {
        try {
            let cart = await Cart.findOne({
                user: req.user.userId
            }).populate('items.book');
            
            if (!cart) {
                cart = new Cart({
                    user: req.user.userId,
                    items: []
                });
                await cart.save();
            }
            res.json(cart);
        } catch (error) {
            console.error('Get cart error:', error);
            res.status(500).json({
                message: error.message
            });
        }
    },

    // Add to cart
    addToCart: async (req, res) => {
        try {
            const { bookId, quantity = 1 } = req.body;

            // Validate inputs
            if (!bookId) {
                return res.status(400).json({
                    message: 'Book ID is required'
                });
            }

            // Find or create cart
            let cart = await Cart.findOne({
                user: req.user.userId
            });

            if (!cart) {
                cart = new Cart({
                    user: req.user.userId,
                    items: []
                });
            }

            // Convert bookId to string safely
            const bookIdString = bookId.toString();

            // Find item in cart
            const itemIndex = cart.items.findIndex(item => 
                item.book && item.book.toString() === bookIdString
            );

            // Update or add item
            if (itemIndex > -1) {
                // Update existing item
                cart.items[itemIndex].quantity += Number(quantity) || 1;
            } else {
                // Add new item
                cart.items.push({
                    book: bookIdString,
                    quantity: Number(quantity) || 1
                });
            }

            // Save and return updated cart
            await cart.save();
            
            // Return populated cart
            const populatedCart = await Cart.findById(cart._id).populate('items.book');
            res.json(populatedCart);

        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(400).json({
                message: error.message || 'Error adding item to cart'
            });
        }
    },

    // Remove from cart
    removeFromCart: async (req, res) => {
        try {
            const { bookId } = req.params;

            if (!bookId) {
                return res.status(400).json({
                    message: 'Book ID is required'
                });
            }

            let cart = await Cart.findOne({
                user: req.user.userId
            });

            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found'
                });
            }

            // Filter out the item safely
            cart.items = cart.items.filter(item => 
                item.book && item.book.toString() !== bookId.toString()
            );

            await cart.save();
            const populatedCart = await Cart.findById(cart._id).populate('items.book');
            res.json(populatedCart);

        } catch (error) {
            console.error('Remove from cart error:', error);
            res.status(400).json({
                message: error.message
            });
        }
    },

    // Update cart item quantity
    updateCartItemQuantity: async (req, res) => {
        try {
            const { bookId } = req.params;
            const { quantity } = req.body;

            if (!bookId) {
                return res.status(400).json({
                    message: 'Book ID is required'
                });
            }

            let cart = await Cart.findOne({
                user: req.user.userId
            });

            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found'
                });
            }

            const itemIndex = cart.items.findIndex(item => 
                item.book && item.book.toString() === bookId.toString()
            );

            if (itemIndex > -1) {
                if (quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].quantity = Number(quantity);
                }
                await cart.save();
                const populatedCart = await Cart.findById(cart._id).populate('items.book');
                res.json(populatedCart);
            } else {
                res.status(404).json({
                    message: 'Item not found in cart'
                });
            }
        } catch (error) {
            console.error('Update cart quantity error:', error);
            res.status(400).json({
                message: error.message
            });
        }
    },

    // Clear cart
    clearCart: async (req, res) => {
        try {
            let cart = await Cart.findOne({
                user: req.user.userId
            });

            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found'
                });
            }

            cart.items = [];
            await cart.save();
            res.json({
                message: 'Cart cleared successfully'
            });
        } catch (error) {
            console.error('Clear cart error:', error);
            res.status(400).json({
                message: error.message
            });
        }
    }
};