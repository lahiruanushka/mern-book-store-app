import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">BookStore</Link>
        </h1>
        <nav className="space-x-4 flex flex-wrap mt-2 md:mt-0">
          <Link
            to="/"
            className="hover:bg-blue-700 px-3 py-2 rounded"
          >
            Home
          </Link>
          <Link
            to="/add-book"
            className="hover:bg-blue-700 px-3 py-2 rounded"
          >
            Add Book
          </Link>
          {/* Add more navigation links here */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
