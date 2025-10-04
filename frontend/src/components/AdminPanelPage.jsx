import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const AdminPanelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  // If we reach here, user is authenticated
  return <AdminPanel />;
};

export default AdminPanelPage;