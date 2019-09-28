const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
let API = 'https://rickandmortyapi.com/api/character/';
//let API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';

function kepplocalstorage(data) {
  console.log(data);
  localStorage.removeItem('next_fetch');
  localStorage.setItem('next_fetch', data);
}

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      if (localStorage.getItem('next_fetch')) {
        API = localStorage.getItem('next_fetch');
      }
      API = response.info.next;
      kepplocalstorage(API);

      if (API === '') {
        throw new Error('alalsl');
      }

      const characters = response.results;
      let output = characters

        .map(character => {
          return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
        })
        .join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => showErrorMessage());
};

const showErrorMessage = () => {
  let newItem = document.createElement('section');
  newItem.classList.add('error');
  newItem.innerHTML = 'Ya no hay personajes...';
  $app.appendChild(newItem);
  intersectionObserver.disconnect();
};

const loadData = async () => {
  try {
    await getData(API);
  } catch (error) {
    console.error('Algo Ocurrio');
  }
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: '0px 0px 100% 0px'
  }
);

intersectionObserver.observe($observe);
