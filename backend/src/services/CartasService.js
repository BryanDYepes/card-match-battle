const Carta = require('../models/Carta');

class CartasService {
  constructor() {
    this.mazos = {
      pokemon: this.generarMazoPokemon(),
      animales: this.generarMazoAnimales(),
      planetas: this.generarMazoPlanetas(),
      superheroes: this.generarMazoSuperheroes()
    };
  }

  generarMazoPokemon() {
    const pokemon = [
      { nombre: 'Pikachu', ataque: 55, defensa: 40, velocidad: 90, ps: 35, rareza: 75 },
      { nombre: 'Charizard', ataque: 84, defensa: 78, velocidad: 100, ps: 78, rareza: 95 },
      { nombre: 'Blastoise', ataque: 83, defensa: 100, velocidad: 78, ps: 79, rareza: 90 },
      { nombre: 'Venusaur', ataque: 82, defensa: 83, velocidad: 80, ps: 80, rareza: 88 },
      { nombre: 'Mewtwo', ataque: 110, defensa: 90, velocidad: 130, ps: 106, rareza: 100 },
      { nombre: 'Dragonite', ataque: 134, defensa: 95, velocidad: 80, ps: 91, rareza: 92 },
      { nombre: 'Gengar', ataque: 65, defensa: 60, velocidad: 110, ps: 60, rareza: 85 },
      { nombre: 'Alakazam', ataque: 50, defensa: 45, velocidad: 120, ps: 55, rareza: 87 },
      { nombre: 'Machamp', ataque: 130, defensa: 80, velocidad: 55, ps: 90, rareza: 80 },
      { nombre: 'Gyarados', ataque: 125, defensa: 79, velocidad: 81, ps: 95, rareza: 83 },
      { nombre: 'Lapras', ataque: 85, defensa: 80, velocidad: 60, ps: 130, rareza: 78 },
      { nombre: 'Snorlax', ataque: 110, defensa: 65, velocidad: 30, ps: 160, rareza: 82 },
      { nombre: 'Articuno', ataque: 85, defensa: 100, velocidad: 85, ps: 90, rareza: 96 },
      { nombre: 'Zapdos', ataque: 90, defensa: 85, velocidad: 100, ps: 90, rareza: 96 },
      { nombre: 'Moltres', ataque: 100, defensa: 90, velocidad: 90, ps: 90, rareza: 96 },
      { nombre: 'Mew', ataque: 100, defensa: 100, velocidad: 100, ps: 100, rareza: 100 },
      { nombre: 'Eevee', ataque: 55, defensa: 50, velocidad: 55, ps: 55, rareza: 70 },
      { nombre: 'Jolteon', ataque: 65, defensa: 60, velocidad: 130, ps: 65, rareza: 85 },
      { nombre: 'Vaporeon', ataque: 65, defensa: 60, velocidad: 65, ps: 130, rareza: 85 },
      { nombre: 'Flareon', ataque: 130, defensa: 60, velocidad: 65, ps: 65, rareza: 85 },
      { nombre: 'Espeon', ataque: 65, defensa: 60, velocidad: 110, ps: 65, rareza: 87 },
      { nombre: 'Umbreon', ataque: 65, defensa: 110, velocidad: 65, ps: 95, rareza: 87 },
      { nombre: 'Lucario', ataque: 110, defensa: 70, velocidad: 90, ps: 70, rareza: 88 },
      { nombre: 'Garchomp', ataque: 130, defensa: 95, velocidad: 102, ps: 108, rareza: 93 },
      { nombre: 'Tyranitar', ataque: 134, defensa: 110, velocidad: 61, ps: 100, rareza: 91 },
      { nombre: 'Metagross', ataque: 135, defensa: 130, velocidad: 70, ps: 80, rareza: 94 },
      { nombre: 'Salamence', ataque: 135, defensa: 80, velocidad: 100, ps: 95, rareza: 92 },
      { nombre: 'Rayquaza', ataque: 150, defensa: 90, velocidad: 95, ps: 105, rareza: 98 },
      { nombre: 'Lugia', ataque: 90, defensa: 130, velocidad: 110, ps: 106, rareza: 97 },
      { nombre: 'Ho-Oh', ataque: 130, defensa: 90, velocidad: 90, ps: 106, rareza: 97 },
      { nombre: 'Kyogre', ataque: 100, defensa: 90, velocidad: 90, ps: 100, rareza: 98 },
      { nombre: 'Groudon', ataque: 150, defensa: 140, velocidad: 90, ps: 100, rareza: 98 }
    ];

    return this.crearCartasDesdeData(pokemon, 'pokemon', ['ataque', 'defensa', 'velocidad', 'ps', 'rareza']);
  }

