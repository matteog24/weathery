const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);

const cityInputElement = document.querySelector('#city-input');
cityInputElement.addEventListener('keypress', handleCityInputKeyPress);

const body = document.querySelector('body');
const titleAction = document.querySelector('.title-action');
const waitingSection = document.querySelector('#waiting');
const weatherSection = document.querySelector('#weather');
const cityTitle = document.querySelector('.city-name');
const weatherConditionTitle = document.querySelector('.weather-condition');
const weatherAtAGlance = document.querySelector('.weather-at-a-glance');
const svg = document.createElement('img');
svg.className = 'svg';

const origTitle = document.title;

const imageNavbarContainer = document.querySelector('#image-navbar-container');
const photoDiv = document.querySelector('.body-image');
const credits = document.querySelector('.credits');

function capitalize(city) {
    let words = city.split(" ");

    if (words[0] !== undefined) {
        words[0] = words[0][0].toUpperCase() + (words[0].substring(1)).toLowerCase();
        for (let i = 1; i < words.length; i++) {
            if (words[i][0] !== undefined) {
                words[i] = words[i][0].toUpperCase() + (words[i].substring(1)).toLowerCase();
            }
        }
        words = words.join(" ");
    }

    return words;
}

function getCurrentPositionButton() {
    checkPhoto();
    changeTitle('Gathering Location', 'waiting-location');
    weatherSection.style.display = 'none' // In case the Weather Section was displayed
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {enableHighAccuracy: true});
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

    let city = capitalize(responseCity);
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
    city = cityInputElement.value;
    cityInputElement.value = city = capitalize(city);
    cityTitle.innerHTML = city;
    const url = 'https://api.weatherapi.com/v1/forecast.json?key=2d94c8429371436ebe960637211005&q=' + city + '&days=3&aqi=no&alerts=yes'
    changeTitle('Getting Results', 'gradient-waiting-result');

    const promise = axios.get(url);
    promise.then(handleWeatherSuccess);
    promise.catch(handleWeatherError);
    // promise.then(handleWeatherResponse);
}

function handleWeatherError(error) {
    cityInputElement.value = '';
    body.className = 'error-location';
    titleAction.innerHTML = 'City not found.';
    document = origTitle;
};

