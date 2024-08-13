import React, { useEffect, useState } from 'react';
import { getBook } from '../services/bookService';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBook(id);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <Spinner />;

  if (!book) return <p className="text-center text-gray-500">Book not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
      <p className="text-lg text-gray-700 mb-2"><strong>Author:</strong> {book.author}</p>
      <p className="text-lg text-gray-700"><strong>Published Year:</strong> {book.publishYear}</p>
    </div>
  );
}

export default BookPage;
