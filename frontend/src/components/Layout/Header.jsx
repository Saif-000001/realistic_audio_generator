// src/components/Layout/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TTS Converter</Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200">Home</Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/conversions" className="hover:text-blue-200">My Conversions</Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-4">Hello, {user?.username}</span>
                  <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;