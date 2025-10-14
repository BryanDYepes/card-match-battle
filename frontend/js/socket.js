// Manejo de conexión Socket.IO
const SocketManager = {
    socket: null,
    conectado: false,

    // Inicializar conexión
    inicializar() {
        // Detectar entorno automáticamente
        // Si está en Render (https), usará wss://
        // Si está en local, usará http://localhost:3000
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const url = isLocal
            ? 'http://localhost:3000'
            : window.location.origin; // Render: https://card-match-battle.onrender.com

        this.socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.configurarEventos();
    },

    // Configurar eventos del socket
    configurarEventos() {
        this.socket.on('connect', () => {
            console.log('✅ Conectado al servidor');
            this.conectado = true;
            UI.ocultarLoading();
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Desconectado del servidor');
            this.conectado = false;
            UI.mostrarNotificacion('Conexión perdida. Intentando reconectar...', 'warning');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
            UI.mostrarNotificacion('Error al conectar con el servidor', 'error');
            UI.ocultarLoading();
        });

        // Eventos del juego
        this.socket.on('partida_creada', (data) => Game.manejarPartidaCreada(data));
        this.socket.on('partida_unida', (data) => Game.manejarPartidaUnida(data));
        this.socket.on('jugador_unido', (data) => Game.manejarJugadorUnido(data));
        this.socket.on('partida_iniciada', (data) => Game.manejarPartidaIniciada(data));
        this.socket.on('caracteristica_seleccionada', (data) => Game.manejarCaracteristicaSeleccionada(data));
        this.socket.on('ronda_jugada', (data) => Game.manejarRondaJugada(data));
        this.socket.on('jugador_desconectado', (data) => Game.manejarJugadorDesconectado(data));
        this.socket.on('partida_finalizada', (data) => Game.manejarPartidaFinalizada(data));

        // Manejo de errores
        this.socket.on('error', (data) => {
            UI.mostrarNotificacion(data.mensaje, 'error');
        });

        this.socket.on('error_unirse', (data) => {
            UI.mostrarNotificacion(data.mensaje, 'error');
            UI.ocultarLoading();
        });
    },

    // Emitir eventos genéricos
    emit(evento, data) {
        if (!this.conectado) {
            UI.mostrarNotificacion('No hay conexión con el servidor', 'error');
            return;
        }
        this.socket.emit(evento, data);
    },

    // Crear partida
    crearPartida(nombreJugador, categoria) {
        this.emit('crear_partida', { nombreJugador, categoria });
    },

    // Unirse a partida
    unirsePartida(codigo, nombreJugador) {
        this.emit('unirse_partida', { codigo: codigo.toUpperCase(), nombreJugador });
    },

    // Iniciar partida
    iniciarPartida(codigo) {
        this.emit('iniciar_partida', { codigo });
    },

    // Seleccionar característica
    seleccionarCaracteristica(codigo, jugadorId, caracteristica) {
        this.emit('seleccionar_caracteristica', { codigo, jugadorId, caracteristica });
    },

    // Jugar ronda
    jugarRonda(codigo) {
        this.emit('jugar_ronda', { codigo });
    },

    // Desconectar
    desconectar() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
};
