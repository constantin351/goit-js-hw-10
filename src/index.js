import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box");
const countriesList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    const countryName = input.value.trim();

    if (countryName === "") { 
        countriesList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
    }

    fetchCountries(countryName)
        .then((countries) => {
            // console.log(countries);

            if (countries.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                countriesList.innerHTML = "";
            } else if (countries.length >= 2 && countries.length <= 10) {
                renderFromTwoToTenCountries(countries);
                countryInfo.innerHTML = "";
            } else if (countries.length === 1) {
                renderOneCountry(countries);
                countriesList.innerHTML = "";
            }
        })
        .catch((error) => {
            Notify.failure("Oops, there is no country with that name!");
            countryInfo.innerHTML = "";
            countriesList.innerHTML = "";
        });
}

function renderFromTwoToTenCountries(countries) { 
    const countriesMarkup = countries
        .map(({ flags, name }) => {
            return `
            <li class="country-list__item">
                <img class="country-list__img" src="${flags.svg}" alt="${name.official}" width="55"/>
                <p class="country-list__text">${name.official}</p>
            </li>
            `
        })
        .join("");
    countriesList.innerHTML = countriesMarkup;
}


function renderOneCountry(countries) { 
    const oneCountryMarkup = countries
        .map(({ flags, name, capital, population, languages }) => {
            return `
            <div class="country-info__wrapper">
                <img class="country-info__img" src="${flags.svg}" alt="${flags.alt}" width="85"/>
                <h2 class="country-info__title">${name.official}</h2>
                <p class="country-info__text"> <b>Capital:</b> ${capital}</p>
                <p class="country-info__text"> <b>Population:</b> ${population}</p>
                <p class="country-info__text"> <b>Languages:</b> ${Object.values(languages)}</p>
            </div>
            `
        })
        .join("");
    countryInfo.innerHTML = oneCountryMarkup;
}