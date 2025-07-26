import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/conversions" />;
  }
  return (
    <div className="max-w-md mx-auto">
      <RegisterForm />
    </div>
  );
};
export default RegisterPage;