const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
let modal = document.getElementById('modal')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <button id="${pokemon.number}" class="pokemonCard" onClick="selectPokemon(${pokemon.number})">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </button>
    `
}

//Seletor de id do Pokemon(nova requição fetch baseada no id)
const selectPokemon = async (id) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const pokemon = await response.json()
    displayCard(pokemon)
}

//Estrutura do modal
const displayCard = (pokemon) => {

    const types = pokemon.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const weight = parseInt(pokemon.weight) / 10;
    const height = parseInt(pokemon.height) / 10;
 
    const photo = pokemon.sprites.other.dream_world.front_default

    modal.style.display = 'block';
    const newModal =  `
        <div class="pokemonsCards">
            <li id="modalCard" class="pokemon ${pokemon.type}">
                <button class="closeBtn" onClick="closeCard()">X</button>
                
                <div class="headerModal">
                    <span class="nameModal">${pokemon.name}</span>
                    <span class="numberModal">#${pokemon.id}</span>
                </div>
                
                <div class="modalDetail">
                    <ol class="typesModal">
                        ${pokemon.types.map((type) => `<li class="typeModal ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${photo}"
                        alt="${pokemon.name}">
                </div>

                <div class="infoPokemon">
                    <div class="baseAttributes">
                        <h3>Attributes</h3>

                        <div class="phisDetail">
                            <p> Height: ${height}kg</p>
                            <p> Weight: ${weight}m</p>
                            <p> Base Exp: ${pokemon.base_experience}exp</p>
                            
                            <div class="abilities">
                                <p>Abilities:</p>
                                ${pokemon.abilities.map((abilities) => `<span>${abilities.ability.name}</span>`).join(', ')}
                            </div>
                            
                        </div>
                    </div>

                    <div class="baseStats">
                        <h3>Base Stats</h3>               
                        <div class="baseStatsDetail">
                            <div class="statName">
                                <p>HP</p>
                                <p>ATK</p>
                                <p>DEF</p>
                                <p>SATK</p>
                                <p>SDEF</p>
                                <p>SPD</p>
                            </div>
                                
                            <div class="statsNumber"> 
                                ${pokemon.stats.map((base_stats) =>`<p>${base_stats.base_stat}</p>`).join('')}
                            </div>
                        </div>                 
                    </div> 
                </div>
            </li>
        </div>
    `

    modal.innerHTML += newModal;
}

function closeCard () {
    modal.style.display = 'none';
    modal.innerHTML = "";
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => { pokemonList.push(pokemons)
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
