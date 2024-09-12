function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeatherData(city);
        updateMap(city);
    } else {
        alert('Please enter a city');
    }
}

function fetchWeatherData(city) {
    const apiKey = 'c2b77247a9927b46fd52e38013ecb53c';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherElement = document.getElementById('currentWeather');
            weatherElement.innerHTML = `
                <h2>${data.name}</h2>
                <p>${data.weather[0].description}</p>
                <p>${data.main.temp}°C</p>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            `;
            fetchForecastData(city);
        })
        .catch(error => {
            alert('City not found!');
        });
}

function fetchForecastData(city) {
    const apiKey = 'c2b77247a9927b46fd52e38013ecb53c';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecastElement = document.getElementById('forecast');
            forecastElement.innerHTML = '';
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {  // 3-hour intervals, so % 8 gives one per day
                    forecastElement.innerHTML += `
                        <div>
                            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                            <p>${item.main.temp}°C</p>
                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
                        </div>
                    `;
                }
            });
        });
}

function initMap() {
    
    window.map = L.map('map').setView([20, 0], 2);

    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function updateMap(city) {
   
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                
                map.setView([lat, lon], 10);

               
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(city)
                    .openPopup();
            } else {
                alert('City not found on the map!');
            }
        })
        .catch(error => {
            console.error('Error fetching the location:', error);
            alert('City not found on the map!');
        });
}


document.addEventListener('DOMContentLoaded', initMap);
