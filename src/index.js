import './style.css'

const fetchWeatherForcast = (latitude, longitude) => {
    if (parseFloat(latitude) && parseFloat(longitude)) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
    }
    else {
        return false;
    }
    
    const weather_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&timezone=auto&forecast_days=1`
    fetch(weather_url, {
        mode: 'cors'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        const currentTime = data.current.time
        const hourlData = data.hourly.time.map((t, i) => [t, data.hourly.temperature_2m[i]])
        console.log(data, currentTime, hourlData);
    }).catch((error) => {
        console.log(error);
    })
}

Window.fetchWeatherForcast = fetchWeatherForcast;