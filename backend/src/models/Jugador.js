class Jugador {
  constructor(id, nombre, socketId) {
    this.id = id;
    this.nombre = nombre;
    this.socketId = socketId;
    this.cartas = [];
    this.cartaActual = null;
    this.estaActivo = true;
    this.ordenConexion = 0;
  }

  agregarCartas(cartas) {
    this.cartas.push(...cartas);
    this.actualizarCartaActual();
  }

  agregarCarta(carta) {
    this.cartas.push(carta);
    if (!this.cartaActual) {
      this.actualizarCartaActual();
    }
  }

  quitarCartaActual() {
    const carta = this.cartaActual;
    this.actualizarCartaActual();
    return carta;
  }

  actualizarCartaActual() {
    this.cartaActual = this.cartas.length > 0 ? this.cartas[0] : null;
  }

  tieneCartas() {
    return this.cartas.length > 0;
  }

  obtenerCantidadCartas() {
    return this.cartas.length;
  }

  obtenerInfoBasica() {
    return {
      id: this.id,
      nombre: this.nombre,
      cantidadCartas: this.cartas.length,
      tieneCartas: this.tieneCartas(),
      ordenConexion: this.ordenConexion
    };
  }
}

module.exports = Jugador;