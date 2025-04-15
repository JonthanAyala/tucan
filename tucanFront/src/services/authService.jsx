import axios from 'axios';
import {API_URL} from '../config/ip.js'; // Asegúrate de que la ruta sea correcta

// Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL+"usuarios/token/", { email, password });

        if (response.data.access) {
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
        }
        return response.data;
    } catch (error) {
        console.error("Error en el login", error);
        throw new Error("Credenciales incorrectas");
    }
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload(); // Recargar para limpiar el estado
};
