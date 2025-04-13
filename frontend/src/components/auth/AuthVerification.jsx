import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../features/authSlice";
import { auth } from "../../services/api";
import LoadingScreen from "../LoadingScreen";

const AuthVerification = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          dispatch(logout());
          setLoading(false);
          return;
        }
        
        // Call API to verify token
        const response = await auth.verifyToken();
        
        if (response.valid) {
          // Update user data in case anything changed
          dispatch(updateUser(response.user));
        } else {
          // Token is invalid
          dispatch(logout());
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [dispatch, token]);

  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthVerification;