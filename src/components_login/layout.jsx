import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import bodyImage from '../imagen/body.jpg';

const Layout = () => {
    const [theme, setTheme] = useState('light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const COOKIE_CONFIG = {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        domain: '.tssw.info',
    };

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        Cookies.set('theme', newTheme, { expires: 365 });
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const fixedColors = {
        header: 'bg-[#0092BC]',
        register: 'bg-[#A3D9D3] text-[#0092BC] hover:bg-[#8ec3c0]',
        login: 'bg-[#0092BC] hover:bg-[#007a9a]',
    };

    const themeColors = {
        light: {
            background: 'bg-[#DAEDF2]',
            text: 'text-black',
            accent: 'text-[#0092BC]',
            card: 'bg-white',
            secondaryText: 'text-[#005F7F]',
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
            accent: 'text-[#A3D9D3]',
            card: 'bg-gray-800',
            secondaryText: 'text-gray-300',
        },
    };

    const currentTheme = themeColors[theme];

    return (
        <div className={`flex flex-col min-h-screen font-ubuntu ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
            {/* Header */}
            <header className={`${fixedColors.header} text-white p-4 md:p-6 relative z-20`}>
                <div className="flex justify-between items-center mx-auto">
                    {/* Logo y titulo */}
                    <h1 className="text-3xl md:text-5xl font-bold italic flex items-center space-x-4">
                        <img src="logo-utem.png" alt="Logo de Ulink" className="h-16 md:h-20" />
                        <a href="https://ulink.tssw.info/unificacion" className="hover:no-underline">
                            ULINK
                        </a>
                    </h1>

                    {/* Botones para pantallas grandes y hamburguesa para pequeños */}
                    <div className="flex items-center space-x-4">
                        {/* Switch modo oscuro */}
                        <div
                            onClick={toggleTheme}
                            className={`relative w-20 h-10 rounded-full p-1 cursor-pointer flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
                            role="button"
                            aria-label="Toggle dark mode"
                            tabIndex={0}
                        >
                            <Sun className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-yellow-500'} ml-1`} />
                            <div
                                className={`absolute w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 ${theme === 'dark' ? 'bg-blue-400 translate-x-10' : 'bg-white translate-x-0'
                                    }`}
                            />
                            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-500'} mr-1`} />
                        </div>

                        {/* Botones para pantallas grandes */}
                        <nav className="hidden md:flex space-x-4">
                            <a
                                href="/register"
                                className={`${fixedColors.register} px-4 py-2 rounded-md font-bold transition-colors duration-300`}
                            >
                                Registrarse
                            </a>
                            <a
                                href="/"
                                className={`${fixedColors.login} px-4 py-2 rounded-md font-bold transition-colors duration-300`}
                            >
                                Iniciar Sesión
                            </a>
                        </nav>

                        {/* Menu hamburguesa para celular */}
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-full md:hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#DAEDF2]'}`}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={32} color={theme === 'dark' ? '#ffffff' : '#0092BC'} /> : <Menu size={32} color={theme === 'dark' ? '#ffffff' : '#0092BC'} />}
                        </button>
                    </div>
                </div>

                {/* Menu responsivo */}
                {isMenuOpen && (
                    <nav
                        ref={menuRef}
                        className="fixed top-0 right-0 h-full w-64 bg-[#0092BC] text-white shadow-lg z-30 flex flex-col p-6 transition-transform duration-300 font-semibold"
                    >
                        <a
                            href="/register"
                            className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC] text-left"
                        >
                            Registrarse
                        </a>
                        <a
                            href="/"
                            className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC] text-left"
                        >
                            Iniciar Sesión
                        </a>
                        <ChevronRight
                            onClick={toggleMenu}
                            className="mt-auto self-end cursor-pointer hover:text-[#DAEDF2] transition duration-300"
                            size={24}
                            color="white"
                        />
                    </nav>
                )}
            </header>

            {/* Contenido */}
            <main className="flex-grow flex flex-col md:flex-row container mx-auto my-8 items-start justify-between px-4 w-full">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <Outlet />
                </div>
                <div className="w-full md:w-1/2 md:ml-8">
                    <div className="text-right mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0092BC] mb-4">
                            Bienvenido a ULINK
                        </h2>
                        <p className={currentTheme.secondaryText}>
                            Conectamos estudiantes con oportunidades increíbles.
                        </p>
                    </div>
                    <div className={`${currentTheme.card} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
                        <img
                            src={bodyImage}
                            alt="Personas trabajando"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`${fixedColors.header} text-white text-center p-4 md:p-2`}>
                <div className="flex flex-col space-y-2">
                    <p className="text-sm md:text-base">Desarrollado por estudiantes UTEM</p>
                    <p className="text-sm md:text-base">tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                    <p className="text-sm md:text-base">&copy; 2024 ULINK. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;