  generarMazoAnimales() {
    const animales = [
      { nombre: 'León', fuerza: 90, velocidad: 80, tamaño: 85, inteligencia: 70, peligrosidad: 95 },
      { nombre: 'Tigre', fuerza: 95, velocidad: 85, tamaño: 80, inteligencia: 72, peligrosidad: 98 },
      { nombre: 'Elefante', fuerza: 100, velocidad: 40, tamaño: 100, inteligencia: 85, peligrosidad: 70 },
      { nombre: 'Águila', fuerza: 50, velocidad: 100, tamaño: 40, inteligencia: 80, peligrosidad: 60 },
      { nombre: 'Tiburón Blanco', fuerza: 95, velocidad: 88, tamaño: 90, inteligencia: 65, peligrosidad: 100 },
      { nombre: 'Gorila', fuerza: 98, velocidad: 60, tamaño: 85, inteligencia: 90, peligrosidad: 75 },
      { nombre: 'Cocodrilo', fuerza: 92, velocidad: 50, tamaño: 75, inteligencia: 55, peligrosidad: 93 },
      { nombre: 'Oso Grizzly', fuerza: 97, velocidad: 65, tamaño: 88, inteligencia: 68, peligrosidad: 90 },
      { nombre: 'Lobo', fuerza: 75, velocidad: 85, tamaño: 60, inteligencia: 78, peligrosidad: 80 },
      { nombre: 'Guepardo', fuerza: 70, velocidad: 100, tamaño: 65, inteligencia: 70, peligrosidad: 65 },
      { nombre: 'Hipopótamo', fuerza: 96, velocidad: 45, tamaño: 95, inteligencia: 60, peligrosidad: 88 },
      { nombre: 'Rinoceronte', fuerza: 94, velocidad: 55, tamaño: 92, inteligencia: 58, peligrosidad: 85 },
      { nombre: 'Delfín', fuerza: 60, velocidad: 90, tamaño: 70, inteligencia: 95, peligrosidad: 30 },
      { nombre: 'Orca', fuerza: 98, velocidad: 88, tamaño: 95, inteligencia: 92, peligrosidad: 95 },
      { nombre: 'Anaconda', fuerza: 85, velocidad: 60, tamaño: 80, inteligencia: 50, peligrosidad: 87 },
      { nombre: 'Pantera Negra', fuerza: 88, velocidad: 92, tamaño: 75, inteligencia: 75, peligrosidad: 90 },
      { nombre: 'Búfalo', fuerza: 90, velocidad: 58, tamaño: 88, inteligencia: 55, peligrosidad: 78 },
      { nombre: 'Canguro', fuerza: 72, velocidad: 78, tamaño: 70, inteligencia: 65, peligrosidad: 60 },
      { nombre: 'Pitón', fuerza: 80, velocidad: 55, tamaño: 75, inteligencia: 52, peligrosidad: 82 },
      { nombre: 'Jaguar', fuerza: 87, velocidad: 88, tamaño: 72, inteligencia: 73, peligrosidad: 89 },
      { nombre: 'Puma', fuerza: 82, velocidad: 86, tamaño: 68, inteligencia: 71, peligrosidad: 84 },
      { nombre: 'Chimpancé', fuerza: 70, velocidad: 70, tamaño: 55, inteligencia: 93, peligrosidad: 65 },
      { nombre: 'Cobra Real', fuerza: 65, velocidad: 75, tamaño: 60, inteligencia: 60, peligrosidad: 96 },
      { nombre: 'Comodo Dragon', fuerza: 88, velocidad: 48, tamaño: 78, inteligencia: 58, peligrosidad: 91 },
      { nombre: 'Halcón Peregrino', fuerza: 45, velocidad: 100, tamaño: 35, inteligencia: 77, peligrosidad: 55 },
      { nombre: 'Oso Polar', fuerza: 99, velocidad: 60, tamaño: 90, inteligencia: 67, peligrosidad: 92 },
      { nombre: 'Caimán', fuerza: 86, velocidad: 52, tamaño: 72, inteligencia: 54, peligrosidad: 88 },
      { nombre: 'Hiena', fuerza: 73, velocidad: 70, tamaño: 62, inteligencia: 72, peligrosidad: 77 },
      { nombre: 'Lince', fuerza: 68, velocidad: 82, tamaño: 58, inteligencia: 74, peligrosidad: 70 },
      { nombre: 'Mangosta', fuerza: 55, velocidad: 88, tamaño: 40, inteligencia: 76, peligrosidad: 68 },
      { nombre: 'Buitre', fuerza: 48, velocidad: 85, tamaño: 50, inteligencia: 69, peligrosidad: 52 },
      { nombre: 'Mantis Religiosa', fuerza: 40, velocidad: 75, tamaño: 20, inteligencia: 45, peligrosidad: 72 }
    ];

    return this.crearCartasDesdeData(animales, 'animales', ['fuerza', 'velocidad', 'tamaño', 'inteligencia', 'peligrosidad']);
  }

