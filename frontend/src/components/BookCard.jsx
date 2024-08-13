import { Link } from "react-router-dom";

const BookCard = ({ book, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <Link
            to={`/books/${book._id}`}
            className="hover:text-blue-600 hover:underline"
          >
            {book.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-1">by {book.author}</p>
        <p className="text-gray-500">Published: {book.publishYear}</p>
      </div>
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <Link
          to={`/edit-book/${book._id}`}
          className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition duration-200"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(book._id)}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;
