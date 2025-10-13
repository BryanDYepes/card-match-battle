// Lógica principal del juego
const Game = {
    // Estado del juego
    estadoPartida: null,
    jugadorId: null,
    codigoPartida: null,
    esCreador: false,
    tiempoInicio: null,
    intervaloTiempo: null,

    // Inicializar juego
    inicializar() {
        // Cargar datos guardados
        const datosGuardados = Utils.obtener('sesion_juego');
        if (datosGuardados) {
            this.jugadorId = datosGuardados.jugadorId;
            this.codigoPartida = datosGuardados.codigoPartida;
        }
    },

    // Crear partida
    crearPartida() {
        const nombre = UI.elementos.inputNombre.value.trim();
        const categoria = UI.elementos.selectCategoria.value;

        const validacion = Utils.validarNombre(nombre);
        if (!validacion.valido) {
            UI.mostrarNotificacion(validacion.mensaje, 'error');
            return;
        }

        UI.mostrarLoading();
        this.esCreador = true;
        SocketManager.crearPartida(nombre, categoria);
    },

    // Unirse a partida
    unirsePartida() {
        const nombre = UI.elementos.inputNombre.value.trim();
        const codigo = UI.elementos.inputCodigo.value.trim();

        const validacionNombre = Utils.validarNombre(nombre);
        if (!validacionNombre.valido) {
            UI.mostrarNotificacion(validacionNombre.mensaje, 'error');
            return;
        }

        const validacionCodigo = Utils.validarCodigo(codigo);
        if (!validacionCodigo.valido) {
            UI.mostrarNotificacion(validacionCodigo.mensaje, 'error');
            return;
        }

        UI.mostrarLoading();
        this.esCreador = false;
        SocketManager.unirsePartida(codigo, nombre);
    },

    // Iniciar partida
    iniciarPartida() {
        if (!this.codigoPartida) {
            UI.mostrarNotificacion('No hay partida activa', 'error');
            return;
        }

        UI.mostrarLoading();
        SocketManager.iniciarPartida(this.codigoPartida);
    },

    // Seleccionar característica
    seleccionarCaracteristica(caracteristica) {
        if (!this.codigoPartida || !this.jugadorId) {
            UI.mostrarNotificacion('Error: datos de partida inválidos', 'error');
            return;
        }

        SocketManager.seleccionarCaracteristica(this.codigoPartida, this.jugadorId, caracteristica);
        UI.mostrarNotificacion(`Característica seleccionada: ${caracteristica}`, 'info');
    },

    // Jugar ronda
    jugarRonda() {
        if (!this.codigoPartida) {
            UI.mostrarNotificacion('No hay partida activa', 'error');
            return;
        }

        UI.mostrarLoading();
        SocketManager.jugarRonda(this.codigoPartida);
    },

    // Manejadores de eventos del socket

    // Manejar partida creada
    manejarPartidaCreada(data) {
        UI.ocultarLoading();
        
        if (data.exito) {
            this.jugadorId = data.jugadorId;
            this.codigoPartida = data.codigo;
            this.estadoPartida = data.partida;
            
            // Guardar sesión
            Utils.guardar('sesion_juego', {
                jugadorId: this.jugadorId,
                codigoPartida: this.codigoPartida
            });

            UI.cambiarPantalla('espera');
            UI.actualizarSalaEspera(data.partida, this.esCreador);
            UI.mostrarNotificacion('Partida creada exitosamente', 'exito');
        }
    },

    // Manejar partida unida
    manejarPartidaUnida(data) {
        UI.ocultarLoading();
        
        if (data.exito) {
            this.jugadorId = data.jugadorId;
            this.codigoPartida = data.codigo;
            this.estadoPartida = data.partida;
            
            // Guardar sesión
            Utils.guardar('sesion_juego', {
                jugadorId: this.jugadorId,
                codigoPartida: this.codigoPartida
            });

            UI.cambiarPantalla('espera');
            UI.actualizarSalaEspera(data.partida, this.esCreador);
            UI.mostrarNotificacion('Te has unido a la partida', 'exito');
        }
    },

    // Manejar jugador unido
    manejarJugadorUnido(data) {
        if (this.estadoPartida) {
            this.estadoPartida.jugadores.push(data.jugador);
            UI.actualizarSalaEspera(this.estadoPartida, this.esCreador);
            UI.mostrarNotificacion(`${data.jugador.nombre} se ha unido`, 'info');
        }
    },

    // Manejar partida iniciada
    manejarPartidaIniciada(data) {
        UI.ocultarLoading();
        this.estadoPartida = data.partida;
        
        UI.cambiarPantalla('juego');
        UI.actualizarJuego(data.partida, this.jugadorId);
        UI.mostrarNotificacion('¡La partida ha comenzado!', 'exito');
        
        // Iniciar contador de tiempo
        this.iniciarContadorTiempo();
    },

    // Manejar característica seleccionada
    manejarCaracteristicaSeleccionada(data) {
        if (this.estadoPartida) {
            this.estadoPartida.caracteristicaSeleccionada = data.caracteristica;
            UI.actualizarJuego(this.estadoPartida, this.jugadorId);
            
            const jugador = this.estadoPartida.jugadores.find(j => j.id === data.jugadorId);
            const nombreJugador = jugador ? jugador.nombre : 'Un jugador';
            
            UI.mostrarNotificacion(
                `${nombreJugador} seleccionó: ${data.caracteristica}`,
                'info'
            );
        }
    },

    // Manejar ronda jugada
    manejarRondaJugada(data) {
        UI.ocultarLoading();
        this.estadoPartida = data.partida;
        
        UI.actualizarJuego(data.partida, this.jugadorId);
        UI.mostrarResultadoRonda(data.resultado);
        
        // Reproducir sonido según el resultado
        if (data.resultado.tipo === 'ganador') {
            if (data.resultado.ganador.id === this.jugadorId) {
                UI.mostrarNotificacion('¡Ganaste la ronda!', 'exito');
            }
        } else if (data.resultado.tipo === 'empate') {
            UI.mostrarNotificacion('¡Empate! Se acumulan las cartas', 'warning');
        }
    },

    // Manejar jugador desconectado
    manejarJugadorDesconectado(data) {
        UI.mostrarNotificacion(`${data.nombreJugador} se ha desconectado`, 'warning');
        
        if (data.partidaFinalizada) {
            UI.mostrarNotificacion('La partida ha sido cancelada por falta de jugadores', 'error');
            setTimeout(() => {
                this.reiniciar();
                UI.volverInicio();
            }, 3000);
        }
    },

    // Manejar partida finalizada
    manejarPartidaFinalizada(data) {
        this.detenerContadorTiempo();
        
        if (data.razon === 'jugadores_insuficientes') {
            UI.mostrarNotificacion('Partida finalizada: jugadores insuficientes', 'warning');
            setTimeout(() => {
                this.reiniciar();
                UI.volverInicio();
            }, 3000);
        }
    },

    // Iniciar contador de tiempo
    iniciarContadorTiempo() {
        this.tiempoInicio = Date.now();
        
        this.intervaloTiempo = setInterval(() => {
            const tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
            UI.elementos.tiempoTranscurrido.textContent = Utils.formatearTiempo(tiempoTranscurrido);
            
            // Verificar si se acabó el tiempo (30 minutos = 1800 segundos)
            if (tiempoTranscurrido >= 1800) {
                this.detenerContadorTiempo();
                UI.mostrarNotificacion('¡Tiempo agotado!', 'warning');
            }
        }, 1000);
    },

    // Detener contador de tiempo
    detenerContadorTiempo() {
        if (this.intervaloTiempo) {
            clearInterval(this.intervaloTiempo);
            this.intervaloTiempo = null;
        }
    },

    // Reiniciar juego
    reiniciar() {
        this.estadoPartida = null;
        this.jugadorId = null;
        this.codigoPartida = null;
        this.esCreador = false;
        this.detenerContadorTiempo();
        
        // Limpiar sesión guardada
        Utils.eliminar('sesion_juego');
        
        // Desconectar y reconectar socket
        SocketManager.desconectar();
        setTimeout(() => {
            SocketManager.inicializar();
        }, 500);
    }
};