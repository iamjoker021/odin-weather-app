import './style.css'

const fetchWeatherForcast = (latitude, longitude) => {
    if (parseFloat(latitude) && parseFloat(longitude)) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
    }
    else {
        return false;
    }

    loadingContainer();
    
    const weather_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&timezone=auto&forecast_days=1`
    fetch(weather_url, {
        mode: 'cors'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        const currentTime = data.current.time
        const hourlyData = data.hourly.time.map((t, i) => [t, data.hourly.temperature_2m[i]])
        // console.log(data, currentTime, hourlData);
        displayWeatherCard(hourlyData);
    }).catch((error) => {
        console.log(error);
    })
}

const clearContainer = () => {
    const container = document.querySelector('section.weather-forecast');
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

const loadingContainer = (message) => {
    clearContainer();

    const container = document.querySelector('section.weather-forecast');
    const loading = document.createElement('div');
    loading.classList.add('loading');
    loading.textContent = message || "Loading...."
    container.appendChild(loading);
}

const displayWeatherCard = (weatherList) => {
    const container = document.querySelector('section.weather-forecast');
    const unit = document.querySelector('button.toggle-temperature').dataset.unit;

    clearContainer();

    for (const info of weatherList) {
        const card = document.createElement('div');
        card.classList.add('weather-card');
        container.appendChild(card);

        const hour = document.createElement('h3');
        hour.textContent = info[0].split('T')[1].split(':')[0] + ' hr'
        card.appendChild(hour);

        const temperature = document.createElement('h5');
        if (unit === 'C') {
            temperature.textContent = `${info[1]} ${String.fromCharCode(176)}${unit}`
        }
        else {
            temperature.textContent = `${convertTemperature(info[1], 'F')} ${String.fromCharCode(176)}${unit}`
        }
        card.appendChild(temperature)
    }
}

const convertTemperature = (temp, unit) => {
    let newTemp;
        if (unit === 'F') {
            newTemp = ((9/5) * temp) + 32;
        }
        else if (unit === 'C'){
            newTemp = (temp - 32) * (5/9);
        }
        return Math.round(newTemp*100)/100
}

const toggleUnit = (unit) => {
    const cards = document.querySelectorAll('section.weather-forecast > div > h5');

    for(const card of cards) {
        const currentTemp = card.textContent.split(' ')[0];
        let newTemp = convertTemperature(currentTemp, unit);
        card.textContent = `${newTemp} ${String.fromCharCode(176)}${unit}`
    }
}

const toggleButton = document.querySelector('button.toggle-temperature');
toggleButton.addEventListener('click', (event) => {
    const currentUnit = event.target.dataset.unit;

    if (currentUnit === 'C') {
        event.target.textContent = 'Farenheit';
        event.target.dataset.unit = 'F';
    }
    else if (currentUnit === 'F'){
        event.target.textContent = 'Celcius';
        event.target.dataset.unit = 'C';
    }
    toggleUnit(event.target.dataset.unit);
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        latitude: document.querySelector('input#latitude').value,
        longitude: document.querySelector('input#longitude').value,
    };
    fetchWeatherForcast(formData.latitude, formData.longitude);
})

const intial = (() => {
    document.querySelector('input#latitude').value = 52.4;
    document.querySelector('input#longitude').value = 25.51;
})();


loadingContainer('Give Latitude and Longitude and Submit the above Form  to check forecast for a Day');

Window.fetchWeatherForcast = fetchWeatherForcast;