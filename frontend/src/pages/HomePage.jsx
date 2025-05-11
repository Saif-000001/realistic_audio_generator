// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConversionForm from '../components/Conversion/ConversionForm';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Text-to-Speech Converter</h1>
        <p className="text-xl text-gray-600">
          Convert text, PDFs, and images into high-quality audio files
        </p>
      </div>

      {isAuthenticated ? (
        <ConversionForm />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="mb-6">
            Please sign in or create an account to start converting your content to audio.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-2">Text to Audio</h3>
          <p className="text-gray-600">
            Convert any text into natural-sounding speech in multiple languages.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-2">PDF to Audio</h3>
          <p className="text-gray-600">
            Turn PDF documents into audio files for listening on the go.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-2">Image to Audio</h3>
          <p className="text-gray-600">
            Extract text from images and convert it to speech effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;