'use strict';

let showsList;
let favorites;

function init() {
  showsList = [];
  favorites = getFavoritesLocalStorage();
  // llamamos al botón que va a ejecutar la función de buscar las serie que yo meta en el input
  const searchButton = document.querySelector('.search');
  // definimos el listener al hacr click en el botón
  searchButton.addEventListener('submit', getShowsData);

  paintFavorites();
}

init();

// FETCH

function getShowsData(event) {
  event.preventDefault();
  const show = document.querySelector('.input').value;
  const url = 'http://api.tvmaze.com/search/shows?q=';
  fetch(url + show)
    .then((response) => response.json())
    .then((data) => {
      showsList = data;
      paintShowsList();
      //console.log(showsList);
    });
}

function notFound() {
  let codeHtml = 'no está la serie que buscas';
  return codeHtml;
}

// PAINT DATA

function paintShowsList() {
  const showsContainer = document.querySelector('.shows-container');
  let codeHtml = '';
  if (showsList.length === 0) {
    codeHtml = notFound();
  } else {
    for (let i = 0; i < showsList.length; i++) {
      codeHtml += paintShow(showsList[i]);
    }
  }
  showsContainer.innerHTML = codeHtml;
  addShowsListeners();
}

function checkImg(img) {
  if (img === null) {
    return 'https://via.placeholder.com/210x270/ffffff/666666/?text=TV';
  } else {
    return img.medium;
  }
}
function paintShow(show) {
  let showClass = 'bg-normal';
  if (isFavorite(show.show.id)) {
    showClass = 'bg-clicked';
  }
  let codeHtml = `
   <li class="show-preview ${showClass}" id="${show.show.id}">
    <div class="poster-container">
      <img src="${checkImg(
        show.show.image
      )}" title="show poster" class="show-image" /> 
  </div>
  <p class="show-tittle color-normal">${show.show.name}</p> 
  </li>`;
  return codeHtml;
}

// llamo a todos los li (contenedores de las series) y les añado listener de click
function addShowsListeners() {
  let ShowElemList = document.querySelectorAll('.shows-container li');
  for (const showElem of ShowElemList) {
    showElem.addEventListener('click', favoritesHandler);
  }
}

function favoritesHandler(ev) {
  const target = ev.currentTarget;

  addToFavorites(target);
}

function addToFavorites(targetElem) {
  // recoge el id del elemento clickado
  const showID = parseInt(targetElem.id);
  // constante que encuentra en favoritos el índice del objeto que tenga el mismo id que el objeto de mi lista de resultados, como lo que queremos no es el índice, sino el contenido el objeto, tendremos que hacer

  // condicional para, si el objeto no está favoritos aún (me devuelve -1) entonces...
  if (!isFavorite(showID)) {
    // ... constante que dentro del data de la API encuentra y recoge el objeto cuyo id coincida con el id del elemento clickado
    const clickedShow = showsList.find((show) => show.show.id === showID);
    targetElem.classList.add('bg-clicked');
    targetElem.classList.remove('bg-normal');
    targetElem.classList.add('color-clicked');
    targetElem.classList.remove('color-normal');

    addFavorite(clickedShow);
  } else {
    //
    targetElem.classList.remove('bg-clicked');
    targetElem.classList.add('bg-normal');
    targetElem.classList.remove('color-clicked');
    targetElem.classList.add('color-normal');
    removeFavorite(showID);
  }
}

function isFavorite(id) {
  const index = favorites.findIndex((fav) => fav.show.id === id);
  return index === -1 ? false : true;
}

function addFavorite(fav) {
  favorites.push(fav);
  setLocalStorage(favorites);
  paintFavorites();
}

function removeFavorite(id) {
  favorites = favorites.filter((fav) => fav.show.id !== id);
  setLocalStorage(favorites);
  paintFavorites();
}

function setLocalStorage(favorites) {
  localStorage.setItem('favs', JSON.stringify(favorites));
}

function getFavoritesLocalStorage() {
  let favorites = JSON.parse(localStorage.getItem('favs'));
  if (favorites !== null) {
    return favorites;
  } else {
    return (favorites = []);
  }
}

function paintFavorite(fav) {
  let codeHtml = `
    <li class="fav-show-preview" id="${fav.show.id}">
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

function paintFavorites() {
  const favsContainer = document.querySelector('.fav-container');
  let codeHtml = '';
  for (let i = 0; i < favorites.length; i++) {
    codeHtml += paintFavorite(favorites[i]);
  }
  favsContainer.innerHTML = codeHtml;
  addFavsListeners();
}

function addFavsListeners() {
  let ShowFAvList = document.querySelectorAll('.fav-container li');
  for (const favElem of ShowFAvList) {
    favElem.addEventListener('click', favoriteClickHandler);
  }
}

function favoriteClickHandler(ev) {
  removeFavorite(parseInt(ev.currentTarget.id));
  paintShowsList();

  console.log('aqui');
}
