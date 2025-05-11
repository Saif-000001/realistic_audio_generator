// src/pages/LoginPage.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/conversions" />;
  }

  return (
    <div className="max-w-md mx-auto">
      <LoginForm />
      <div className="text-center mt-4">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;