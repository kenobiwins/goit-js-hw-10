import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetch-API';

const DEBOUNCE_DELAY = 300;

const refs = {
  search: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const { target } = e;
  if (!target.value) {
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(target.value.trim())
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
      } else if (data.length >= 2 && data.length <= 10) {
        insertMarkup(renderList(data));
        refs.countryList.addEventListener('click', showInfo);
      } else if (data.length === 1) {
        insertMarkup(renderInfo(data));
        refs.countryList.removeEventListener('click', showInfo);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function showInfo(e) {
  const { target } = e;
  fetchCountries(target.textContent.trim()).then(data =>
    insertMarkup(renderInfo(data))
  );
  refs.search.value = target.textContent.trim();
  refs.countryList.removeEventListener('click', showInfo);
}

function renderList(array) {
  return array.reduce((acc, { flags, name }) => {
    acc += `<li class="item">
    <img width="40px" src="${flags.svg}">
    ${name.official}
    </li>`;
    return acc;
  }, '');
}
function renderInfo(array) {
  return array.reduce(
    (acc, { name, flags, capital, population, languages }) => {
      acc += `<li class="item-info">
      <h2>
      <img width="60px" src="${flags.svg}">
      ${name.official}
      </h2>
      <p><span>Capital:</span> ${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages).join(', ')}</p>
      </li>`;
      return acc;
    },
    ''
  );
}
function insertMarkup(string) {
  return (refs.countryList.innerHTML = string);
}
