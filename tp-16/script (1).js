const contenedor = document.getElementById('pokemon-container');
const spinner = document.getElementById('spinner');
const btnCargarMas = document.getElementById('btn-cargar-mas');

const modalElemento = document.getElementById('pokemonModal');
const pokemonModal = new bootstrap.Modal(modalElemento);

let offset = 0;
// CONSIGNA OBJETIVO 1: Definimos el límite inicial para obtener los primeros 151 Pokémon
let limiteInicial = 151;

async function obtenerPokemon(offsetActual, limite) {
  // CONSIGNA POWER UP 3: Mostramos el spinner al iniciar la carga de datos
  mostrarSpinner(true);
  
  try {
    // CONSIGNA OBJETIVO 1: Consumimos la PokeAPI especificando el límite (151 al inicio)
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offsetActual}`);
    const datos = await respuesta.json();

    // Obtenemos los detalles individuales de cada Pokémon en la lista
    for (const item of datos.results) {
      const respDetalle = await fetch(item.url);
      const detallePokemon = await respDetalle.json();
      crearCartaPokemon(detallePokemon);
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  } finally {
    // CONSIGNA POWER UP 3: Ocultamos el spinner al finalizar la carga
    mostrarSpinner(false);
    btnCargarMas.classList.remove('d-none');
  }
}

// Función para construir la carta de cada Pokémon
function crearCartaPokemon(pokemon) {
  const columna = document.createElement('div');
  columna.className = 'col';

  // CONSIGNA POWER UP 1: Obtenemos los tipos para mostrarlos en la carta
  const tipos = pokemon.types.map(t => t.type.name).join(', ');
  
  // CONSIGNA POWER UP 1: Obtenemos la foto para la carta principal
  const imagen = pokemon.sprites.front_default || 'https://via.placeholder.com/120';

  // CONSIGNA OBJETIVO 1 y POWER UP 1: Mostramos el nombre, la imagen y los tipos en la carta
  columna.innerHTML = `
    <div class="card h-100 text-center shadow-sm">
      <img src="${imagen}" class="card-img-top mx-auto mt-3" alt="${pokemon.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-capitalize">#${pokemon.id} ${pokemon.name}</h5>
        <p class="card-text text-muted">Tipo: ${tipos}</p>
        
        <button class="btn btn-outline-danger mt-auto btn-detalle">Ver más</button>
      </div>
    </div>
  `;

  // Asignamos el evento para mostrar la información adicional al presionar el botón
  const btnDetalle = columna.querySelector('.btn-detalle');
  btnDetalle.addEventListener('click', () => abrirDetallesModal(pokemon));

  contenedor.appendChild(columna);
}

// Función para llenar el modal con la información solicitada
function abrirDetallesModal(pokemon) {
  document.getElementById('modalNombre').innerText = `#${pokemon.id} ${pokemon.name}`;
  
  // CONSIGNA OBJETIVO 2a: Información adicional - Tipos
  const tipos = pokemon.types.map(t => t.type.name).join(', ');
  
  // CONSIGNA OBJETIVO 2b: Información adicional - Al menos una habilidad
  const habilidad = pokemon.abilities[0] ? pokemon.abilities[0].ability.name : 'Ninguna';
  
  // CONSIGNA OBJETIVO 2b: Información adicional - Al menos 4 movimientos
  const movimientos = pokemon.moves.slice(0, 4).map(m => m.move.name).join(', ');

  // CONSIGNA OBJETIVO 2c: Información adicional - Foto del Pokémon
  const imagen = pokemon.sprites.front_default || 'https://via.placeholder.com/150';

  // Renderizamos los datos dentro del cuerpo del modal
  document.getElementById('modalCuerpo').innerHTML = `
    <img src="${imagen}" class="modal-img mb-3" alt="${pokemon.name}">
    <p><strong>Tipos:</strong> ${tipos}</p>
    <p><strong>Habilidad principal:</strong> ${habilidad}</p>
    <p><strong>Movimientos:</strong> ${movimientos}</p>
  `;

  pokemonModal.show();
}

function mostrarSpinner(mostrar) {
  if (mostrar) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}

// CONSIGNA POWER UP 2: Evento al hacer clic en el botón para visualizar más Pokémon
btnCargarMas.addEventListener('click', () => {
  if (offset === 0) {
    offset = limiteInicial; // Pasa del 151 en adelante
  } else {
    offset += 20; // Incrementa de a 20 en las siguientes cargas
  }
  obtenerPokemon(offset, 20);
});

// CONSIGNA OBJETIVO 1: Llamado inicial para obtener los primeros 151 Pokémon
obtenerPokemon(0, limiteInicial);