function handleWeatherSuccess(response) {
    body.className = '';
    titleAction.innerHTML = '';
    const result = response.data;

    if (weatherAtAGlance.contains(svg)) {
        weatherAtAGlance.removeChild(svg)
    }

    cityInputElement.value = '';
    cityTitle.innerHTML = result.location.name;
    document.title = result.location.name + ' on Weathery'

    const currentTemperature = result.current.temp_c;
    const currentCondition = result.current.condition.text;
    weatherConditionTitle.innerHTML = currentCondition + ' ~ ' + currentTemperature + 'ºC';
    let categoryId;

    if (currentCondition == 'Sunny' || currentCondition == 'Clear') { // Because https://www.weatherapi.com/docs/weather_conditions.json
        categoryId = 3302943;
        svg.src = './assets/svg/sun.svg';
    }
    else if (currentCondition == 'Partly cloudy' || currentCondition == 'Cloudy' || currentCondition == 'Overcast') {
        categoryId = 534083;
        svg.src = './assets/svg/cloud.svg';
    }
    else if (currentCondition == 'Mist' || currentCondition == 'Fog' || currentCondition == 'Freezing fog') {
        categoryId = 1683388;
        svg.src = './assets/svg/foggy.svg';
    }
    else if (currentCondition == 'Freezing drizzle' || currentCondition == 'Heavy freezing drizzle') {
        categoryId = 8566192;
        svg.src = './assets/svg/drizzle.svg';
    }
    else if (currentCondition == 'Patchy freezing drizzle possible' || currentCondition == 'Patchy light drizzle' || currentCondition == 'Light drizzle' || currentCondition == 'Patchy rain possible' || currentCondition == 'Patchy light rain' || currentCondition == 'Light rain' || currentCondition == 'Moderate rain at times' || currentCondition == 'Moderate rain' || currentCondition == 'Heavy rain at times' || currentCondition == 'Heavy rain' || currentCondition == 'Light freezing rain' || currentCondition == 'Moderate or heavy freezing rain' || currentCondition == 'Light rain shower' || currentCondition == 'Moderate or heavy rain shower' || currentCondition == 'Torrential rain shower' || currentCondition == 'Light sleet showers' || currentCondition == 'Moderate or heavy sleet showers') {
        categoryId = 97141906;
        svg.src = './assets/svg/rainy.svg';
    }
    else if ( currentCondition == 'Patchy sleet possible' || currentCondition == 'Light sleet' || currentCondition == 'Moderate or heavy sleet' || currentCondition == 'Patchy snow possible' || currentCondition == 'Patchy light snow' || currentCondition == 'Light snow' || currentCondition == 'Patchy moderate snow' || currentCondition == 'Moderate snow' || currentCondition == 'Patchy heavy snow' || currentCondition == 'Heavy snow' || currentCondition == 'Blowing snow' || currentCondition == 'Blizzard' || currentCondition == 'Ice pellets' || currentCondition == 'Light snow showers' || currentCondition == 'Moderate or heavy snow showers' || currentCondition == 'Light showers of ice pellets' || currentCondition == 'Moderate or heavy showers of ice pellets') {
        categoryId = 574181;
        svg.src = './assets/svg/snowy.svg';
    }
    else if (currentCondition == 'Patchy light rain with thunder' || currentCondition == 'Moderate or heavy rain with thunder' || currentCondition == 'Patchy light snow with thunder' || currentCondition == 'Moderate or heavy snow with thunder' || currentCondition == 'Thundery outbreaks possible') {
        categoryId = 3578001;
        svg.src = './assets/svg/thunder.svg';
    }
    setInfo(document.querySelector('#windkmh'), (result.current.wind_kph + 'km/h'), 'Wind', './assets/svg/second-section/wind.svg');
    setInfo(document.querySelector('#humidity'), (result.current.humidity + '%'), 'Humidity', './assets/svg/second-section/humidity.svg');
    setInfo(document.querySelector('#chance-of-rain'), (result.forecast.forecastday[0].day.daily_chance_of_rain + '%'), 'Rain?', './assets/svg/second-section/umbrella.svg');
    setInfo(document.querySelector('#sunrise'), (result.forecast.forecastday[0].astro.sunrise), 'Sunrise', './assets/svg/second-section/sunrise.svg');
    setInfo(document.querySelector('#sunset'), (result.forecast.forecastday[0].astro.sunset), 'Sunset', './assets/svg/second-section/sunset.svg');
    setInfo(document.querySelector('#uv-index'), (result.current.uv), 'UV Index', './assets/svg/second-section/uv.svg');

    weatherAtAGlance.appendChild(svg);
    const urlPhoto = 'https://api.unsplash.com/photos/random?collections=' + categoryId + '&client_id=Yxvg_YObZct-TssWBqiY8uDVdacG-sjPWftIeOEn_II'
    const promisePhoto = axios.get(urlPhoto);
    promisePhoto.then(handlePhotoResponse);
    body.className = '';
    waitingSection.style.display = 'none';
    weatherSection.style.display = 'flex';

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

    imageNavbarContainer.style.display = 'block';
}

function setInfo(divId, value, name, svgscr) {
    divId.innerHTML = ''
    
    const condition = document.createElement('h5')
    condition.innerHTML = name;

    const svgWeather = document.createElement('img');
    svgWeather.src = svgscr;
    svgWeather.className = 'svgSecondInfo';

    const valueCondition = document.createElement('h3');
    valueCondition.innerHTML = value;

    divId.append(condition, svgWeather, valueCondition)
}

function changeTitle(text, classTitle) {
    weatherSection.style.display = 'none'; // In case the Weather Section was displayed
    waitingSection.style.display = 'flex'; 

    titleAction.innerHTML = text;
    for (let a = 0; a < 3; a++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.innerHTML = '.';
        titleAction.appendChild(dot);
    }
    
    body.className = classTitle; // Removes all classes to add the preferred one.
    document.title = text;
}

function checkPhoto() {
    if (photoDiv.src !== undefined) {
        credits.innerHTML = '';
        imageNavbarContainer.style.display = 'none'
    }
}

function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/*
    does debounce work?
    maybe add string concatenation when saying + 'something'
    add alt to img
    finish the readme
    putting only a space = bug only after searching city
*/