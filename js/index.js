const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);
const cityInputElement = document.querySelector('#city-input');
cityInputElement.addEventListener('keypress', handleCityInputKeyPress);
let body = document.querySelector('body');
let titleAction = document.querySelector('.title-action')
let weatherSection = document.querySelector('#weather')

 /* function classBackground(value) {

    if (value == true) {
        body.className = ""

        get the weather info
    }
} */

function handleSearchFormSubmit(event) {
    if (event != null) {
        event.preventDefault();
    }

    weatherSection.getElementsByClassName.display = 'auto';
    const cityInputElement = document.querySelector('#city-input');
    const city = cityInputElement.value;
    capitalize(city);

    const url = 'https://goweather.herokuapp.com/weather/' + city;
    const promise = axios.get(url);
    promise.then(handleWeatherResponse);
}

function capitalize(city) {
    const words = city.split(" ");

    words[0] = words[0][0].toUpperCase() + (words[0].substring(1)).toLowerCase();

    if (words[1] !== null) {
        for (let i = 1; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + (words[i].substring(1)).toLowerCase();
        }
        words.join(" ");
    }

    return words;
}

function handleWeatherResponse(response) {
    const preElement = document.querySelector('#result');
    const result = response.data;
    const jsonData = JSON.stringify(result, null, 2);
    preElement.innerHTML = jsonData;
}

function getCurrentPosition() {
    body.classList.toggle('waiting-location');
    titleAction.innerHTML = 'Gathering Location';

    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.'
        titleAction.appendChild(dot)
    }

    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
}

function handlePositionSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = 'https://geocode.xyz/' + lat + ',' + lng + '?geoit=json';
    const promise = axios.get(url);
    promise.then(handleReverseGeocoding);
}

function handlePositionError() {
    debugger;
}

function handleReverseGeocoding(response) {
    const responseCity = response.data.city;
    const city = capitalize(responseCity);
    const cityInputElement = document.querySelector('#city-input');
    cityInputElement.value = city;
    handleSearchFormSubmit();
}

function handleCityInputKeyPress() {
    debounce(handleSearchFormSubmit, 1000);
}

function debounce(func, timeout){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}