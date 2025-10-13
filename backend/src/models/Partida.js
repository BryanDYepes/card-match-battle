const { v4: uuidv4 } = require('uuid');

class Partida {
  constructor(codigo, creadorId) {
    this.codigo = codigo;
    this.creadorId = creadorId;
    this.jugadores = new Map();
    this.estado = 'esperando'; // esperando, jugando, finalizada
    this.turnoActual = null;
    this.cartasEnMesa = [];
    this.caracteristicaSeleccionada = null;
    this.rondaActual = 0;
    this.horaInicio = null;
    this.duracionMaxima = 30 * 60 * 1000; // 30 minutos en milisegundos
    this.ordenJugadores = [];
    this.cartasEmpate = []; // Cartas acumuladas en caso de empate
  }

  agregarJugador(jugador) {
    jugador.ordenConexion = this.jugadores.size + 1;
    this.jugadores.set(jugador.id, jugador);
    this.ordenJugadores.push(jugador.id);
    
    // Si llegan 7 jugadores, iniciar automáticamente
    if (this.jugadores.size === 7 && this.estado === 'esperando') {
      return true; // Señal para iniciar
    }
    return false;
  }

  eliminarJugador(jugadorId) {
    const jugador = this.jugadores.get(jugadorId);
    if (jugador) {
      this.jugadores.delete(jugadorId);
      this.ordenJugadores = this.ordenJugadores.filter(id => id !== jugadorId);
      return true;
    }
    return false;
  }

  obtenerJugador(jugadorId) {
    return this.jugadores.get(jugadorId);
  }

  obtenerTodosLosJugadores() {
    return Array.from(this.jugadores.values());
  }

  puedeIniciar() {
    return this.jugadores.size >= 2 && this.estado === 'esperando';
  }

  iniciar() {
    if (!this.puedeIniciar()) {
      return false;
    }
    this.estado = 'jugando';
    this.horaInicio = Date.now();
    this.rondaActual = 1;
    return true;
  }

  establecerTurno(jugadorId) {
    this.turnoActual = jugadorId;
  }

  obtenerJugadorTurnoActual() {
    return this.jugadores.get(this.turnoActual);
  }

  siguienteTurno() {
    const jugadoresActivos = this.obtenerJugadoresActivos();
    if (jugadoresActivos.length === 0) return null;

    const indiceActual = jugadoresActivos.findIndex(j => j.id === this.turnoActual);
    const siguienteIndice = (indiceActual + 1) % jugadoresActivos.length;
    this.turnoActual = jugadoresActivos[siguienteIndice].id;
    return this.turnoActual;
  }

  obtenerJugadoresActivos() {
    return this.obtenerTodosLosJugadores().filter(j => j.tieneCartas());
  }

  verificarTiempoLimite() {
    if (!this.horaInicio) return false;
    return (Date.now() - this.horaInicio) >= this.duracionMaxima;
  }

  finalizarPartida() {
    this.estado = 'finalizada';
  }

  obtenerGanador() {
    const jugadoresActivos = this.obtenerJugadoresActivos();
    
    // Si solo queda un jugador con cartas
    if (jugadoresActivos.length === 1) {
      return {
        tipo: 'absoluto',
        ganador: jugadoresActivos[0]
      };
    }

    // Si se acabó el tiempo, buscar quien tiene más cartas
    if (this.verificarTiempoLimite()) {
      let maxCartas = 0;
      let ganadores = [];

      jugadoresActivos.forEach(jugador => {
        const cantidad = jugador.obtenerCantidadCartas();
        if (cantidad > maxCartas) {
          maxCartas = cantidad;
          ganadores = [jugador];
        } else if (cantidad === maxCartas) {
          ganadores.push(jugador);
        }
      });

      if (ganadores.length === 1) {
        return {
          tipo: 'tiempo',
          ganador: ganadores[0]
        };
      } else {
        return {
          tipo: 'empate',
          ganadores: ganadores
        };
      }
    }

    return null;
  }

  obtenerEstado() {
    return {
      codigo: this.codigo,
      estado: this.estado,
      cantidadJugadores: this.jugadores.size,
      turnoActual: this.turnoActual,
      rondaActual: this.rondaActual,
      caracteristicaSeleccionada: this.caracteristicaSeleccionada,
      jugadores: this.obtenerTodosLosJugadores().map(j => j.obtenerInfoBasica())
    };
  }
}

module.exports = Partida;