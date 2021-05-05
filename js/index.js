const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);

let cityInputElement = document.querySelector('#city-input');
cityInputElement.addEventListener('keypress', handleCityInputKeyPress);

let body = document.querySelector('body');
let titleAction = document.querySelector('.title-action');
let waitingSection = document.querySelector('#waiting');
let weatherSection = document.querySelector('#weather');
let cityTitle = document.querySelector('.city-name');

 /* function classBackground(value) {

    if (value == true) {
        body.className = ""

        get the weather info
    }
} */

function capitalize(city) {
    let words = city.split(" ");

    words[0] = words[0][0].toUpperCase() + (words[0].substring(1)).toLowerCase();

    if (words[1] !== null) {
        for (let i = 1; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + (words[i].substring(1)).toLowerCase();
        }
        words = words.join(" ");
    }

    return words;
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

    body.classList.remove('waiting-location')
    body.classList.add('gradient-waiting-result');
    titleAction.innerHTML = 'Waiting Input';

    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.'
        titleAction.appendChild(dot)
    }

    handleSearchFormSubmit();
}

function handleCityInputKeyPress() {
    debounce(handleSearchFormSubmit, 1000);
}

function handleSearchFormSubmit(event) {
    if (event != null) {
        event.preventDefault();
    }

    let city = cityInputElement.value;
    cityInputElement.value = city = capitalize(city);
    cityTitle.innerHTML = city;
    // const url = 'http://api.weatherstack.com/forecast?access_key=1bd3c3657a546d62614e9691092a9a82&query=' + city;
    // const url = 'https://goweather.herokuapp.com/weather/' + city;
    titleAction.innerHTML = 'Getting Results';
    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.'
        titleAction.appendChild(dot)
    }

    const promise = axios.get(url);
    body.classList.remove('gradient-waiting-result');
    waitingSection.style.display = 'none';
    weatherSection.style.display = 'block';
    promise.then(handleWeatherResponse);
}

function handleWeatherResponse(response) {
    const result = response.data;
    const jsonData = JSON.stringify(result, null, 2);
    // console.log(jsonData)
}

function debounce(func, timeout){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}


/*
    replace the for loop and the toggle claass (like in 88-96) with a function?
    add animation to show app name and then say "Waiting input". Like Scroll animation.
    when using geolocation, automatically search
    if access has been denied make a section appear saying that.
    Quando si preme search, si capitalizza anche quello!
    clicking the button for location multiple times gradeint
*/