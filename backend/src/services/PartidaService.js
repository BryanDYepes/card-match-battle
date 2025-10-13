const Partida = require('../models/Partida');
const Jugador = require('../models/Jugador');
const cartasService = require('./CartasService');
const { v4: uuidv4 } = require('uuid');

class PartidaService {
  constructor() {
    this.partidas = new Map();
  }

  generarCodigoPartida() {
    let codigo;
    do {
      codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (this.partidas.has(codigo));
    return codigo;
  }

  crearPartida(creadorId, nombreCreador, socketId, categoria = 'pokemon') {
    const codigo = this.generarCodigoPartida();
    const partida = new Partida(codigo, creadorId);
    
    const jugadorCreador = new Jugador(creadorId, nombreCreador, socketId);
    partida.agregarJugador(jugadorCreador);
    partida.categoriaSeleccionada = categoria;
    
    this.partidas.set(codigo, partida);
    
    return partida;
  }

  unirseAPartida(codigo, jugadorId, nombreJugador, socketId) {
    const partida = this.partidas.get(codigo);
    
    if (!partida) {
      return { exito: false, mensaje: 'La partida no existe' };
    }

    if (partida.estado !== 'esperando') {
      return { exito: false, mensaje: 'La partida ya ha comenzado' };
    }

    if (partida.jugadores.size >= 7) {
      return { exito: false, mensaje: 'La partida está llena (máximo 7 jugadores)' };
    }

    const nuevoJugador = new Jugador(jugadorId, nombreJugador, socketId);
    const debeIniciar = partida.agregarJugador(nuevoJugador);
    
    return { exito: true, partida, debeIniciar };
  }

  iniciarPartida(codigo) {
    const partida = this.partidas.get(codigo);
    
    if (!partida) {
      return { exito: false, mensaje: 'La partida no existe' };
    }

    if (!partida.puedeIniciar()) {
      return { exito: false, mensaje: 'Se necesitan al menos 2 jugadores para iniciar' };
    }

    // Obtener mazo de cartas según la categoría
    const mazo = cartasService.obtenerMazo(partida.categoriaSeleccionada || 'pokemon');
    
    // Repartir cartas entre los jugadores
    const jugadores = partida.obtenerTodosLosJugadores();
    const cartasRepartidas = cartasService.repartirCartas(mazo, jugadores.length);
    
    jugadores.forEach((jugador, index) => {
      jugador.agregarCartas(cartasRepartidas[index]);
    });

    // Determinar quién empieza según las reglas
    const jugadorInicial = this.determinarJugadorInicial(partida);
    partida.establecerTurno(jugadorInicial.id);
    
    partida.iniciar();
    
    return { exito: true, partida };
  }

  determinarJugadorInicial(partida) {
    const jugadores = partida.obtenerTodosLosJugadores();
    const cartasOrdenadas = ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D'];
    
    for (const idCarta of cartasOrdenadas) {
      for (const jugador of jugadores) {
        const tieneCarta = jugador.cartas.some(carta => carta.id === idCarta);
        if (tieneCarta) {
          return jugador;
        }
      }
    }
    
    // Si ninguna carta prioritaria existe, empieza el primero que se conectó
    return jugadores.sort((a, b) => a.ordenConexion - b.ordenConexion)[0];
  }

  seleccionarCaracteristica(codigo, jugadorId, caracteristica) {
    const partida = this.partidas.get(codigo);
    
    if (!partida) {
      return { exito: false, mensaje: 'La partida no existe' };
    }

    if (partida.turnoActual !== jugadorId) {
      return { exito: false, mensaje: 'No es tu turno' };
    }

    partida.caracteristicaSeleccionada = caracteristica;
    
    return { exito: true, partida };
  }

  jugarRonda(codigo) {
    const partida = this.partidas.get(codigo);
    
    if (!partida) {
      return { exito: false, mensaje: 'La partida no existe' };
    }

    const jugadoresActivos = partida.obtenerJugadoresActivos();
    
    if (jugadoresActivos.length < 2) {
      return { exito: false, mensaje: 'No hay suficientes jugadores activos' };
    }

    // Recolectar cartas de todos los jugadores
    const cartasJugadas = [];
    jugadoresActivos.forEach(jugador => {
      if (jugador.cartaActual) {
        cartasJugadas.push({
          carta: jugador.cartaActual,
          jugador: jugador
        });
      }
    });

    // Comparar valores de la característica seleccionada
    const caracteristica = partida.caracteristicaSeleccionada;
    let valorMaximo = -Infinity;
    let ganadores = [];

    cartasJugadas.forEach(({ carta, jugador }) => {
      const valor = carta.obtenerValorCaracteristica(caracteristica);
      
      if (valor > valorMaximo) {
        valorMaximo = valor;
        ganadores = [{ carta, jugador }];
      } else if (valor === valorMaximo) {
        ganadores.push({ carta, jugador });
      }
    });

    let resultado;

    if (ganadores.length === 1) {
      // Hay un ganador único
      const ganador = ganadores[0].jugador;
      
      // El ganador recoge todas las cartas jugadas
      cartasJugadas.forEach(({ carta }) => {
        ganador.agregarCarta(carta);
      });

      // Si había cartas de empates anteriores, también las recoge
      if (partida.cartasEmpate.length > 0) {
        partida.cartasEmpate.forEach(carta => {
          ganador.agregarCarta(carta);
        });
        partida.cartasEmpate = [];
      }

      // Remover las cartas jugadas de los jugadores
      jugadoresActivos.forEach(jugador => {
        if (jugador.id !== ganador.id) {
          jugador.cartas.shift();
          jugador.actualizarCartaActual();
        }
      });

      // El ganador elige la próxima característica
      partida.establecerTurno(ganador.id);
      partida.caracteristicaSeleccionada = null;

      resultado = {
        tipo: 'ganador',
        ganador: ganador.obtenerInfoBasica(),
        cartasGanadas: cartasJugadas.length + (partida.cartasEmpate.length || 0),
        valorGanador: valorMaximo
      };

    } else {
      // Hay empate
      cartasJugadas.forEach(({ carta }) => {
        partida.cartasEmpate.push(carta);
      });

      // Remover las cartas de todos los jugadores pero no las asignan a nadie
      jugadoresActivos.forEach(jugador => {
        jugador.cartas.shift();
        jugador.actualizarCartaActual();
      });

      // El turno se mantiene en el mismo jugador
      resultado = {
        tipo: 'empate',
        jugadoresEmpatados: ganadores.map(g => g.jugador.obtenerInfoBasica()),
        valorEmpate: valorMaximo,
        cartasAcumuladas: partida.cartasEmpate.length
      };
    }

    partida.rondaActual++;

    // Verificar si hay un ganador absoluto o si se acabó el tiempo
    const ganadorFinal = partida.obtenerGanador();
    if (ganadorFinal) {
      partida.finalizarPartida();
      resultado.juegoTerminado = true;
      resultado.ganadorFinal = ganadorFinal;
    }

    return { exito: true, resultado, partida };
  }

  obtenerPartida(codigo) {
    return this.partidas.get(codigo);
  }

  eliminarPartida(codigo) {
    this.partidas.delete(codigo);
  }

  desconectarJugador(socketId) {
    let partidaAfectada = null;
    let jugadorEliminado = null;

    for (const [codigo, partida] of this.partidas) {
      for (const jugador of partida.obtenerTodosLosJugadores()) {
        if (jugador.socketId === socketId) {
          jugadorEliminado = jugador;
          partida.eliminarJugador(jugador.id);
          partidaAfectada = partida;
          
          // Si la partida queda vacía o con menos de 2 jugadores en juego, finalizarla
          if (partida.jugadores.size === 0) {
            this.eliminarPartida(codigo);
          } else if (partida.estado === 'jugando' && partida.obtenerJugadoresActivos().length < 2) {
            partida.finalizarPartida();
          }
          
          break;
        }
      }
      if (partidaAfectada) break;
    }

    return { partida: partidaAfectada, jugador: jugadorEliminado };
  }

  obtenerEstadisticas() {
    return {
      partidasActivas: this.partidas.size,
      partidas: Array.from(this.partidas.values()).map(p => p.obtenerEstado())
    };
  }
}

module.exports = new PartidaService();