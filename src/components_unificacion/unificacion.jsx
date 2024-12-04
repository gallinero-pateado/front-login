import React, { useEffect } from 'react';
import DynamicImageSlider from './CarruselImagenes';
import Cookies from 'js-cookie';

const MainPage = () => {

  const COOKIE_CONFIG = {
    expires: 7, // Token expires in 7 days
    secure: true, // Only use HTTPS in production
    sameSite: 'Strict',
    path: '/',
    domain: ".tssw.info"
  };

  useEffect(() => {
    const token = Cookies.get("authToken") || undefined;
    if (!token) {
      // Redirigir si el token existe
      console.log(token)
      window.location.href = "https://ulink.tssw.info/";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 px-6 flex items-center gap-6 shadow-md">
        <img src="logo-utem.png" alt="Logo de Ulink" className="h-20" />

        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold tracking-tight">ULINK</h1>
          <p className="text-sm text-gray-300 max-w-md">
            La plataforma ideal de nuestra universidad por y para estudiantes para facilitar tu vida
          </p>
        </div>
      </header>


      {/* Dynamic Image Slider */}
      <div className="px-10 mb-6">
        <DynamicImageSlider />
      </div>
    </div>
  );
};

export default MainPage;