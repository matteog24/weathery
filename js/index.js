const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);

let cityInputElement = document.querySelector('#city-input');
cityInputElement.addEventListener('keypress', handleCityInputKeyPress);

let body = document.querySelector('body');
let titleAction = document.querySelector('.title-action');
let waitingSection = document.querySelector('#waiting');
let weatherSection = document.querySelector('#weather');
let cityTitle = document.querySelector('.city-name');

let imageNavbarContainer = document.querySelector('#image-navbar-container');
let photoDiv = document.querySelector('.body-image');
let credits = document.querySelector('.credits')

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
    checkPhoto();
    changeTitle('Gathering Location', 'waiting-location');
    weatherSection.style.display = 'none' // In case the Weather Section was displayed
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {enableHighAccuracy: true, maximumAge: 10000}); // Is this helpful? lol
}

function handlePositionSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = 'https://api.geoapify.com/v1/geocode/reverse?lat='+ lat + '&lon=' + lng + '&apiKey=fbe68b431f0f422b8cf3183035c22132'
    // const url = 'https://geocode.xyz/' + lat + ',' + lng + '?geoit=json';
    const promise = axios.get(url);
    promise.then(handleReverseGeocoding);
}

function handlePositionError() {
    debugger;
}

function handleReverseGeocoding(response) {
    let responseCity = response.data.features[0].properties.city;

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

    checkPhoto()
    let city = cityInputElement.value;
    cityInputElement.value = city = capitalize(city);
    cityTitle.innerHTML = city;
    const url = 'https://api.weatherapi.com/v1/forecast.json?key=2d94c8429371436ebe960637211005&q=' + city + '&days=3&aqi=no&alerts=yes'
    // const url = 'http://api.weatherstack.com/forecast?access_key=1bd3c3657a546d62614e9691092a9a82&query=' + city;
    // const url = 'https://goweather.herokuapp.com/weather/' + city;
    changeTitle('Getting Results', 'gradient-waiting-result');

    const promise = axios.get(url);
    promise.then(handleWeatherResponse);
}

function handleWeatherResponse(response) {
    body.className = '';
    const result = response.data;

    const currentTemperature = result.current.temp_c;
    const currentCondition = result.current.condition.text;

    if (currentCondition == 'Sunny' || currentCondition == 'Clear') { // Because https://www.weatherapi.com/docs/weather_conditions.json

    }
    else if (currentCondition == 'Partly cloudy' || currentCondition == 'Cloudy' || currentCondition == 'Overcast') {

    }
    else if (currentCondition == 'Mist') {
        
    }
    else if (currentCondition == 'Patchy rain possible') {
        
    }
    else if (currentCondition == 'Patchy snow possible') {
        
    }
    else if (currentCondition == 'Patchy sleet possible') {
        
    }
    else if (currentCondition == 'Patchy freezing drizzle possible') {
        
    }
    else if (currentCondition == 'Blowing snow') {
        
    }
    else if (currentCondition == 'Blizzard') {
        
    }
    else if (currentCondition == 'Fog' || currentCondition == 'Freezing fog') {
        
    }
    else if (currentCondition == 'Freezing drizzle' || currentCondition == 'Heavy freezing drizzle') {
        
    }
    else if (currentCondition == 'Patchy light drizzle' || currentCondition == 'Light drizzle' || currentCondition == 'Patchy light rain' || currentCondition == 'Light rain' || currentCondition == 'Moderate rain at times' || currentCondition == 'Moderate rain' || currentCondition == 'Heavy rain at times' || currentCondition == 'Heavy rain' || currentCondition == 'Light freezing rain' || currentCondition == 'Moderate or heavy freezing rain' || currentCondition == 'Light rain shower' || currentCondition == 'Moderate or heavy rain shower' || currentCondition == 'Torrential rain shower' || currentCondition == 'Light sleet showers' || currentCondition == 'Moderate or heavy sleet showers') {
        
    }
    else if (currentCondition == 'Light sleet' || currentCondition == 'Moderate or heavy sleet' || currentCondition == 'Patchy light snow' || currentCondition == 'Light snow' || currentCondition == 'Patchy moderate snow' || currentCondition == 'Moderate snow' || currentCondition == 'Patchy heavy snow' || currentCondition == 'Heavy snow' || currentCondition == 'Ice pellets' || currentCondition == 'Light snow showers' || currentCondition == 'Moderate or heavy snow showers' || currentCondition == 'Light showers of ice pellets' || currentCondition == 'Moderate or heavy showers of ice pellets') {
        
    }
    else if (currentCondition == 'Patchy light rain with thunder' || currentCondition == 'Moderate or heavy rain with thunder' || currentCondition == 'Patchy light snow with thunder' || currentCondition == 'Moderate or heavy snow with thunder' || currentCondition == 'Thundery outbreaks possible') {
        
    }


    if (result.temperature == undefined || result.temperature == '') {
        body.classList.remove('waiting-location');
        body.classList.add('error-location');
        titleAction.innerHTML = 'City not found.'
    }
    else {
        const urlPhoto = 'https://api.unsplash.com/photos/random?collections=1319040&client_id=Yxvg_YObZct-TssWBqiY8uDVdacG-sjPWftIeOEn_II'
        const promisePhoto = axios.get(urlPhoto);
        promisePhoto.then(handlePhotoResponse);
        body.classList.remove('gradient-waiting-result');
        waitingSection.style.display = 'none';
        weatherSection.style.display = 'block';
    }

}

function handlePhotoResponse(response) {

    const result = response.data;
    const author = document.createElement('a');
    author.innerHTML = result.user.name;
    author.href = result.user.links.html;
    author.target = '_blank';

    const imageLink = document.createElement('a');
    imageLink.innerHTML = 'Unsplash';
    imageLink.href = result.links.html;
    imageLink.target = '_blank';

    credits.append(author, ' on ', imageLink);
    photoDiv.src = result.urls.regular;

    imageNavbarContainer.style.display = 'block'
}

function changeTitle(text, classTitle) {
    weatherSection.style.display = 'none' // In case the Weather Section was displayed
    waitingSection.style.display = 'block' // Block = Default. Makes sure it appears.

    titleAction.innerHTML = text;
    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.'
        titleAction.appendChild(dot)
    }
    
    body.className = '';
    body.classList.add = classTitle; // Removes all classes to add the preferred one.

}

function checkPhoto() {
    if (photoDiv.src !== undefined) {
        credits.innerHTML = '';
        imageNavbarContainer.style.display = 'none'
    }
}

function debounce(func, timeout){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/*
    add animation to show app name and then say "Waiting input". Like Scroll animation.
    if access has been denied make a section appear saying that, both server (403) and location. Maybe add a timer of 10 seconds if there are no results then display error message ('City not found') ->
    -> Add a small paragraph at the bottom saying 'Tip: Are you having problems with the connection? Or we couldn't find your location'.
    gradients aren't working
    does debounce work?
    add series of if statement to get different collections based on the weather.
    118 doesn't work (append)
    maybe add string concatenation when saying + 'something'
*/