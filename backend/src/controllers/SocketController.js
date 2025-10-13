const partidaService = require('../services/PartidaService');
const { v4: uuidv4 } = require('uuid');

class SocketController {
  constructor(io) {
    this.io = io;
    this.inicializarEventos();
  }

  inicializarEventos() {
    this.io.on('connection', (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      // Crear nueva partida
      socket.on('crear_partida', (data) => {
        this.crearPartida(socket, data);
      });

      // Unirse a una partida
      socket.on('unirse_partida', (data) => {
        this.unirsePartida(socket, data);
      });

      // Iniciar partida manualmente
      socket.on('iniciar_partida', (data) => {
        this.iniciarPartida(socket, data);
      });

      // Seleccionar característica
      socket.on('seleccionar_caracteristica', (data) => {
        this.seleccionarCaracteristica(socket, data);
      });

      // Jugar ronda
      socket.on('jugar_ronda', (data) => {
        this.jugarRonda(socket, data);
      });

      // Obtener estado de la partida
      socket.on('obtener_estado', (data) => {
        this.obtenerEstado(socket, data);
      });

      // Desconexión
      socket.on('disconnect', () => {
        this.manejarDesconexion(socket);
      });
    });
  }

  crearPartida(socket, data) {
    try {
      const { nombreJugador, categoria } = data;
      const jugadorId = uuidv4();
      
      const partida = partidaService.crearPartida(jugadorId, nombreJugador, socket.id, categoria);
      
      socket.join(partida.codigo);
      
      socket.emit('partida_creada', {
        exito: true,
        codigo: partida.codigo,
        jugadorId: jugadorId,
        partida: this.serializarPartida(partida, jugadorId)
      });

      console.log(`Partida creada: ${partida.codigo} por ${nombreJugador}`);
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al crear la partida', error: error.message });
      console.error('Error al crear partida:', error);
    }
  }

  unirsePartida(socket, data) {
    try {
      const { codigo, nombreJugador } = data;
      const jugadorId = uuidv4();
      
      const resultado = partidaService.unirseAPartida(codigo, jugadorId, nombreJugador, socket.id);
      
      if (!resultado.exito) {
        socket.emit('error_unirse', { mensaje: resultado.mensaje });
        return;
      }

      const partida = resultado.partida;
      socket.join(codigo);
      
      socket.emit('partida_unida', {
        exito: true,
        codigo: codigo,
        jugadorId: jugadorId,
        partida: this.serializarPartida(partida, jugadorId)
      });

      // Notificar a todos los jugadores que alguien se unió
      this.io.to(codigo).emit('jugador_unido', {
        jugador: {
          id: jugadorId,
          nombre: nombreJugador,
          cantidadCartas: 0
        },
        cantidadJugadores: partida.jugadores.size
      });

      console.log(`${nombreJugador} se unió a la partida ${codigo}`);

      // Si es el séptimo jugador, iniciar automáticamente
      if (resultado.debeIniciar) {
        setTimeout(() => {
          this.iniciarPartidaAutomatica(codigo);
        }, 1000);
      }
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al unirse a la partida', error: error.message });
      console.error('Error al unirse a partida:', error);
    }
  }

  iniciarPartida(socket, data) {
    try {
      const { codigo } = data;
      const resultado = partidaService.iniciarPartida(codigo);
      
      if (!resultado.exito) {
        socket.emit('error', { mensaje: resultado.mensaje });
        return;
      }

      const partida = resultado.partida;
      
      // Notificar a todos los jugadores que la partida comenzó
      partida.obtenerTodosLosJugadores().forEach(jugador => {
        this.io.to(jugador.socketId).emit('partida_iniciada', {
          partida: this.serializarPartida(partida, jugador.id)
        });
      });

      console.log(`Partida ${codigo} iniciada`);
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al iniciar la partida', error: error.message });
      console.error('Error al iniciar partida:', error);
    }
  }

  iniciarPartidaAutomatica(codigo) {
    try {
      const resultado = partidaService.iniciarPartida(codigo);
      
      if (!resultado.exito) {
        console.error('Error al iniciar automáticamente:', resultado.mensaje);
        return;
      }

      const partida = resultado.partida;
      
      partida.obtenerTodosLosJugadores().forEach(jugador => {
        this.io.to(jugador.socketId).emit('partida_iniciada', {
          partida: this.serializarPartida(partida, jugador.id)
        });
      });

      console.log(`Partida ${codigo} iniciada automáticamente (7 jugadores)`);
    } catch (error) {
      console.error('Error al iniciar partida automáticamente:', error);
    }
  }

