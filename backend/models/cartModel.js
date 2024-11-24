import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, default: 1 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Cart', cartSchema);