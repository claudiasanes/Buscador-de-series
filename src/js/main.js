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
      console.log(showsList);
      paintShowsList(showsList);
    });
}

// PAINT DATA

function paintShowsList(array) {
  const showsContainer = document.querySelector('.shows-container');
  let codeHtml = '';
  for (let i = 0; i < array.length; i++) {
    const Showimage = array[i].show.image.medium;
    const Showname = array[i].show.name;
    const Showid = array[i].show.id;
    codeHtml += `<li class="show-preview bg-normal" id="${Showid}">`;
    codeHtml += ` <div class="poster-container">`;
    codeHtml += `<img src="https://via.placeholder.com/210x270/ffffff/666666/?text=TV" tittle="show poster" class="show-image" /> </div>`;
    codeHtml += `<p class="show-tittle color-normal">${Showname}</p> </li>`;
  }
  return (showsContainer.innerHTML = codeHtml);
}

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

function addToFavorites() {}