  seleccionarCaracteristica(socket, data) {
    try {
      const { codigo, jugadorId, caracteristica } = data;
      
      const resultado = partidaService.seleccionarCaracteristica(codigo, jugadorId, caracteristica);
      
      if (!resultado.exito) {
        socket.emit('error', { mensaje: resultado.mensaje });
        return;
      }

      const partida = resultado.partida;
      
      // Notificar a todos que se seleccionó una característica
      this.io.to(codigo).emit('caracteristica_seleccionada', {
        caracteristica: caracteristica,
        jugadorId: jugadorId
      });

      console.log(`Característica "${caracteristica}" seleccionada en partida ${codigo}`);
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al seleccionar característica', error: error.message });
      console.error('Error al seleccionar característica:', error);
    }
  }

  jugarRonda(socket, data) {
    try {
      const { codigo } = data;
      
      const resultado = partidaService.jugarRonda(codigo);
      
      if (!resultado.exito) {
        socket.emit('error', { mensaje: resultado.mensaje });
        return;
      }

      const partida = resultado.partida;
      
      // Enviar resultado de la ronda a todos los jugadores
      partida.obtenerTodosLosJugadores().forEach(jugador => {
        this.io.to(jugador.socketId).emit('ronda_jugada', {
          resultado: resultado.resultado,
          partida: this.serializarPartida(partida, jugador.id)
        });
      });

      console.log(`Ronda jugada en partida ${codigo}:`, resultado.resultado.tipo);
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al jugar la ronda', error: error.message });
      console.error('Error al jugar ronda:', error);
    }
  }

  obtenerEstado(socket, data) {
    try {
      const { codigo, jugadorId } = data;
      const partida = partidaService.obtenerPartida(codigo);
      
      if (!partida) {
        socket.emit('error', { mensaje: 'La partida no existe' });
        return;
      }

      socket.emit('estado_actualizado', {
        partida: this.serializarPartida(partida, jugadorId)
      });
    } catch (error) {
      socket.emit('error', { mensaje: 'Error al obtener estado', error: error.message });
      console.error('Error al obtener estado:', error);
    }
  }

  manejarDesconexion(socket) {
    const { partida, jugador } = partidaService.desconectarJugador(socket.id);
    
    if (partida && jugador) {
      console.log(`Jugador ${jugador.nombre} desconectado de partida ${partida.codigo}`);
      
      // Notificar a los demás jugadores
      this.io.to(partida.codigo).emit('jugador_desconectado', {
        jugadorId: jugador.id,
        nombreJugador: jugador.nombre,
        partidaFinalizada: partida.estado === 'finalizada'
      });

      if (partida.estado === 'finalizada') {
        this.io.to(partida.codigo).emit('partida_finalizada', {
          razon: 'jugadores_insuficientes'
        });
      }
    }
    
    console.log(`Cliente desconectado: ${socket.id}`);
  }

  serializarPartida(partida, jugadorId) {
    const jugador = partida.obtenerJugador(jugadorId);
    const jugadoresInfo = partida.obtenerTodosLosJugadores().map(j => ({
      id: j.id,
      nombre: j.nombre,
      cantidadCartas: j.obtenerCantidadCartas(),
      esMiTurno: j.id === partida.turnoActual,
      soyYo: j.id === jugadorId
    }));

    return {
      codigo: partida.codigo,
      estado: partida.estado,
      turnoActual: partida.turnoActual,
      esMiTurno: jugador && jugador.id === partida.turnoActual,
      rondaActual: partida.rondaActual,
      caracteristicaSeleccionada: partida.caracteristicaSeleccionada,
      cartaActual: jugador ? jugador.cartaActual : null,
      cantidadCartasTotal: jugador ? jugador.obtenerCantidadCartas() : 0,
      jugadores: jugadoresInfo,
      cartasEmpateAcumuladas: partida.cartasEmpate.length
    };
  }
}

module.exports = SocketController;