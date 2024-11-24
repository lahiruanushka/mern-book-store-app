import Cart from "../models/cartModel.js"
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
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Add to cart
    addToCart: async (req, res) => {
        try {
            const {
                bookId,
                quantity
            } = req.body;
            let cart = await Cart.findOne({
                user: req.user.userId
            });
            if (!cart) {
                cart = new Cart({
                    user: req.user.userId,
                    items: []
                });
            }
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    book: bookId,
                    quantity
                });
            }
            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },
    removeFromCart: async (req, res) => {
        try {
            const {
                bookId
            } = req.params;
            let cart = await Cart.findOne({
                user: req.user.userId
            });
            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found'
                });
            }
            cart.items = cart.items.filter(item => item.book.toString() !== bookId);
            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },
    updateCartItemQuantity: async (req, res) => {
        try {
            const {
                bookId
            } = req.params;
            const {
                quantity
            } = req.body;
            let cart = await Cart.findOne({
                user: req.user.userId
            });
            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found'
                });
            }
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
            if (itemIndex > -1) {
                if (quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].quantity = quantity;
                }
                await cart.save();
                res.json(cart);
            } else {
                res.status(404).json({
                    message: 'Item not found in cart'
                });
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },
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
            res.status(400).json({
                message: error.message
            });
        }
    },
};