  generarMazoPlanetas() {
    const planetas = [
      { nombre: 'Mercurio', tamaño: 38, masa: 33, temperatura: 167, distancia: 58, lunas: 0 },
      { nombre: 'Venus', tamaño: 95, masa: 82, temperatura: 464, distancia: 108, lunas: 0 },
      { nombre: 'Tierra', tamaño: 100, masa: 100, temperatura: 15, distancia: 150, lunas: 1 },
      { nombre: 'Marte', tamaño: 53, masa: 11, temperatura: -65, distancia: 228, lunas: 2 },
      { nombre: 'Júpiter', tamaño: 1120, masa: 31800, temperatura: -110, distancia: 778, lunas: 79 },
      { nombre: 'Saturno', tamaño: 945, masa: 9500, temperatura: -140, distancia: 1434, lunas: 82 },
      { nombre: 'Urano', tamaño: 400, masa: 1450, temperatura: -195, distancia: 2871, lunas: 27 },
      { nombre: 'Neptuno', tamaño: 388, masa: 1710, temperatura: -200, distancia: 4495, lunas: 14 },
      { nombre: 'Plutón', tamaño: 18, masa: 1, temperatura: -225, distancia: 5906, lunas: 5 },
      { nombre: 'Sol', tamaño: 10900, masa: 333000, temperatura: 5500, distancia: 0, lunas: 0 },
      { nombre: 'Luna', tamaño: 27, masa: 1, temperatura: -20, distancia: 0, lunas: 0 },
      { nombre: 'Ceres', tamaño: 7, masa: 0, temperatura: -105, distancia: 414, lunas: 0 },
      { nombre: 'Eris', tamaño: 18, masa: 2, temperatura: -231, distancia: 10210, lunas: 1 },
      { nombre: 'Makemake', tamaño: 11, masa: 0, temperatura: -239, distancia: 6850, lunas: 1 },
      { nombre: 'Haumea', tamaño: 12, masa: 1, temperatura: -241, distancia: 6452, lunas: 2 },
      { nombre: 'Sedna', tamaño: 8, masa: 0, temperatura: -240, distancia: 11400, lunas: 0 },
      { nombre: 'Quaoar', tamaño: 9, masa: 0, temperatura: -220, distancia: 6500, lunas: 1 },
      { nombre: 'Orcus', tamaño: 7, masa: 0, temperatura: -230, distancia: 5900, lunas: 1 },
      { nombre: 'Ixion', tamaño: 5, masa: 0, temperatura: -226, distancia: 5900, lunas: 0 },
      { nombre: 'Varuna', tamaño: 6, masa: 0, temperatura: -223, distancia: 6400, lunas: 0 },
      { nombre: 'Titán', tamaño: 40, masa: 2, temperatura: -179, distancia: 1434, lunas: 0 },
      { nombre: 'Ganímedes', tamaño: 41, masa: 2, temperatura: -163, distancia: 778, lunas: 0 },
      { nombre: 'Calisto', tamaño: 38, masa: 2, temperatura: -139, distancia: 778, lunas: 0 },
      { nombre: 'Ío', tamaño: 29, masa: 1, temperatura: -143, distancia: 778, lunas: 0 },
      { nombre: 'Europa', tamaño: 24, masa: 1, temperatura: -160, distancia: 778, lunas: 0 },
      { nombre: 'Tritón', tamaño: 21, masa: 0, temperatura: -235, distancia: 4495, lunas: 0 },
      { nombre: 'Encélado', tamaño: 4, masa: 0, temperatura: -198, distancia: 1434, lunas: 0 },
      { nombre: 'Miranda', tamaño: 4, masa: 0, temperatura: -187, distancia: 2871, lunas: 0 },
      { nombre: 'Ariel', tamaño: 9, masa: 0, temperatura: -186, distancia: 2871, lunas: 0 },
      { nombre: 'Umbriel', tamaño: 9, masa: 0, temperatura: -198, distancia: 2871, lunas: 0 },
      { nombre: 'Oberón', tamaño: 12, masa: 0, temperatura: -193, distancia: 2871, lunas: 0 },
      { nombre: 'Fobos', tamaño: 2, masa: 0, temperatura: -40, distancia: 228, lunas: 0 }
    ];

    return this.crearCartasDesdeData(planetas, 'planetas', ['tamaño', 'masa', 'temperatura', 'distancia', 'lunas']);
  }

