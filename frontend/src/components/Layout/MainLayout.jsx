// src/components/Layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Text-to-Speech Converter</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;