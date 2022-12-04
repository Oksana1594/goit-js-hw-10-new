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
  return countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="flag" width="35" height="25">
       <span class="name">${country.name.official}</span>
      </li>
      `;
    })
    .join(' ');
}

function createMarkupInfo(countries) {
  return countries
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
}

function handleInput(e) {
  const inputValue = e.target.value.trim();
  console.log(inputValue);
  updateInfo();

  if (!inputValue) {
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        const markup = createMarkupList(countries);
        updateInfo(markup);
      } else if (countries.length === 1) {
        const markup = createMarkupInfo(countries);
        updateInfo(``, markup);
      }
    })
    .catch(ifCatch);
}

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function updateInfo(list = ``, info = ``) {
  refs.list.innerHTML = list;
  refs.informations.innerHTML = info;
}

function ifCatch(error) {
  Notify.failure('Oops, there is no country with that name');
}
