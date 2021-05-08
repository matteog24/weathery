const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);

let cityInputElement = document.querySelector('#city-input');
cityInputElement.addEventListener('keypress', handleCityInputKeyPress);

let body = document.querySelector('body');
let titleAction = document.querySelector('.title-action');
let waitingSection = document.querySelector('#waiting');
let weatherSection = document.querySelector('#weather');
let cityTitle = document.querySelector('.city-name');

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

function getCurrentPositionButton() {
    changeTitle('Gathering Location', 'waiting-location');
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
}

function handlePositionSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = 'https://geocode.xyz/' + lat + ',' + lng + '?geoit=json';
    const promise = axios.get(url);
    promise.then(handleReverseGeocoding)
}

function handlePositionError() {
    debugger;
}

function handleReverseGeocoding(response) {

    let responseCity = response.data.adminareas.admin6.name_en; // THIS GETS THE ENGLISH NAME
    if (response.data.adminareas.admin6.name_en == undefined) { // IF NOT AVALIBLE, GET THE ORIGINAL ONE.
        responseCity = response.data.city;
    }

    const city = capitalize(responseCity);
    const cityInputElement = document.querySelector('#city-input');
    cityInputElement.value = city;

    changeTitle('Waiting Input', 'gradient-waiting-result');

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
    const url = 'https://goweather.herokuapp.com/weather/' + city;
    changeTitle('Getting Results', 'gradient-waiting-result');

    const promise = axios.get(url);
    promise.then(handleWeatherResponse);

}

function changeTitle(text, classTitle) {
    titleAction.innerHTML = text;
    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.'
        titleAction.appendChild(dot)
    }
    
    body.className = '';
    body.className.add = classTitle;

}

function handleWeatherResponse(response) {
    body.className = '';
    const result = response.data;

    if (result.temperature == undefined || result.temperature == '') {
        body.classList.remove('waiting-location');
        body.classList.add('error-location');
        titleAction.innerHTML = 'City not found.'
    }
    else {
        body.classList.remove('gradient-waiting-result');
        waitingSection.style.display = 'none';
        weatherSection.style.display = 'block';
    }

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
    if access has been denied make a section appear saying that, both server (403) and location. -> https://stackoverflow.com/questions/59491716/how-to-display-web-browser-console-in-a-webpage
    searching a city before another, doesn0t cancel gradient
    does debounce work?
*/