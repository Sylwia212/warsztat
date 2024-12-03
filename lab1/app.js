document.addEventListener('DOMContentLoaded', () => {
    const poleWyszukiwania = document.getElementById('search');
    const listaPokemonow = document.getElementById('pokemon-list');
    const szczegolyPokemona = document.getElementById('pokemon-details');

    let numerPokemona = 1;

    async function pobierzPokemony() {
        try {
            const odpowiedz = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
            const dane = await odpowiedz.json();
            wyswietlPokemony(dane.results);
        } catch (blad) {
            console.error('Błąd podczas pobierania listy Pokemonów:', blad);
        }
    }

    async function pobierzSzczegolyPokemona(nazwa) {
        try {
            const odpowiedz = await fetch(`https://pokeapi.co/api/v2/pokemon/${nazwa}`);
            const pokemon = await odpowiedz.json();
            wyswietlSzczegolyPokemona(pokemon);
        } catch (blad) {
            console.error('Błąd podczas pobierania szczegółów Pokemona:', blad);
        }
    }

    function wyswietlPokemony(pokemony) {
        listaPokemonow.innerHTML = '';
        pokemony.forEach(async (pokemon, indeks) => {
            try {
                const odpowiedz = await fetch(pokemon.url);
                const szczegoly = await odpowiedz.json();
                const div = document.createElement('div');
                div.className = 'pokemon';
                div.innerHTML = `
                    <img src="${szczegoly.sprites.front_default}" alt="${szczegoly.name}">
                    <p class="name">${numerPokemona}. ${szczegoly.name}</p>
                   
                `;
                div.addEventListener('click', () => {
                    listaPokemonow.style.display = 'none';
                    pobierzSzczegolyPokemona(szczegoly.name);
                });
                listaPokemonow.appendChild(div);
                numerPokemona++; 
            } catch (blad) {
                console.error('Błąd podczas pobierania szczegółów poszczególnego Pokemona:', blad);
            }
        });
    }

    function wyswietlSzczegolyPokemona(pokemon) {
        szczegolyPokemona.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Numer: ${pokemon.id}</p>
            <p>Typ: ${pokemon.types.map(typ => typ.type.name).join(', ')}</p>
            <p>Wzrost: ${pokemon.height} dm</p>
            <p>Waga: ${pokemon.weight} hg</p>
            <h3>Statystyki:</h3>
            <ul>
                ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
            </ul>
        `;
        szczegolyPokemona.style.display = 'block';
    }

    poleWyszukiwania.addEventListener('input', (event) => {
        const zapytanie = event.target.value.toLowerCase();
        const przefiltrowanePokemony = Array.from(listaPokemonow.children).filter(pokemon =>
            pokemon.innerText.toLowerCase().includes(zapytanie)
        );
        przefiltrowanePokemony.forEach(pokemon => pokemon.style.display = '');
        Array.from(listaPokemonow.children).filter(pokemon => !przefiltrowanePokemony.includes(pokemon))
            .forEach(pokemon => pokemon.style.display = 'none');
    });

    poleWyszukiwania.addEventListener('focus', () => {
        listaPokemonow.style.display = 'grid';
        szczegolyPokemona.style.display = 'none';
    });

    pobierzPokemony();
});
