// Manejo de la interfaz de usuario
const UI = {
    // Elementos del DOM
    elementos: {
        // Pantallas
        pantallaInicio: null,
        pantallaEspera: null,
        pantallaJuego: null,
        pantallaFinal: null,
        
        // Inicio
        inputNombre: null,
        inputCodigo: null,
        selectCategoria: null,
        btnCrearPartida: null,
        btnUnirsePartida: null,
        
        // Espera
        codigoMostrar: null,
        btnCopiarCodigo: null,
        contadorJugadores: null,
        listaJugadores: null,
        btnIniciarJuego: null,
        btnCancelarPartida: null,
        
        // Juego
        rondaActual: null,
        codigoJuego: null,
        tiempoTranscurrido: null,
        mensajeTurno: null,
        cartaJugador: null,
        cartasTotalesJugador: null,
        listaJugadoresJuego: null,
        selectorCaracteristicas: null,
        botonesCaracteristicas: null,
        btnJugarRonda: null,
        resultadoRonda: null,
        resultadoTitulo: null,
        resultadoDescripcion: null,
        btnContinuar: null,
        cartasEmpate: null,
        contadorEmpate: null,
        btnSalirJuego: null,
        
        // Final
        tituloFinal: null,
        ganadorInfo: null,
        tablaResultados: null,
        btnNuevaPartida: null,
        btnVolverInicio: null,
        
        // Utilidades
        notificaciones: null,
        loading: null
    },

    // Inicializar UI
    inicializar() {
        this.cargarElementos();
        this.configurarEventos();
    },

    // Cargar referencias a elementos del DOM
    cargarElementos() {
        // Pantallas
        this.elementos.pantallaInicio = document.getElementById('pantalla-inicio');
        this.elementos.pantallaEspera = document.getElementById('pantalla-espera');
        this.elementos.pantallaJuego = document.getElementById('pantalla-juego');
        this.elementos.pantallaFinal = document.getElementById('pantalla-final');
        
        // Inicio
        this.elementos.inputNombre = document.getElementById('input-nombre');
        this.elementos.inputCodigo = document.getElementById('input-codigo');
        this.elementos.selectCategoria = document.getElementById('select-categoria');
        this.elementos.btnCrearPartida = document.getElementById('btn-crear-partida');
        this.elementos.btnUnirsePartida = document.getElementById('btn-unirse-partida');
        
        // Espera
        this.elementos.codigoMostrar = document.getElementById('codigo-mostrar');
        this.elementos.btnCopiarCodigo = document.getElementById('btn-copiar-codigo');
        this.elementos.contadorJugadores = document.getElementById('contador-jugadores');
        this.elementos.listaJugadores = document.getElementById('lista-jugadores');
        this.elementos.btnIniciarJuego = document.getElementById('btn-iniciar-juego');
        this.elementos.btnCancelarPartida = document.getElementById('btn-cancelar-partida');
        
        // Juego
        this.elementos.rondaActual = document.getElementById('ronda-actual');
        this.elementos.codigoJuego = document.getElementById('codigo-juego');
        this.elementos.tiempoTranscurrido = document.getElementById('tiempo-transcurrido');
        this.elementos.mensajeTurno = document.getElementById('mensaje-turno');
        this.elementos.cartaJugador = document.getElementById('carta-jugador');
        this.elementos.cartasTotalesJugador = document.getElementById('cartas-totales-jugador');
        this.elementos.listaJugadoresJuego = document.getElementById('lista-jugadores-juego');
        this.elementos.selectorCaracteristicas = document.getElementById('selector-caracteristicas');
        this.elementos.botonesCaracteristicas = document.getElementById('botones-caracteristicas');
        this.elementos.btnJugarRonda = document.getElementById('btn-jugar-ronda');
        this.elementos.resultadoRonda = document.getElementById('resultado-ronda');
        this.elementos.resultadoTitulo = document.getElementById('resultado-titulo');
        this.elementos.resultadoDescripcion = document.getElementById('resultado-descripcion');
        this.elementos.btnContinuar = document.getElementById('btn-continuar');
        this.elementos.cartasEmpate = document.getElementById('cartas-empate');
        this.elementos.contadorEmpate = document.getElementById('contador-empate');
        this.elementos.btnSalirJuego = document.getElementById('btn-salir-juego');
        
        // Final
        this.elementos.tituloFinal = document.getElementById('titulo-final');
        this.elementos.ganadorInfo = document.getElementById('ganador-info');
        this.elementos.tablaResultados = document.getElementById('tabla-resultados');
        this.elementos.btnNuevaPartida = document.getElementById('btn-nueva-partida');
        this.elementos.btnVolverInicio = document.getElementById('btn-volver-inicio');
        
        // Utilidades
        this.elementos.notificaciones = document.getElementById('notificaciones');
        this.elementos.loading = document.getElementById('loading');
    },

    // Configurar eventos de botones
    configurarEventos() {
        // Inicio
        this.elementos.btnCrearPartida.addEventListener('click', () => {
            Game.crearPartida();
        });

        this.elementos.btnUnirsePartida.addEventListener('click', () => {
            Game.unirsePartida();
        });

        this.elementos.inputNombre.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                Game.crearPartida();
            }
        });

        this.elementos.inputCodigo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                Game.unirsePartida();
            }
        });

        // Espera
        this.elementos.btnCopiarCodigo.addEventListener('click', () => {
            this.copiarCodigo();
        });

        this.elementos.btnIniciarJuego.addEventListener('click', () => {
            Game.iniciarPartida();
        });

        this.elementos.btnCancelarPartida.addEventListener('click', () => {
            this.confirmarCancelar();
        });

        // Juego
        this.elementos.btnJugarRonda.addEventListener('click', () => {
            Game.jugarRonda();
        });

        this.elementos.btnContinuar.addEventListener('click', () => {
            this.ocultarResultadoRonda();
        });

        this.elementos.btnSalirJuego.addEventListener('click', () => {
            this.confirmarSalir();
        });

        // Final
        this.elementos.btnNuevaPartida.addEventListener('click', () => {
            this.volverInicio();
        });

        this.elementos.btnVolverInicio.addEventListener('click', () => {
            this.volverInicio();
        });
    },

    // Cambiar pantalla
    cambiarPantalla(nombrePantalla) {
        // Ocultar todas las pantallas
        this.elementos.pantallaInicio.classList.remove('activa');
        this.elementos.pantallaEspera.classList.remove('activa');
        this.elementos.pantallaJuego.classList.remove('activa');
        this.elementos.pantallaFinal.classList.remove('activa');

        // Mostrar la pantalla solicitada
        switch(nombrePantalla) {
            case 'inicio':
                this.elementos.pantallaInicio.classList.add('activa');
                break;
            case 'espera':
                this.elementos.pantallaEspera.classList.add('activa');
                break;
            case 'juego':
                this.elementos.pantallaJuego.classList.add('activa');
                break;
            case 'final':
                this.elementos.pantallaFinal.classList.add('activa');
                break;
        }
    },

    // Mostrar loading
    mostrarLoading() {
        this.elementos.loading.classList.remove('oculto');
    },

    // Ocultar loading
    ocultarLoading() {
        this.elementos.loading.classList.add('oculto');
    },

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        
        const iconos = {
            exito: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notificacion.innerHTML = `
            <span class="notificacion-icono">${iconos[tipo] || iconos.info}</span>
            <span class="notificacion-mensaje">${mensaje}</span>
        `;

        this.elementos.notificaciones.appendChild(notificacion);

        // Auto-eliminar
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }, duracion);
    },

    // Actualizar sala de espera
    actualizarSalaEspera(partida, esCreador) {
        this.elementos.codigoMostrar.textContent = partida.codigo;
        this.elementos.contadorJugadores.textContent = partida.jugadores.length;

        // Actualizar lista de jugadores
        this.elementos.listaJugadores.innerHTML = '';
        partida.jugadores.forEach((jugador, index) => {
            const jugadorItem = document.createElement('div');
            jugadorItem.className = 'jugador-item';
            jugadorItem.innerHTML = `
                <div class="jugador-avatar">${Utils.generarAvatar(jugador.nombre)}</div>
                <div class="jugador-nombre">${jugador.nombre}</div>
                ${index === 0 ? '<span class="jugador-badge">Anfitrión</span>' : ''}
            `;
            this.elementos.listaJugadores.appendChild(jugadorItem);
        });

        // Habilitar botón de inicio si hay al menos 2 jugadores y es el creador
        if (partida.jugadores.length >= 2 && esCreador) {
            this.elementos.btnIniciarJuego.disabled = false;
            this.elementos.btnIniciarJuego.textContent = 'Iniciar Juego';
        }
    },

    // Actualizar juego
    actualizarJuego(partida, jugadorId) {
        // Actualizar información básica
        this.elementos.rondaActual.textContent = partida.rondaActual;
        this.elementos.codigoJuego.textContent = partida.codigo;
        this.elementos.cartasTotalesJugador.textContent = partida.cantidadCartasTotal;

        // Actualizar mensaje de turno
        if (partida.esMiTurno) {
            this.elementos.mensajeTurno.textContent = '🎯 ¡Es tu turno!';
            this.elementos.mensajeTurno.style.color = 'var(--color-success)';
        } else {
            const jugadorTurno = partida.jugadores.find(j => j.esMiTurno);
            if (jugadorTurno) {
                this.elementos.mensajeTurno.textContent = `Turno de ${jugadorTurno.nombre}`;
                this.elementos.mensajeTurno.style.color = 'var(--color-text-secondary)';
            }
        }

        // Actualizar carta del jugador
        if (partida.cartaActual) {
            this.renderizarCarta(partida.cartaActual);
        }

        // Actualizar lista de jugadores
        this.renderizarJugadores(partida.jugadores);

        // Mostrar/ocultar selector de características
        if (partida.esMiTurno && !partida.caracteristicaSeleccionada) {
            this.mostrarSelectorCaracteristicas(partida.cartaActual);
        } else {
            this.elementos.selectorCaracteristicas.classList.add('oculto');
        }

        // Mostrar/ocultar botón de jugar ronda
        if (partida.caracteristicaSeleccionada && !partida.esMiTurno) {
            this.elementos.btnJugarRonda.classList.remove('oculto');
        } else {
            this.elementos.btnJugarRonda.classList.add('oculto');
        }

        // Actualizar cartas de empate
        if (partida.cartasEmpateAcumuladas > 0) {
            this.elementos.cartasEmpate.classList.remove('oculto');
            this.elementos.contadorEmpate.textContent = partida.cartasEmpateAcumuladas;
        } else {
            this.elementos.cartasEmpate.classList.add('oculto');
        }
    },

    // Renderizar carta
    renderizarCarta(carta) {
        if (!carta) {
            this.elementos.cartaJugador.innerHTML = `
                <div class="carta-placeholder">
                    <p>Sin cartas disponibles</p>
                </div>
            `;
            return;
        }

        const caracteristicasHTML = Object.entries(carta.caracteristicas)
            .map(([nombre, valor]) => `
                <div class="caracteristica" style="border-left: 3px solid ${Utils.obtenerColorCaracteristica(nombre)}">
                    <span class="caracteristica-nombre">${nombre}</span>
                    <span class="caracteristica-valor">${valor}</span>
                </div>
            `).join('');

        this.elementos.cartaJugador.innerHTML = `
            <div class="carta-contenido">
                <div class="carta-imagen" style="position: relative;">
                    <span style="font-size: 64px;">🎴</span>
                    <div class="carta-id">${carta.id}</div>
                </div>
                <div class="carta-info">
                    <div class="carta-nombre">${carta.nombre}</div>
                    <div class="carta-caracteristicas">
                        ${caracteristicasHTML}
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar jugadores
    renderizarJugadores(jugadores) {
        this.elementos.listaJugadoresJuego.innerHTML = '';
        
        jugadores.forEach(jugador => {
            const jugadorCard = document.createElement('div');
            jugadorCard.className = 'jugador-card';
            
            if (jugador.esMiTurno) {
                jugadorCard.classList.add('activo');
            }
            
            if (jugador.soyYo) {
                jugadorCard.classList.add('yo');
            }

            jugadorCard.innerHTML = `
                <div class="jugador-card-avatar">${Utils.generarAvatar(jugador.nombre)}</div>
                <div class="jugador-card-nombre">${jugador.nombre}</div>
                <div class="jugador-card-cartas">🎴 ${jugador.cantidadCartas} cartas</div>
            `;

            this.elementos.listaJugadoresJuego.appendChild(jugadorCard);
        });
    },

    // Mostrar selector de características
    mostrarSelectorCaracteristicas(carta) {
        if (!carta || !carta.caracteristicas) return;

        this.elementos.selectorCaracteristicas.classList.remove('oculto');
        this.elementos.botonesCaracteristicas.innerHTML = '';

        Object.keys(carta.caracteristicas).forEach(caracteristica => {
            const btn = document.createElement('button');
            btn.className = 'btn-caracteristica';
            btn.textContent = caracteristica;
            btn.style.borderColor = Utils.obtenerColorCaracteristica(caracteristica);
            
            btn.addEventListener('click', () => {
                Game.seleccionarCaracteristica(caracteristica);
                this.elementos.selectorCaracteristicas.classList.add('oculto');
            });

            this.elementos.botonesCaracteristicas.appendChild(btn);
        });
    },

    // Mostrar resultado de ronda
    mostrarResultadoRonda(resultado) {
        this.elementos.resultadoRonda.classList.remove('oculto');

        if (resultado.tipo === 'ganador') {
            this.elementos.resultadoTitulo.textContent = '🏆 ¡Ganador de la Ronda!';
            this.elementos.resultadoDescripcion.innerHTML = `
                <p><strong>${resultado.ganador.nombre}</strong> gana la ronda</p>
                <p>Valor: ${resultado.valorGanador}</p>
                <p>Cartas ganadas: ${resultado.cartasGanadas}</p>
            `;
        } else if (resultado.tipo === 'empate') {
            this.elementos.resultadoTitulo.textContent = '⚔️ ¡Empate!';
            const nombresEmpatados = resultado.jugadoresEmpatados.map(j => j.nombre).join(', ');
            this.elementos.resultadoDescripcion.innerHTML = `
                <p>Empate entre: <strong>${nombresEmpatados}</strong></p>
                <p>Valor: ${resultado.valorEmpate}</p>
                <p>Cartas acumuladas: ${resultado.cartasAcumuladas}</p>
                <p>La siguiente ronda decidirá el ganador</p>
            `;
        }

        // Si el juego terminó
        if (resultado.juegoTerminado) {
            setTimeout(() => {
                this.mostrarPantallaFinal(resultado.ganadorFinal);
            }, 3000);
        }
    },

    // Ocultar resultado de ronda
    ocultarResultadoRonda() {
        this.elementos.resultadoRonda.classList.add('oculto');
    },

    // Mostrar pantalla final
    mostrarPantallaFinal(ganadorFinal) {
        this.cambiarPantalla('final');

        if (ganadorFinal.tipo === 'absoluto') {
            this.elementos.tituloFinal.textContent = '🏆 ¡Victoria Absoluta!';
            this.elementos.ganadorInfo.innerHTML = `
                <h2>${ganadorFinal.ganador.nombre}</h2>
                <p>Ha recolectado todas las cartas</p>
            `;
        } else if (ganadorFinal.tipo === 'tiempo') {
            this.elementos.tituloFinal.textContent = '⏱️ Tiempo Agotado';
            this.elementos.ganadorInfo.innerHTML = `
                <h2>${ganadorFinal.ganador.nombre}</h2>
                <p>Ganador por mayor cantidad de cartas</p>
            `;
        } else if (ganadorFinal.tipo === 'empate') {
            this.elementos.tituloFinal.textContent = '🤝 ¡Empate!';
            const nombresGanadores = ganadorFinal.ganadores.map(g => g.nombre).join(', ');
            this.elementos.ganadorInfo.innerHTML = `
                <h2>Empate General</h2>
                <p>Entre: ${nombresGanadores}</p>
            `;
        }

        // Mostrar tabla de resultados
        const jugadores = Game.estadoPartida.jugadores.sort((a, b) => b.cantidadCartas - a.cantidadCartas);
        this.elementos.tablaResultados.innerHTML = '';

        jugadores.forEach((jugador, index) => {
            const resultadoJugador = document.createElement('div');
            resultadoJugador.className = 'resultado-jugador';
            
            if (index === 0) {
                resultadoJugador.classList.add('primer-lugar');
            }

            const posiciones = ['🥇', '🥈', '🥉'];
            const posicion = posiciones[index] || `${index + 1}º`;

            resultadoJugador.innerHTML = `
                <div class="resultado-posicion">${posicion}</div>
                <div class="resultado-nombre">${jugador.nombre}</div>
                <div class="resultado-cartas">${jugador.cantidadCartas} cartas</div>
            `;

            this.elementos.tablaResultados.appendChild(resultadoJugador);
        });
    },

    // Copiar código
    async copiarCodigo() {
        const codigo = this.elementos.codigoMostrar.textContent;
        const copiado = await Utils.copiarAlPortapapeles(codigo);
        
        if (copiado) {
            this.mostrarNotificacion('Código copiado al portapapeles', 'exito');
        } else {
            this.mostrarNotificacion('No se pudo copiar el código', 'error');
        }
    },

    // Confirmar cancelar
    confirmarCancelar() {
        if (confirm('¿Estás seguro de que quieres cancelar la partida?')) {
            this.volverInicio();
        }
    },

    // Confirmar salir
    confirmarSalir() {
        if (confirm('¿Estás seguro de que quieres salir del juego?')) {
            this.volverInicio();
        }
    },

    // Volver al inicio
    volverInicio() {
        Game.reiniciar();
        this.cambiarPantalla('inicio');
        this.limpiarFormularios();
    },

    // Limpiar formularios
    limpiarFormularios() {
        this.elementos.inputNombre.value = '';
        this.elementos.inputCodigo.value = '';
        this.elementos.selectCategoria.selectedIndex = 0;
    }
};