// src/components/Conversion/ConversionCard.jsx
import { useState } from 'react';
import { deleteConversion, downloadAudio } from '../../services/conversionService';
import { useAuth } from '../../context/AuthContext';

const ConversionCard = ({ conversion, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Helper function to safely display text content with null/undefined check
  const renderTextContent = () => {
    if (!conversion.text_content) {
      return <p className="text-sm text-gray-500">No text content available</p>;
    }
    
    return <p className="text-sm">{conversion.text_content.slice(0, 150)}{conversion.text_content.length > 150 ? '...' : ''}</p>;
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this conversion?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteConversion(conversion.id);
      onDelete(conversion.id);
    } catch (error) {
      console.error('Failed to delete conversion:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!isAuthenticated) {
      alert('Please login to download audio files');
      return;
    }
    
    const downloadUrl = downloadAudio(conversion.id);
    window.open(downloadUrl, '_blank');
  };
  
  // Only render if we have a valid conversion object
  if (!conversion) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <h3 className="text-lg font-semibold">{conversion.file_name || 'Unnamed conversion'}</h3>
          <p className="text-gray-600 text-sm mb-2">
            Type: {conversion.source_type || 'Unknown'} | Language: {conversion.language || 'Unknown'}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Created: {conversion.created_at ? new Date(conversion.created_at).toLocaleString() : 'Unknown date'}
          </p>
          <div className="bg-gray-100 p-3 rounded-md mb-3 max-h-24 overflow-y-auto">
            {renderTextContent()}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
        >
          Download Audio
        </button>
        
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ConversionCard;