// src/pages/RegisterPage.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/Auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/conversions" />;
  }

  return (
    <div className="max-w-md mx-auto">
      <RegisterForm />
      <div className="text-center mt-4">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;