import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    isbn: { type: String, unique: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    category: [String],
    publishYear: {
      type: Number,
      required: true,
    },
    imageUrl: String,
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        review: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Book', bookSchema);
