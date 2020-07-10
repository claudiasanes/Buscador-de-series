'use strict';

let showsList = [];
let favorites = [];

// llamamos al botón que va a ejecutar la función de buscar las serie que yo meta en el input
const searchButton = document.querySelector('.btn');
// definimos el listener al hacr click en el botón
searchButton.addEventListener('click', getShowsData);

// FETCH

function getShowsData() {
  const show = document.querySelector('.input').value;
  const url = 'http://api.tvmaze.com/search/shows?q=';
  fetch(url + show)
    .then((response) => response.json())
    .then((data) => {
      showsList = data;
      //console.log(showsList);
      paintShowsList();
      paintFavorites();
      addShowsListeners();
      console.log(paintFavorites());
    });
}

// PAINT DATA

function paintShowsList() {
  const showsContainer = document.querySelector('.shows-container');
  let codeHtml = '';
  for (let i = 0; i < showsList.length; i++) {
    const favoriteClass = () => {};
    const checkImg = () => {
      if (showsList[i].show.image === null) {
        return 'https://via.placeholder.com/210x270/ffffff/666666/?text=TV';
      } else {
        return showsList[i].show.image.medium;
      }
    };
    const showName = showsList[i].show.name;
    const showId = showsList[i].show.id;
    codeHtml += `<li class="show-preview bg-normal ${favoriteClass}" id="${showId}"><div class="poster-container">`;
    codeHtml += `<img src="${
      checkImg()
      /*showsList[i].show.image === null
        ? imgDefault
        : showsList[i].show.image.medium
    */
    }" title="show poster" class="show-image" /> </div>`;
    codeHtml += `<p class="show-tittle color-normal">${showName}</p> </li>`;
  }
  return (showsContainer.innerHTML = codeHtml);
}

// llamo a todos los li (contenedores de las series) y les añado listener de click
function addShowsListeners() {
  let ShowElemList = document.querySelectorAll('li');
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
  const showResultFavs = favorites.findIndex((show) => show.show.id === showID);
  // condicional para, si el objeto no está favoritos aún (me devuelve -1) entonces...
  if (showResultFavs === -1) {
    // ... constante que dentro del data de la API encuentra y recoge el objeto cuyo id coincida con el id del elemento clickado
    const clickedShow = showsList.find((show) => show.show.id === showID);
    targetElem.classList.add('bg-clicked');
    targetElem.classList.remove('bg-normal');
    targetElem.classList.add('color-clicked');
    targetElem.classList.remove('color-normal');

    favorites.push(clickedShow);
  } else {
    //
    targetElem.classList.remove('bg-clicked');
    targetElem.classList.add('bg-normal');
    targetElem.classList.remove('color-clicked');
    targetElem.classList.add('color-normal');
    favorites.splice(showResultFavs, 1);
  }
  setLocalStorage(favorites);
  getLocalStorage(favorites);
  paintFavorites(favorites);
  console.log(favorites);
}

function setLocalStorage(favorites) {
  localStorage.setItem('favs', JSON.stringify(favorites));
}

function getLocalStorage() {
  let favorites = JSON.parse(localStorage.getItem('favs'));
  if (favorites !== null) {
    return favorites;
  } else {
    return (favorites = []);
  }
}

function paintFavorites() {
  const favsContainer = document.querySelector('.fav-container');
  const imgDefault =
    'https://via.placeholder.com/210x270/ffffff/666666/?text=TV';
  let codeHtml = '';
  for (let i = 0; i < favorites.length; i++) {
    codeHtml += `<li class="fav-show-preview" id="${favorites[i].show.id}">`;
    codeHtml += `<div class="fav-poster-container">`;
    codeHtml += `<img src="${
      favorites[i].show.image === null
        ? imgDefault
        : favorites[i].show.image.medium
    }" tittle="favorite show poster" class="fav-image" />`;
    codeHtml += `</div>`;
    codeHtml += `<p class="fav-tittle">${favorites[i].show.name}</p>`;
    codeHtml += `</li>`;
  }
  return (favsContainer.innerHTML = codeHtml);
}
