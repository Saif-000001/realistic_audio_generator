import { useState, useEffect } from 'react';
import { getConversions } from '../../services/conversionService';
import ConversionCard from './ConversionCard';

const ConversionList = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        setLoading(true);
        const data = await getConversions();
        setConversions(data);
        setError('');
      } catch (err) {
        console.error('Error fetching conversions:', err);
        
        // Customize error message based on error type
        if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CONNECTION_REFUSED') {
          setError('Unable to connect to the server. Please make sure the API server is running.');
        } else if (err.response?.status === 401) {
          setError('You need to log in to view your conversions.');
        } else {
          setError('Failed to load conversions. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversions();
  }, [retryCount]);

  const handleDelete = (id) => {
    setConversions(conversions.filter(conv => conv.id !== id));
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-5 rounded-md shadow-sm my-5">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-3 md:mb-0"><strong>Error:</strong> {error}</p>
          <div className="flex space-x-3">
            <button 
              onClick={handleRetry} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
        <div className="mt-5 border-t border-red-300 pt-4">
          <h3 className="font-bold text-lg mb-2">Troubleshooting:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check if your API server is running at the correct address</li>
            <li>Verify your environment variables (like VITE_API_URL)</li>
            <li>Make sure you're logged in if authentication is required</li>
          </ul>
        </div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">No Conversions Yet</h2>
        <p className="text-lg text-gray-600 mb-6">You don't have any conversions yet.</p>
      </div>
    );
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          {conversions.length} conversion{conversions.length !== 1 ? 's' : ''} found
        </p>
        
        <button
          onClick={handleRetry}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          aria-label="Refresh conversions list"
        >
          Refresh
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {conversions.map((conversion) => (
          <ConversionCard
            key={conversion.id}
            conversion={conversion}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversionList;