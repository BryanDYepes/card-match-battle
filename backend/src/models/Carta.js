class Carta {
  constructor(id, nombre, imagen, caracteristicas, categoria) {
    this.id = id; // Ejemplo: "1A", "1B", etc.
    this.nombre = nombre;
    this.imagen = imagen;
    this.caracteristicas = caracteristicas; // { fuerza: 85, velocidad: 70, ... }
    this.categoria = categoria; // "animales", "pokemon", etc.
  }

  obtenerValorCaracteristica(nombreCaracteristica) {
    return this.caracteristicas[nombreCaracteristica] || 0;
  }

  obtenerCaracteristicas() {
    return Object.keys(this.caracteristicas);
  }
}

module.exports = Carta;