'use strict';

// declaro las variables principales con las que trabajaré
let showsList;
let favorites;

// INICIO DE PÁGINA

// función de inicio, el array de los resultados de búsqueda aparece vacío y el de favoritos toma los datos de localstorage
function init() {
  showsList = [];
  favorites = getFavoritesLocalStorage();
  // llamamos al botón que va a ejecutar la función de buscar las serie que yo meta en el input
  const searchButton = document.querySelector('.search');
  // definimos el listener al hacer click en el form (si lo ponía en el botón no podía hacer ejecutar con el botón de Enter)
  searchButton.addEventListener('submit', getShowsData);
  paintFavorites();
}
init();

// FETCH

// función que se ejecuta cuando suceda el evento
function getShowsData(event) {
  // como tengo un form, cuando pulse se enviaría el formulario y no queremos que eso suceda
  event.preventDefault();
  const show = document.querySelector('.input').value;
  const url = 'http://api.tvmaze.com/search/shows?q=';
  fetch(url + show)
    .then((response) => response.json())
    .then((data) => {
      showsList = data;
      paintShowsList();
    });
}

function notFound() {
  let codeHtml = 'No hemos encontrado la serie que buscas, prueba de nuevo :)';
  return codeHtml;
}

// PAINT DATA

// función para ver si tiene imagen o no el objeto
function checkImg(img) {
  if (img === null) {
    return 'https://via.placeholder.com/210x270/ffffff/666666/?text=TV';
  } else {
    return img.medium;
  }
}

// me hace la estructura html de 1 show
function paintShow(showElem) {
  // mete la clase 'bg-normal' por defecto, pero conprueba la función isFavorite a través del id si está ya en favoritos, si está me pone la clase 'bg-clicked'
  let showClass = 'bg-normal';
  if (isFavorite(showElem.show.id)) {
    showClass = 'bg-clicked';
  }
  let codeHtml = `
   <li class="show-preview ${showClass}" id="${showElem.show.id}">
    <div class="poster-container">
      <img src="${checkImg(
        showElem.show.image
      )}" title="show poster" class="show-image" /> 
    </div>
  <p class="show-tittle color-normal">${showElem.show.name}</p> 
  </li>`;
  return codeHtml;
}

function paintShowsList() {
  const showsContainer = document.querySelector('.shows-container');
  let codeHtml = '';
  // si mi array de resultados es igual a 0 entonces me ejecutas la función notFound si no...
  if (showsList.length === 0) {
    codeHtml = notFound();
    // ... me recorres todo el array de resultados y me los pintas
  } else {
    for (let i = 0; i < showsList.length; i++) {
      codeHtml += paintShow(showsList[i]);
    }
  }
  showsContainer.innerHTML = codeHtml;
  // una vez pintados ya tienen que tener los listeners por si les clico
  addShowsListeners();
}

// llamo a todos los li (contenedores de las series) y les añado listeners a todos recorriendolos con un for of
function addShowsListeners() {
  let ShowElemList = document.querySelectorAll('.shows-container li');
  for (const showElem of ShowElemList) {
    showElem.addEventListener('click', favoritesHandler);
  }
}

// FAVORITOS

// le indico que el evento ocurrirá sobre el li que yo esté pulsando y que cuando pulse me añada ese li a favoritos
function favoritesHandler(ev) {
  const target = ev.currentTarget;
  addToFavorites(target);
}

// encuntra el indice, dentro del array de favoritos, si hay alguna de la series cuyo id coincida con el id que yo he clickado
function isFavorite(clickedID) {
  const index = favorites.findIndex((fav) => fav.show.id === clickedID);
  // devuelve booleano, si no coincide es false y si coincide es true
  return index === -1 ? false : true;
}

// añade al array de favoritos
function addToFavorites(clickedElem) {
  // recoge el id del elemento clickado
  const showID = parseInt(clickedElem.id);
  // condicional para, si el objeto clicado no está favoritos, buscándolo por id entonces...
  if (!isFavorite(showID)) {
    // ... con una constante que dentro del data de la API encuentra y recoge el objeto cuyo id coincida con el id del elemento clickado
    const clickedShow = showsList.find((showObj) => showObj.show.id === showID);
    // cambia las clases del li y ejecuta la función que añade este objeto al array de favoritos
    clickedElem.classList.add('bg-clicked');
    clickedElem.classList.remove('bg-normal');
    addFavorite(clickedShow);
  } else {
    // cambia las clases del li y ejecuta la función que quita este objeto al array de favoritos
    clickedElem.classList.remove('bg-clicked');
    clickedElem.classList.add('bg-normal');
    removeFavorite(showID);
  }
}

function addFavorite(fav) {
  favorites.push(fav);
  setLocalStorage(favorites);
  paintFavorites();
}

// en mi array de favoritos, mediante filter, voy a quitar el show cuyo id no coincida con el id de mi elemento clickado, es decir, si un show está en favoritos y no aparece clickado en mi lista de resultados entonces quítalo de favoritos
function removeFavorite(id) {
  favorites = favorites.filter((fav) => fav.show.id !== id);
  setLocalStorage(favorites);
  paintFavorites();
}

// LOCAL STORAGE

// mete el array de favoritos en local storage
function setLocalStorage(favoritesArray) {
  localStorage.setItem('favs', JSON.stringify(favoritesArray));
}

// recoge los que haya guardado en local storage
function getFavoritesLocalStorage() {
  // el array de favoritos tendrá lo que tenga el localStorage
  let favorites = JSON.parse(localStorage.getItem('favs'));
  // si me devuelve un array de favoritos distinto a nulo, entonces duélveme array favorites, sino devuélveme aunque sea el array vacío
  if (favorites !== null) {
    return favorites;
  } else {
    return (favorites = []);
  }
}

// PAINT FAVORITES

// estructura del html para pinta 1 favorito
function paintFavorite(fav) {
  let codeHtml = `
    <li class="fav-preview" id="${fav.show.id}">
      <div class="fav-poster-container">
      <img src="${checkImg(
        fav.show.image
      )}" tittle="favorite show poster" class="fav-image" />
      </div>
      <p class="fav-tittle">${fav.show.name}</p>
    </li>
  `;
  return codeHtml;
}

// me pinta dentro del contenedor de favoritos los objetos que estén dentro del array favorites
function paintFavorites() {
  const favsContainer = document.querySelector('.fav-container');
  let codeHtml = '';
  for (let i = 0; i < favorites.length; i++) {
    codeHtml += paintFavorite(favorites[i]);
  }
  favsContainer.innerHTML = codeHtml;
  // una vez pintados me pone los listeners para poder clickarlos
  addFavsListeners();
}

// igual que en los shows de la sección de resultados, aquí llamo a todos los li de dentro del contenedor de favoritos, los recorromediante for of y les añado a todos un listener
function addFavsListeners() {
  let ShowFAvList = document.querySelectorAll('.fav-container li');
  for (const favElem of ShowFAvList) {
    favElem.addEventListener('click', favoriteClickHandler);
  }
}

// lo llamo así porque es la función que se ejecuta cuando sucede el evento, pero lo único que hace es quitar de favoritos si clico
function favoriteClickHandler(ev) {
  // me ejecuta la función de removeFavorite sobre el elemento que he clickado
  removeFavorite(parseInt(ev.currentTarget.id));
  // repinta las listas de favoritos y de resultados
  paintShowsList();
  paintFavorites();
}