  generarMazoSuperheroes() {
    const superheroes = [
      { nombre: 'Superman', fuerza: 100, velocidad: 98, inteligencia: 85, poder: 100, popularidad: 100 },
      { nombre: 'Batman', fuerza: 70, velocidad: 75, inteligencia: 100, poder: 80, popularidad: 100 },
      { nombre: 'Wonder Woman', fuerza: 95, velocidad: 90, inteligencia: 88, poder: 95, popularidad: 92 },
      { nombre: 'Flash', fuerza: 65, velocidad: 100, inteligencia: 80, poder: 88, popularidad: 85 },
      { nombre: 'Aquaman', fuerza: 90, velocidad: 82, inteligencia: 75, poder: 85, popularidad: 78 },
      { nombre: 'Spider-Man', fuerza: 75, velocidad: 88, inteligencia: 90, poder: 80, popularidad: 98 },
      { nombre: 'Iron Man', fuerza: 70, velocidad: 85, inteligencia: 100, poder: 92, popularidad: 96 },
      { nombre: 'Thor', fuerza: 98, velocidad: 88, inteligencia: 78, poder: 98, popularidad: 90 },
      { nombre: 'Hulk', fuerza: 100, velocidad: 70, inteligencia: 60, poder: 95, popularidad: 88 },
      { nombre: 'Captain America', fuerza: 80, velocidad: 82, inteligencia: 85, poder: 78, popularidad: 94 },
      { nombre: 'Black Widow', fuerza: 65, velocidad: 88, inteligencia: 88, poder: 70, popularidad: 86 },
      { nombre: 'Hawkeye', fuerza: 68, velocidad: 80, inteligencia: 82, poder: 72, popularidad: 75 },
      { nombre: 'Doctor Strange', fuerza: 60, velocidad: 75, inteligencia: 95, poder: 98, popularidad: 84 },
      { nombre: 'Black Panther', fuerza: 82, velocidad: 90, inteligencia: 92, poder: 85, popularidad: 89 },
      { nombre: 'Scarlet Witch', fuerza: 55, velocidad: 70, inteligencia: 88, poder: 98, popularidad: 87 },
      { nombre: 'Vision', fuerza: 88, velocidad: 85, inteligencia: 95, poder: 92, popularidad: 80 },
      { nombre: 'Ant-Man', fuerza: 65, velocidad: 78, inteligencia: 88, poder: 80, popularidad: 76 },
      { nombre: 'Wasp', fuerza: 60, velocidad: 92, inteligencia: 85, poder: 75, popularidad: 72 },
      { nombre: 'Wolverine', fuerza: 85, velocidad: 82, inteligencia: 75, poder: 88, popularidad: 95 },
      { nombre: 'Cyclops', fuerza: 72, velocidad: 78, inteligencia: 82, poder: 85, popularidad: 77 },
      { nombre: 'Storm', fuerza: 68, velocidad: 85, inteligencia: 80, poder: 92, popularidad: 83 },
      { nombre: 'Jean Grey', fuerza: 60, velocidad: 75, inteligencia: 88, poder: 96, popularidad: 82 },
      { nombre: 'Deadpool', fuerza: 78, velocidad: 85, inteligencia: 70, poder: 82, popularidad: 93 },
      { nombre: 'Green Lantern', fuerza: 75, velocidad: 88, inteligencia: 85, poder: 95, popularidad: 81 },
      { nombre: 'Shazam', fuerza: 95, velocidad: 92, inteligencia: 75, poder: 94, popularidad: 79 },
      { nombre: 'Cyborg', fuerza: 82, velocidad: 80, inteligencia: 90, poder: 86, popularidad: 74 },
      { nombre: 'Martian Manhunter', fuerza: 92, velocidad: 88, inteligencia: 90, poder: 94, popularidad: 73 },
      { nombre: 'Nightwing', fuerza: 72, velocidad: 88, inteligencia: 88, poder: 75, popularidad: 80 },
      { nombre: 'Daredevil', fuerza: 70, velocidad: 85, inteligencia: 86, poder: 72, popularidad: 82 },
      { nombre: 'Punisher', fuerza: 75, velocidad: 78, inteligencia: 80, poder: 70, popularidad: 79 },
      { nombre: 'Ghost Rider', fuerza: 88, velocidad: 82, inteligencia: 65, poder: 92, popularidad: 85 },
      { nombre: 'Silver Surfer', fuerza: 90, velocidad: 98, inteligencia: 88, poder: 100, popularidad: 76 }
    ];

    return this.crearCartasDesdeData(superheroes, 'superheroes', ['fuerza', 'velocidad', 'inteligencia', 'poder', 'popularidad']);
  }

