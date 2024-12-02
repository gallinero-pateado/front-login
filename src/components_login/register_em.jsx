import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = "https://api-ulink.tssw.info";

const DICCIONARIO_ERRORES = {
    'network': {
        'connection_error': 'Error de conexión. Verifique su conexión a internet',
        'server_error': 'Problema interno del servidor. Intente más tarde',
        'timeout': 'La solicitud tardó demasiado. Intente nuevamente',
    },
    'registro': {
        'email_already_exists': 'Ya existe una cuenta con este correo electrónico',
        'invalid_email_format': 'Formato de correo electrónico inválido',
        'weak_password': 'La contraseña es demasiado débil. Use al menos 8 caracteres',
        'password_mismatch': 'Las contraseñas no coinciden',
        'missing_required_fields': 'Complete todos los campos obligatorios',
    },
    'default': 'Ha ocurrido un error inesperado. Intente nuevamente'
};

const obtenerMensajeError = (categoria, codigoError, errorBackend = null) => {
    // Si hay un error específico del backend, devolverlo
    if (errorBackend) return errorBackend;

    if (DICCIONARIO_ERRORES[categoria] && DICCIONARIO_ERRORES[categoria][codigoError]) {
        return DICCIONARIO_ERRORES[categoria][codigoError];
    }

    const categoriasPredeterminadas = ['network'];
    for (let cat of categoriasPredeterminadas) {
        if (DICCIONARIO_ERRORES[cat] && DICCIONARIO_ERRORES[cat][codigoError]) {
            return DICCIONARIO_ERRORES[cat][codigoError];
        }
    }

    return DICCIONARIO_ERRORES['default'];
};

const RegisterEm = () => {
    const [formData, setFormData] = useState({
        Nombre_empresa: '',
        Email_empresa: '',
        Password: '',
        ConfirmPasword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [theme, setTheme] = useState('light');

    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        // Observer para detectar cambios en el tema
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Verificar que las contraseñas coincidan
        if (formData.Password !== formData.ConfirmPassword) {
            setError(obtenerMensajeError('registro', 'password_mismatch'));
            return;
        }

        const apiurl = `${API_URL}/register_empresa`

        try {
            const response = await axios.post(apiurl, {
                Email_empresa: formData.Email_empresa,
                Password: formData.Password,
                Nombre_empresa: formData.Nombre_empresa
            });
            setSuccess(response.data.message || 'Usuario registrado correctamente');
        } catch (error) {
            if (error.response) {
                // Map specific backend errors to user-friendly messages
                let errorMessage = '';
                if (error.response.data.error) {
                    if (error.response.data.error.includes('correo ya está registrado')) {
                        errorMessage = obtenerMensajeError('registro', 'email_already_exists');
                    } else {
                        errorMessage = obtenerMensajeError('default');
                    }
                } else {
                    errorMessage = obtenerMensajeError('default');
                }
                setError(errorMessage);
            } else {
                setError(obtenerMensajeError('network', 'connection_error'));
            }
        }
    };

    const handleRegisterAsStudent = () => {
        navigate('/register');
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300`}>
            <div className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}>
                <h2 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Registro de Empresa
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Nombre de la Empresa */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Nombre de la Empresa
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="Nombre_empresa"
                            name="Nombre_empresa"
                            type="text"
                            placeholder="Nombre de la Empresa"
                            value={formData.Nombre_empresa}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Correo de Contacto */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Correo de Contacto
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="Email_empresa"
                            name="Email_empresa"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={formData.Email_empresa}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Contraseña
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="Password"
                            name="Password"
                            type="password"
                            placeholder="******************"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Confirmar Contraseña
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="ConfirmPassword"
                            name="ConfirmPassword"
                            type="password"
                            placeholder="******************"
                            value={formData.ConfirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center mt-3 w-full max-w-md">
                        <button
                            className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-2`}
                            type="submit"
                        >
                            Registrarse
                        </button>

                        <button
                            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-[#A3D9D3]' : 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
                            onClick={handleRegisterAsStudent}
                        >
                            Registrarse como Estudiante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterEm;