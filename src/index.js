import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector(`#search-box`),
  list: document.querySelector(`.country-list`),
  informations: document.querySelector(`.country-info`),
};

function createMarkupList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="flag" width="35" height="25">
       <span class="name">${country.name.official}</span>
      </li>
      `;
    })
    .join(' ');

  refs.list.insertAdjacentHTML('beforeend', markup);
}

function createMarkupInfo(countries) {
  const markup = countries
    .map(country => {
      return `<ul>
      <li>
      <img src="${country.flags.svg}" alt="flag" width="35" height="25">
       <span class="name">${country.name.official}</span>
      </li>
  <li>
  <p class="name">Capital: </p>
   <p>${country.capital}</p>
  </li>
  <li>
  <p class="name">Population: </p>
   <p>${country.population}</p>
  </li>
<li>
   <p class="name">Languages: </p>
  <p>${Object.values(country.languages)}</p>
  </li>
 </ul>
       `;
    })
    .join(' ');

  refs.informations.insertAdjacentHTML('beforeend', markup);
}

function handleInput(e) {
  const inputValue = e.target.value.trim();
  console.log(inputValue);

  if (inputValue === '') {
    clear();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        clear();
        createMarkupList(countries);
      } else if (countries.length === 1) {
        clear();
        createMarkupInfo(countries);
      }
    })
    .catch(ifCatch);
}

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function clear() {
  refs.list.innerHTML = '';
  refs.informations.innerHTML = '';
}

function ifCatch(error) {
  if (error) {
    Notify.failure('Oops, there is no country with that name');
  }
}
