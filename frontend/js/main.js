// Punto de entrada principal de la aplicación

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Card Match Battle - Iniciando...');
    
    // Inicializar componentes
    inicializarAplicacion();
});

// Función principal de inicialización
function inicializarAplicacion() {
    try {
        // 1. Inicializar UI
        UI.inicializar();
        console.log('✅ UI inicializada');

        // 2. Inicializar Game
        Game.inicializar();
        console.log('✅ Game inicializado');

        // 3. Mostrar loading mientras se conecta
        UI.mostrarLoading();

        // 4. Inicializar Socket
        SocketManager.inicializar();
        console.log('✅ Socket inicializado');

        // 5. Verificar si hay sesión activa
        verificarSesionActiva();

        console.log('🎉 Card Match Battle iniciado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        UI.mostrarNotificacion('Error al iniciar la aplicación', 'error');
    }
}

// Verificar si hay una sesión activa
function verificarSesionActiva() {
    const sesion = Utils.obtener('sesion_juego');
    
    if (sesion && sesion.jugadorId && sesion.codigoPartida) {
        // Hay una sesión guardada, preguntar si quiere reconectar
        const reconectar = confirm(
            '¿Deseas reconectar a tu última partida?\n\n' +
            `Código: ${sesion.codigoPartida}`
        );

        if (reconectar) {
            // Intentar reconectar
            Game.jugadorId = sesion.jugadorId;
            Game.codigoPartida = sesion.codigoPartida;
            
            // Aquí podrías implementar lógica de reconexión
            // Por ahora simplemente limpiamos la sesión
            Utils.eliminar('sesion_juego');
            UI.mostrarNotificacion('Sesión anterior limpiada', 'info');
        } else {
            // Limpiar sesión
            Utils.eliminar('sesion_juego');
        }
    }
}

// Manejar cierre de ventana
window.addEventListener('beforeunload', (e) => {
    if (Game.estadoPartida && Game.estadoPartida.estado === 'jugando') {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir? Perderás tu progreso.';
        return e.returnValue;
    }
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
    UI.mostrarNotificacion('Ha ocurrido un error inesperado', 'error');
});

// Prevenir clic derecho en producción (opcional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Detectar pérdida de foco (tab inactivo)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🔕 Aplicación en segundo plano');
    } else {
        console.log('🔔 Aplicación en primer plano');
    }
});

// Función de ayuda para debugging (solo desarrollo)
if (window.location.hostname === 'localhost') {
    window.debugGame = {
        obtenerEstado() {
            console.log('Estado actual del juego:', Game.estadoPartida);
        },
        obtenerJugadorId() {
            console.log('ID del jugador:', Game.jugadorId);
        },
        obtenerCodigo() {
            console.log('Código de partida:', Game.codigoPartida);
        },
        limpiarSesion() {
            Utils.eliminar('sesion_juego');
            console.log('✅ Sesión limpiada');
        },
        simularError() {
            throw new Error('Error simulado para pruebas');
        }
    };
    
    console.log('🛠️ Modo desarrollo activado. Usa window.debugGame para debugging.');
}