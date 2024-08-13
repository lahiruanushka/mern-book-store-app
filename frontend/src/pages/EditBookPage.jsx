import React, { useEffect, useState } from "react";
import { getBook, updateBook } from "../services/bookService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditBookPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBook(id);
        const { title, author, publishYear } = response.data;
        setTitle(title);
        setAuthor(author);
        setPublishYear(publishYear);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await updateBook(id, { title, author, publishYear });
      navigate(`/`);
      toast.success("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="title"
          >
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="author"
          >
            Author:
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="publishYear"
          >
            Publish Year:
          </label>
          <input
            id="publishYear"
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}

export default EditBookPage;
