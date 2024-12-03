import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = "https://api-ulink.tssw.info";

const CompleteProfile = () => {

    ///LISTADO CON CARRERAS DE LA UTEM///

    const carrerasList = [
        { id: 1, nombre: "Ingeniería en Informática" },
        { id: 2, nombre: "Ingeniería Civil Biomédica" },
        { id: 3, nombre: "Bachillerato en Ciencias de la Ingeniería" },
        { id: 4, nombre: "Ingeniería Civil en Computación, mención Informática" },
        { id: 5, nombre: "Ingeniería Civil Industrial" },
        { id: 6, nombre: "Ingeniería Civil en Ciencias de Datos" },
        { id: 7, nombre: "Ingeniería Civil en Electrónica" },
        { id: 8, nombre: "Ingeniería Civil en Mecánica" },
        { id: 9, nombre: "Ingeniería en Geomensura" },
        { id: 10, nombre: "Ingeniería Industrial" },
        { id: 11, nombre: "Dibujante Proyectista" },
        { id: 12, nombre: "Diseño en Comunicación Visual" },
        { id: 13, nombre: "Diseño Industrial" },
        { id: 14, nombre: "Trabajo Social" },
        { id: 15, nombre: "Ingeniería Civil Química" },
        { id: 16, nombre: "Ingeniería Civil Matemática" },
        { id: 17, nombre: "Química y Farmacia" },
        { id: 18, nombre: "Ingeniería en Biotecnología" },
        { id: 19, nombre: "Ingeniería en Alimentos" },
        { id: 20, nombre: "Química Industrial" },
        { id: 21, nombre: "Arquitectura" },
        { id: 22, nombre: "Ingeniería Civil en Obras Civiles" },
        { id: 23, nombre: "Ingeniería en Construcción" },
        { id: 24, nombre: "Ingeniería Civil en Prevención de Riesgos y Medioambiente" },
        { id: 25, nombre: "Administración Pública" },
        { id: 26, nombre: "Bibliotecología y Documentación" },
        { id: 27, nombre: "Contador Público y Auditor" },
        { id: 28, nombre: "Ingeniería Comercial" },
        { id: 29, nombre: "Ingeniería en Comercio Internacional" },
        { id: 30, nombre: "Ingeniería en Gestión Turística" },
        { id: 31, nombre: "Derecho" },
        { id: 32, nombre: "Psicología" }
    ];

    const [formData, setFormData] = useState({
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: '',
        fotoPerfil: null,
    });
    const [error, setError] = useState('');
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();
    const location = useLocation();

    const COOKIE_CONFIG = {
        expires: 7,
        secure: true,
        sameSite: 'strict',
        path: '/',
        domain: '.tssw.info'
    };

    const getAuthToken = () => {
        return Cookies.get('authToken');
    };


    const setAuthToken = (token) => {
        Cookies.set('authToken', token, COOKIE_CONFIG);
    };


    const removeAuthToken = () => {
        Cookies.remove('authToken');
    };


    useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                const token = getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }, []);

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const handleThemeChange = () => {
            const newTheme = Cookies.get('theme') || 'light';
            setTheme(newTheme);
        };

        // Observar cambios en el atributo data-theme del documento
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    handleThemeChange();
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
            inputText: 'text-black',
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
            card: 'bg-gray-800',
            formWrapper: 'bg-gray-900'
        }
    };

    const currentTheme = themeColors[theme];


    const handleChange = (e) => {
        if (e.target.name === 'fotoPerfil') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let fotoPerfilUrl = '';

            if (formData.fotoPerfil) {
                const imageFormData = new FormData();
                imageFormData.append('file', formData.fotoPerfil);

                const apiurl = `${API_URL}/upload-image`

                const uploadResponse = await axios.post(apiurl, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                fotoPerfilUrl = uploadResponse.data.url;
            }



            const profileFormData = {
                fecha_nacimiento: formData.fecha_nacimiento,
                ano_ingreso: formData.ano_ingreso,
                id_carrera: parseInt(formData.id_carrera),
                foto_perfil: fotoPerfilUrl || ''
            };

            const apiurl = `${API_URL}/complete-profile`

            const response = await axios.post(apiurl, profileFormData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message === "Perfil actualizado correctamente") {
                // Update token if a new one is returned
                if (response.data.token) {
                    setAuthToken(response.data.token);
                }
                navigate('/unificacion');
            } else {
                setError('Error al completar el perfil: ' + response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Error al completar el perfil');
            } else {
                setError('Error al completar el perfil');
            }
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center font-Ubuntu ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300`}>
            <form
                onSubmit={handleSubmit}
                className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}
            >
                <h2 className={`text-4xl font-Rubik font-bold mb-8 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Completar Perfil
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Fecha de Nacimiento
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Año de Ingreso Universitario
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        id="ano_ingreso"
                        name="ano_ingreso"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.ano_ingreso}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Carrera
                    </label>
                    <select
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText}`}
                        id="id_carrera"
                        name="id_carrera"
                        value={formData.id_carrera}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una carrera</option>
                        {carrerasList.map((carrera) => (
                            <option key={carrera.id} value={carrera.id} className={currentTheme.inputText}>
                                {carrera.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                        Foto de Perfil
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.inputText} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 ${theme === 'dark' ? 'file:bg-gray-600 file:text-white' : 'file:bg-[#0092BC] file:text-white'}`}
                        id="fotoPerfil"
                        name="fotoPerfil"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300`}
                        type="submit"
                    >
                        Terminar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfile;