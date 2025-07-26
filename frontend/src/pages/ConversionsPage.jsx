import { useState } from 'react';
import ConversionList from '../components/Conversion/ConversionList';
import ConversionForm from '../components/Conversion/ConversionForm';

const ConversionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Conversions</h1>
        <button
          className={`px-4 py-2 rounded font-medium ${
            showForm ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'New Conversion'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ConversionForm />
        </div>
      )}
      <ConversionList />
    </div>
  );
};

export default ConversionsPage;