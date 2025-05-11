// src/components/Conversion/ConversionForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertPdfToAudio, convertImageToAudio, convertTextToAudio } from '../../services/conversionService';

const ConversionForm = () => {
  const [conversionType, setConversionType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    if ((conversionType === 'pdf' || conversionType === 'image') && !file) {
      setError(`Please select a ${conversionType} file`);
      setLoading(false);
      return;
    }

    if (conversionType === 'text' && !text.trim()) {
      setError('Please enter some text');
      setLoading(false);
      return;
    }

    switch (conversionType) {
      case 'pdf':
        await convertPdfToAudio(file, language);
        break;
      case 'image':
        await convertImageToAudio(file, language);
        break;
      case 'text':
        await convertTextToAudio(text, language);
        break;
      default:
        setError('Invalid conversion type');
        setLoading(false);
        return;
    }

    navigate('/conversions');
  } catch (err) {
    setError(err?.response?.data?.detail || err.message || 'Conversion failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Convert to Audio</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Conversion Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="conversionType"
                value="text"
                checked={conversionType === 'text'}
                onChange={() => setConversionType('text')}
              />
              <span className="ml-2">Text</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="conversionType"
                value="pdf"
                checked={conversionType === 'pdf'}
                onChange={() => setConversionType('pdf')}
              />
              <span className="ml-2">PDF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="conversionType"
                value="image"
                checked={conversionType === 'image'}
                onChange={() => setConversionType('image')}
              />
              <span className="ml-2">Image</span>
            </label>
          </div>
        </div>
        
        {conversionType === 'text' ? (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="text">
              Text to Convert
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              rows="6"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to audio..."
              required={conversionType === 'text'}
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="file">
              {conversionType === 'pdf' ? 'PDF File' : 'Image File'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="file"
              type="file"
              accept={conversionType === 'pdf' ? '.pdf' : 'image/*'}
              onChange={handleFileChange}
              required
            />
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="language">
            Language
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ru">Russian</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Converting...' : 'Convert to Audio'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversionForm;