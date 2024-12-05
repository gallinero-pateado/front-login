import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = "https://api-ulink.tssw.info";

const DICCIONARIO_ERRORES = {
    'auth': {
        'invalid_credentials': 'Correo electrónico o contraseña incorrectos',
        'user_not_found': 'No se encontró una cuenta con este correo',
        'unauthorized': 'Acceso no autorizado',
    },
    'network': {
        'connection_error': 'Error de conexión. Verifique su conexión a internet',
        'server_error': 'Problema interno del servidor. Intente más tarde',
        'timeout': 'La solicitud tardó demasiado. Intente nuevamente',
    },
    'default': 'Ha ocurrido un error inesperado. Intente nuevamente'
};

const obtenerMensajeError = (categoria, codigoError, errorBackend = null) => {
    if (errorBackend) return errorBackend;

    if (DICCIONARIO_ERRORES[categoria] && DICCIONARIO_ERRORES[categoria][codigoError]) {
        return DICCIONARIO_ERRORES[categoria][codigoError];
    }

    return DICCIONARIO_ERRORES['default'];
};

const LoginEm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    const cookieOptions = {
        expires: 7, // Cookie expires in 7 days
        domain: '.tssw.info',
        secure: true, // Only send cookie over HTTPS
        sameSite: 'Strict', // Provides some CSRF protection while allowing normal navigation
        path: "/" // Cookie available across the entire site
    };


    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = Cookies.get('theme') || 'light';
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);



    const checkProfileStatus = async (token, uid) => {
        const apiurl = `${API_URL}/profile-status-empresa`

        try {
            console.log('Checking profile status with token:', token);
            const response = await axios.get(apiurl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Profile status response:', response.data);
            return response.data.perfil_completado;
        } catch (error) {
            console.error('Error checking profile status:', error.response || error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const apiurl = `${API_URL}/login/company`

        try {
            const loginResponse = await axios.post(apiurl, {
                email: email.trim().toLowerCase(),
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { token, uid } = loginResponse.data;

            if (!token || !uid) {
                throw new Error('No se recibieron las credenciales necesarias');
            }

            // Guardar credenciales en cookies
            Cookies.set('authToken', token, cookieOptions);
            Cookies.set('uid', uid, cookieOptions);

            // Verificar el estado del perfil
            const isProfileComplete = await checkProfileStatus(token, uid);

            // Redirigir según el estado del perfil
            if (!isProfileComplete) {
                navigate('/complete_profile_em');
            } else {
                window.location.href = "https://practicas.tssw.info/gpracticas";
            }
        } catch (error) {
            console.error('Full error object:', error);

            // Determinar el mensaje de error apropiado
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = obtenerMensajeError('auth', 'invalid_credentials', error.response.data.error);
                        break;
                    default:
                        errorMessage = obtenerMensajeError('network', 'server_error', error.response.data.error);
                }
            } else if (error.request) {
                errorMessage = obtenerMensajeError('network', 'connection_error');
            } else {
                errorMessage = obtenerMensajeError('default');
            }

            setError(errorMessage);
            Cookies.remove('authToken', { path: '/' });
            Cookies.remove('uid', { path: '/' });
        } finally {
            setLoading(false);
        }
    };

    const themeColors = {
        light: {
            background: 'bg-white',
            text: 'text-black',
            accent: 'text-[#0092BC]',
            inputBg: 'bg-white',
            inputText: 'text-gray-700',
            inputBorder: 'border-gray-300',
            card: 'bg-white'
        },
        dark: {
            background: 'bg-gray-800',
            text: 'text-white',
            accent: 'text-[#A3D9D3]',
            inputBg: 'bg-gray-700',
            inputText: 'text-white',
            inputBorder: 'border-gray-600',
            card: 'bg-gray-800'
        }
    };

    const currentTheme = themeColors[theme];

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300 font-ubuntu`}>
            <form onSubmit={handleSubmit} className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}>
                <h2 className={`text-4xl font-bold mb-12 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Iniciar Sesión Empresa
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-12">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-xl font-bold mb-2`}>
                        Email
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded-lg w-full py-4 px-5 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                        id="email"
                        type="email"
                        placeholder="Ingresa tu email empresarial"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-12">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-xl font-bold mb-2`}>
                        Contraseña
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded-lg w-full py-4 px-5 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <hr className={`border-t-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} my-8`} />

                <div className="flex justify-center mb-8">
                    <span
                        className={`${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} font-bold hover:underline cursor-pointer`}
                        onClick={() => navigate('/password_recovery')}
                    >
                        ¿Olvidaste tu contraseña?
                    </span>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button
                        type="submit"
                        className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                    <button
                        type="button"
                        className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-[#A3D9D3]' : 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
                        onClick={() => navigate('/')}
                    >
                        Iniciar como Estudiante
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginEm;
