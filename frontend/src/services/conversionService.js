// src/services/conversionService.js
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