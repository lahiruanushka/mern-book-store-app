# BookWhiz 📚

BookWhiz is a MERN-based bookstore application that provides users with a seamless platform to browse, manage their cart and wishlist, and order books. While the application currently supports essential e-commerce functionalities, additional features such as payment integration, notifications, user profile management, and dashboard statistics are planned for future development.

## Screenshots 🖼️

### User Authentication
![Login Screen](/screenshots/login.png)
*Secure login page with intuitive design*

### Customer Dashboard
![Customer Home](/screenshots/customer-home.png)
*Browse and explore book collections*

### Cart Management
![Shopping Cart](/screenshots/cart.png)
*Easy cart management with clear item details*

### Wishlist
![Wishlist](/screenshots/wishlist.png)
*Save and manage favorite books*

### Admin Dashboard
![Admin Books Management](/screenshots/admin-books.png)
*Comprehensive book inventory management*

---

## Features 🚀

### Customers:
- **User Registration and Login:** Secure token-based authentication for a seamless experience.
- **Cart Management:** Easily add, remove, and modify items in the cart.
- **Wishlist:** Save favorite books for future purchases.
- **Order Books:** Place orders effortlessly (payment functionality coming soon).
- **Role-Based Actions:** Customer-specific actions tailored to user needs.

### Admin:
- **Manage Books:** Add, update, or remove books from the inventory.
- **Manage Users:** View and manage customer profiles.
- **Order Management:** Update the status of customer orders.
- **Role-Based Access:** Administrative privileges to perform advanced operations.

---

## Tech Stack 🛠️

### Frontend:
- **React.js**: Dynamic user interface.
- **Material-UI (MUI)**: Modern, responsive design.
- **Redux**: State management for a seamless user experience.

### Backend:
- **Node.js**: Scalable and efficient backend server.
- **Express.js**: Fast and robust API development.
- **MongoDB**: NoSQL database for efficient data management.
- **JWT (JSON Web Token)**: Secure token-based authentication.
- **Role-Based Authorization:** Different functionalities for admin and customers.

---

## Planned Features 📝
- **Payment Integration:** Secure payment options for order completion.
- **User Notifications:** Real-time updates for orders and offers.
- **Dashboard Statistics:** Insights into sales, users, and orders for admin.
- **Profile Management:** Enhanced user profile customization.

---

## Installation & Setup 🛠️

1. Clone the repository:
   ```bash
   git clone https://github.com/lahiruanushka/mern-book-store-app.git
   cd mern-book-store-app
   ```

2. Install dependencies:
   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```

3. Create environment files:
   - **Backend**: Create a `.env` file in the `backend` folder with the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend
   npm start
   ```

5. Open the application in your browser at `http://localhost:3000`.


## API Endpoints 🛤️

### Authentication:
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Log in a user.

### Cart & Wishlist:
- **GET** `/api/cart` - Fetch user cart.
- **POST** `/api/cart` - Add items to the cart.
- **GET** `/api/wishlist` - Fetch wishlist items.
- **POST** `/api/wishlist` - Add items to the wishlist.

### Orders:
- **GET** `/api/orders` - Fetch user orders.
- **POST** `/api/orders` - Place an order.

### Admin:
- **GET** `/api/users` - Fetch all users.
- **POST** `/api/books` - Add a book.
- **PUT** `/api/orders/:id` - Update order status.

---

## Project Structure 📂

```
BookWhiz/
├── backend/        # Node.js and Express backend
├── frontend/       # React frontend
├── screenshots/    # Application UI screenshots
├── README.md       # Project documentation
└── .gitignore      # common .gitignore file
```

---

## Contributing 🤝
Contributions are welcome! If you find a bug or have a feature suggestion, please:
1. Open an issue describing the problem or enhancement
2. Fork the repository
3. Create a new branch for your feature
4. Submit a pull request with a clear description of changes

---

## License 📝
This project is licensed under the [MIT License](LICENSE).

---

## Contact 📬
Feel free to reach out for any queries or suggestions:
- **Name**: Lahiru Anushka
- **GitHub**: [github.com/lahiruanushka](https://github.com/lahiruanushka)
- **Email**: [lahiruanushkaofficial@gmail.com](mailto:lahiruanushkaofficial@gmail.com)
