import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import OrderProcessingPage from "./pages/OrderProcessingPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NewReleasesPage from "./pages/NewReleasesPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import UnauthorizePage from "./pages/UnauthorizePage";
import DashboardPage from "./pages/admin/DashboardPage";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import RedirectIfLoggedIn from "./components/auth/RedirectIfLoggedIn";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedRouteAdmin from "./components/auth/ProtectedRouteAdmin";
import AutoScrollToTop from "./components/AutoScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Admin Components
import Dashboard from "./components/admin/Dashboard";
import ManageOrders from "./components/admin/ManageOrders";
import ManageBooks from "./components/admin/ManageBooks";
import ManageUsers from "./components/admin/ManageUsers";
import AuthVerification from "./components/auth/AuthVerification";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthVerification>
        <Header />
        {/* AutoScrollToTop will handle scrolling on route changes */}
        <AutoScrollToTop />

        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="new-releases" element={<NewReleasesPage />} />

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
          <Route
            path="/verify-email/:token"
            element={
              <RedirectIfLoggedIn>
                <VerifyEmailPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/resend-verification"
            element={
              <RedirectIfLoggedIn>
                <ResendVerificationPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectIfLoggedIn>
                <ForgotPasswordPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectIfLoggedIn>
                <ResetPasswordPage />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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

        {/* ScrollToTopButton will appear when scrolling down */}
        <ScrollToTopButton />

        {/* Footer */}
        <Footer />
      </AuthVerification>
    </BrowserRouter>
  );
};

export default App;
