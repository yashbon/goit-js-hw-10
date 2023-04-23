import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

var debounce = require('lodash.debounce');
const searchBox = document.querySelector('#search-box');
let countriesList = document.querySelector('.country-list');
let countryInfo = document.querySelector('.country-info');

countryInfo.hidden = true;

searchBox.focus();
searchBox.addEventListener('input', debounce(onInput, 300));

function onInput(event) {
    const searchCountry = searchBox.value.trim();

    if (!searchCountry) {
        countriesList.innerHTML = '';
        countryInfo.innerHTML = '';
        countryInfo.hidden = true;
        return;
    }

    fetchCountries(searchBox.value)
        .then(data => {
            if (data.length === 1) {
                countryInfo.hidden = false;
                countriesList.hidden = true;
                countryInfo.innerHTML = createMarkupInfo(data)
            }
            else if (data.length >= 2 && data.length <= 10) {
                countryInfo.hidden = true;
                countriesList.hidden = false;
                countriesList.innerHTML = createMarkupList(data);
            } else {
                countriesList.innerHTML = '';
                countryInfo.hidden = true;
                Notify.info("Too many matches found. Please enter a more specific name.")
            }
        })
        .catch(error => {
            countriesList.innerHTML = '';
            countryInfo.innerHTML = '';
            Notify.failure("Oops, there is no country with that name");
        })
}

function createMarkupList(array) {
    return array.map(({ name: { common }, flags: { png }, flags: { alt } }) => `
        <li>
            <p>
                <img src="${png}" alt="${alt}" width="50">${common}
            </p>
        </li>`).join('')
}

function createMarkupInfo(array) {
    return array.map(({ name: { official }, flags: { png }, flags: { alt }, capital, population, languages }) => `
    
    <img src="${png}" alt="${alt}" width="250">
    <h2>${official}</h2>
    <p><span>Capital:</span> ${capital}</p>
    <p><span>Population:</span> ${population}</p>
    <p><span>Languages:</span> ${Object.values(languages)}</p>
  
    `).join('')
}