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
      <header className="bg-[#0092BC] text-white py-4 px-6 flex items-center gap-6 shadow-md">
        <img src="logo-utem.png" alt="Logo de Ulink" className="h-20" />

        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold italic">ULINK</h1>
          <p className="text-sm text-white max-w-md">
            La plataforma ideal de nuestra universidad por y para estudiantes para facilitar tu vida
          </p>
        </div>
        <div className="flex ml-auto">
          <button
            onClick={handleLogout}
            className="block py-4 px-2 border-none font-extrabold rounded-md bg-[#A3D9D3] text-[#0092BC] hover:bg-[#8ec3c0] transition-colors duration-200 hover:text-white active:text-[#0092BC] text-left"
          >
            Cerrar Sesión
          </button>
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