  crearCartasDesdeData(datos, categoria, caracteristicas) {
    const cartas = [];
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    datos.forEach((item, index) => {
      const numeroGrupo = Math.floor(index / 4) + 1;
      const letraGrupo = letras[index % 8];
      const id = `${numeroGrupo}${letraGrupo}`;
      
      const caracteristicasObj = {};
      caracteristicas.forEach(caract => {
        caracteristicasObj[caract] = item[caract];
      });

      const carta = new Carta(
        id,
        item.nombre,
        `/assets/${categoria}/${item.nombre.toLowerCase().replace(/ /g, '-')}.png`,
        caracteristicasObj,
        categoria
      );

      cartas.push(carta);
    });

    return cartas;
  }

  obtenerMazo(categoria) {
    return this.mazos[categoria] || this.mazos.pokemon;
  }

  obtenerTodasLasCategorias() {
    return Object.keys(this.mazos);
  }

  mezclarCartas(cartas) {
    const cartasMezcladas = [...cartas];
    for (let i = cartasMezcladas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartasMezcladas[i], cartasMezcladas[j]] = [cartasMezcladas[j], cartasMezcladas[i]];
    }
    return cartasMezcladas;
  }

  repartirCartas(cartas, numeroJugadores) {
    const cartasMezcladas = this.mezclarCartas(cartas);
    const cartasPorJugador = [];
    
    for (let i = 0; i < numeroJugadores; i++) {
      cartasPorJugador.push([]);
    }

    cartasMezcladas.forEach((carta, index) => {
      const jugadorIndex = index % numeroJugadores;
      cartasPorJugador[jugadorIndex].push(carta);
    });

    return cartasPorJugador;
  }
}

module.exports = new CartasService();