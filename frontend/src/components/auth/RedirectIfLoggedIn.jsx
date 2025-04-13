import { useSelector } from 'react-redux';
import {  Navigate } from 'react-router-dom';

const RedirectIfLoggedIn  = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default RedirectIfLoggedIn ;