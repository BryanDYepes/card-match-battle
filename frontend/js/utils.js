// Utilidades generales
const Utils = {
    // Formatear tiempo en mm:ss
    formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
    },

    // Generar avatar basado en nombre
    generarAvatar(nombre) {
        if (!nombre) return '👤';
        const emojis = ['🦁', '🐯', '🐻', '🦊', '🐺', '🦝', '🐨', '🐼', '🐸', '🦄', '🐲', '🦖', '🐙', '🦑', '🐠', '🦈'];
        const index = nombre.charCodeAt(0) % emojis.length;
        return emojis[index];
    },

    // Copiar texto al portapapeles
    async copiarAlPortapapeles(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (err) {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    // Generar ID único
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Mezclar array
    mezclar(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Obtener color para característica
    obtenerColorCaracteristica(nombre) {
        const colores = {
            fuerza: '#ef4444',
            ataque: '#ef4444',
            defensa: '#3b82f6',
            velocidad: '#10b981',
            inteligencia: '#8b5cf6',
            poder: '#f59e0b',
            popularidad: '#ec4899',
            ps: '#10b981',
            rareza: '#f59e0b',
            tamaño: '#6366f1',
            masa: '#8b5cf6',
            temperatura: '#ef4444',
            distancia: '#3b82f6',
            lunas: '#f59e0b',
            peligrosidad: '#dc2626'
        };
        return colores[nombre.toLowerCase()] || '#6366f1';
    },

    // Validar nombre
    validarNombre(nombre) {
        if (!nombre || nombre.trim().length === 0) {
            return { valido: false, mensaje: 'El nombre no puede estar vacío' };
        }
        if (nombre.length < 2) {
            return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
        }
        if (nombre.length > 20) {
            return { valido: false, mensaje: 'El nombre no puede tener más de 20 caracteres' };
        }
        return { valido: true };
    },

    // Validar código
    validarCodigo(codigo) {
        if (!codigo || codigo.trim().length === 0) {
            return { valido: false, mensaje: 'El código no puede estar vacío' };
        }
        if (codigo.length !== 6) {
            return { valido: false, mensaje: 'El código debe tener 6 caracteres' };
        }
        return { valido: true };
    },

    // Guardar en localStorage
    guardar(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
        }
    },

    // Obtener de localStorage
    obtener(clave) {
        try {
            const valor = localStorage.getItem(clave);
            return valor ? JSON.parse(valor) : null;
        } catch (e) {
            console.error('Error al obtener de localStorage:', e);
            return null;
        }
    },

    // Eliminar de localStorage
    eliminar(clave) {
        try {
            localStorage.removeItem(clave);
        } catch (e) {
            console.error('Error al eliminar de localStorage:', e);
        }
    }
};