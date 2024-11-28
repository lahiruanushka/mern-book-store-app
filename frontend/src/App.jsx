import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/authSlice";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import ManageOrders from "./components/admin/ManageOrders";
import ManageBooks from "./components/admin/ManageBooks";
import ManageUsers from "./components/admin/ManageUsers";
import Dashboard from "./components/admin/Dashboard";
import DashboardPage from "./pages/admin/DashboardPage";
import UnauthorizePage from "./pages/UnauthorizePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import OrderProcessingPage from "./pages/OrderProcessingPage";
import OrdersPage from "./pages/OrdersPage";

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        dispatch(logout());
      }
      // @Todo: Add API call to verify token
      // try {
      //   await auth.verifyToken();
      // } catch (err) {
      //   dispatch(logout());
      // }
    };

    verifyAuth();
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <LoginPage />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <RegisterPage />
            </RedirectIfLoggedIn>
          }
        />

        {/* Protected Route */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <OrderProcessingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <DashboardPage />
            </ProtectedRouteAdmin>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Unauthorize Routes */}
        <Route path="/unauthorized" element={<UnauthorizePage />} />

        {/* Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
