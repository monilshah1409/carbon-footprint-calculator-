import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Homepage</h1>
      <p>This is the homepage after successful login.</p>
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
