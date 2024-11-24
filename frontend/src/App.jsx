import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/authSlice';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
             <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

