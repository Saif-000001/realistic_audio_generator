import { useState, useCallback } from 'react';
import { deleteConversion, downloadAudio } from '../../services/conversionService';
import { useAuth } from '../../context/AuthContext';

const ConversionCard = ({ conversion, onDelete, onError }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Constants
  const TEXT_PREVIEW_LENGTH = 150;
  const DOWNLOAD_TIMEOUT = 30000;

  const renderTextContent = useCallback(() => {
    if (!conversion?.text_content?.trim()) {
      return (
        <p className="text-sm text-gray-500 italic">
          No text content available
        </p>
      );
    }
    
    const { text_content } = conversion;
    const truncatedText = text_content.length > TEXT_PREVIEW_LENGTH 
      ? `${text_content.slice(0, TEXT_PREVIEW_LENGTH)}...`
      : text_content;
    
    return (
      <p className="text-sm text-gray-700 leading-relaxed">
        {truncatedText}
      </p>
    );
  }, [conversion?.text_content]);

  /**
   * Handles conversion deletion with confirmation
   */
  const handleDelete = useCallback(async () => {
    if (!conversion?.id) return;

    const confirmMessage = `Are you sure you want to delete "${conversion.file_name || 'this conversion'}"?`;
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    
    try {
      await deleteConversion(conversion.id);
      onDelete?.(conversion.id);
    } catch (error) {
      console.error('Failed to delete conversion:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete conversion. Please try again.';
      onError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [conversion?.id, conversion?.file_name, onDelete, onError]);

  /**
   * Handles audio download without opening new tab
   */
  const handleDownload = useCallback(async () => {
    if (!isAuthenticated) {
      onError?.('Please login to download audio files');
      return;
    }
    if (!conversion?.id) {
      onError?.('Invalid conversion data');
      return;
    }
    setIsDownloading(true);
    try {
      // Get the download URL/blob from the service
      const audioData = await downloadAudio(conversion.id);
      
      // Create blob URL if we get binary data
      let downloadUrl;
      if (audioData instanceof Blob) {
        downloadUrl = URL.createObjectURL(audioData);
      } else if (typeof audioData === 'string') {
        downloadUrl = audioData;
      } else {
        throw new Error('Invalid audio data received');
      }
      // Create temporary download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${conversion.file_name || 'audio'}.mp3`;
      link.style.display = 'none';
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up blob URL if created
      if (audioData instanceof Blob) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      }
      
    } catch (error) {
      console.error('Failed to download audio:', error);
      const errorMessage = error.response?.data?.message || 'Failed to download audio. Please try again.';
      onError?.(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  }, [isAuthenticated, conversion?.id, conversion?.file_name, onError]);

    const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown date';

    try {
      return new Date(dateString).toLocaleString('en-BD', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  }, []);

  // Early return for invalid conversion
  if (!conversion) {
    return null;
  }
  const {
    file_name = 'Unnamed conversion',
    source_type = 'Unknown',
    language = 'Unknown',
    created_at
  } = conversion;
  return (
    <article className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 transition-shadow hover:shadow-lg">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {file_name}
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <span className="font-medium">Type:</span>
            <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {source_type}
            </span>
          </span>
          <span className="flex items-center">
            <span className="font-medium">Language:</span>
            <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {language}
            </span>
          </span>
        </div>
        <time className="text-sm text-gray-500 mt-2 block">
          Created: {formatDate(created_at)}
        </time>
      </header>
      <section className="mb-4">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md max-h-32 overflow-y-auto">
          {renderTextContent()}
        </div>
      </section>
      <footer className="flex justify-between items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading || !isAuthenticated}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
            ${isDownloading 
              ? 'bg-green-300 cursor-not-allowed' 
              : isAuthenticated
                ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                : 'bg-gray-300 cursor-not-allowed'
            }
            text-white flex items-center gap-2
          `}
          aria-label={`Download audio for ${file_name}`}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Audio
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
            ${isDeleting 
              ? 'bg-red-300 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            }
            text-white flex items-center gap-2
          `}
          aria-label={`Delete ${file_name}`}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </>
            )}
        </button>
      </footer>
    </article>
  );
};
export default ConversionCard;