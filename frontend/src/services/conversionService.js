import api from './api.js';
export const getConversions = async () => {
  const response = await api.get('/convert');
  return response.data;
};
export const getConversion = async (id) => {
  const response = await api.get(`/convert/${id}`);
  return response.data;
};
export const deleteConversion = async (id) => {
  const response = await api.delete(`/convert/${id}`);
  return response.data;
};
export const downloadAudio = (id) => {
  const token = localStorage.getItem('token');
  const baseUrl = api.defaults.baseURL;
  const downloadUrl = `${baseUrl}/convert/${id}/download`;
  if (token) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `audio-${id}.wav`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    });
    return null; 
  } else {
    return downloadUrl;
  }
};

// Get audio URL for streaming/playing in web players
export const getAudioUrl = (id) => {
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl}/convert/${id}/download`;
};

// Stream audio with authentication headers (for use with audio elements)
export const getAudioBlob = async (id) => {
  const token = localStorage.getItem('token');
  const baseUrl = api.defaults.baseURL;
  const audioUrl = `${baseUrl}/convert/${id}/download`;
  try {
    const response = await fetch(audioUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } 
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to fetch audio:', error);
    throw error;
  }
};

// Play audio directly in the browser
export const playAudio = async (id) => {
  try {
    const audioUrl = await getAudioBlob(id);
    const audio = new Audio(audioUrl);
    // Optional: Add event listeners for audio events
    audio.addEventListener('loadstart', () => console.log('Loading started'));
    audio.addEventListener('canplay', () => console.log('Can start playing'));
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl); // Clean up the blob URL
    });
    await audio.play();
    return audio;
  } catch (error) {
    console.error('Failed to play audio:', error);
    throw error;
  }
};
// Get audio stream for HTML audio elements with proper authentication
export const createAuthenticatedAudioSrc = async (id) => {
  try {
    const audioUrl = await getAudioBlob(id);
    return audioUrl;
  } catch (error) {
    console.error('Failed to create audio source:', error);
    return null;
  }
};
// Check if audio file exists and is accessible
export const checkAudioAvailability = async (id) => {
  const token = localStorage.getItem('token');
  const baseUrl = api.defaults.baseURL;
  const audioUrl = `${baseUrl}/convert/${id}/download`;
  try {
    const response = await fetch(audioUrl, {
      method: 'HEAD', // Only check headers, don't download content
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to check audio availability:', error);
    return false;
  }
};
export const convertPdfToAudio = async (file, language = 'en') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  const response = await api.post('/convert/pdf', formData);
  return response.data;
};

export const convertImageToAudio = async (file, language = 'en') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  const response = await api.post('/convert/image', formData);
  return response.data;
};

export const convertTextToAudio = async (text, language = 'en') => {
  const response = await api.post('/convert/text', { text, language });
  return response.data;
};