document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3cc77dece2a21d9d5c7c100d8ad35930'; // Your provided API key
    const cities = document.querySelectorAll('.city');
    const acceptButton = document.getElementById('accept');
    const tempDropdown = document.getElementById('tempDropdown');

    // Add event listeners to city buttons
    cities.forEach(city => {
        city.addEventListener('click', function(event) {
            event.preventDefault();
            const cityName = this.getAttribute('data-city');
            console.log(`City clicked: ${cityName}`);
            getWeather(cityName);
        });
    });

    // Add event listener to temperature dropdown
    tempDropdown.addEventListener('change', () => {
        convertTemperature();
    });

    // Initial fetch and display weather for San Jose on page load
    getWeather('San Jose');

    acceptButton.addEventListener('click', () => {
        removeDiv();
    });

    function getWeather(city) {
        const apiKey = '3cc77dece2a21d9d5c7c100d8ad35930'; // Your provided API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(`Full API Response for ${city}:`, data); // Log the full response for debugging
                if (data.cod === "200") {
                    console.log(`Weather data for ${city}:`, data); // For debugging purposes
                    updateWeather(data);
                } else {
                    console.error(`Error fetching weather data for ${city}:`, data.message);
                    alert(`Error fetching weather data for ${city}: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please try again later.');
            });
    }

    function updateWeather(data) {
        console.log('Update Weather Data:', data); // Log the data passed to updateWeather for debugging
        const cityElement = document.getElementById('selectedCity');
        cityElement.textContent = data.city.name;

        const weatherCardContainer = document.getElementById('weatherCardContainer');
        weatherCardContainer.innerHTML = ''; // Clear previous content

        const forecast = data.list.slice(0, 4); // Get weather for today and the next 3 days

        forecast.forEach((day, index) => {
            const dayNames = ['Today', 'Tomorrow', 'Friday', 'Saturday'];
            const icon = getWeatherIcon(day.weather[0].icon);

            weatherCardContainer.innerHTML += `
                <div class="weatherCard">
                    <p class="day">${dayNames[index]}</p>
                    <img class="weatherImg" alt="${day.weather[0].description}" src="${icon}">
                    <p class="weatherDesc">${day.weather[0].description}</p>
                    <div class="temperatures">
                        <p class="low" data-celsius="${day.main.temp_min}">Low: ${day.main.temp_min}°C</p>
                        <p class="high" data-celsius="${day.main.temp_max}">High: ${day.main.temp_max}°C</p>
                    </div>
                </div>
            `;
        });

        console.log('Weather cards updated.');
        convertTemperature(); // Convert temperature based on selected unit
    }

    function getWeatherIcon(icon) {
        const iconMap = {
            '01d': 'images/some_sun.png', // clear sky day
            '01n': 'images/some_sun.png', // clear sky night
            '02d': 'images/some_clouds.png', // few clouds day
            '02n': 'images/some_clouds.png', // few clouds night
            '03d': 'images/some_clouds.png', // scattered clouds day
            '03n': 'images/some_clouds.png', // scattered clouds night
            '04d': 'images/some_clouds.png', // broken clouds day
            '04n': 'images/some_clouds.png', // broken clouds night
            '09d': 'images/some_rain.png', // shower rain day
            '09n': 'images/some_rain.png', // shower rain night
            '10d': 'images/some_rain.png', // rain day
            '10n': 'images/some_rain.png', // rain night
            '11d': 'images/some_rain.png', // thunderstorm day
            '11n': 'images/some_rain.png', // thunderstorm night
            '13d': 'images/some_clouds.png', // snow day
            '13n': 'images/some_clouds.png', // snow night
            '50d': 'images/some_clouds.png', // mist day
            '50n': 'images/some_clouds.png'  // mist night
        };
        return iconMap[icon] || 'images/some_clouds.png'; // default to some_clouds.png if icon not found
    }

    function convertTemperature() {
        const tempDropdown = document.getElementById('tempDropdown').value;
        const lowTempElements = document.querySelectorAll('.low');
        const highTempElements = document.querySelectorAll('.high');

        lowTempElements.forEach(element => {
            let celsius = parseFloat(element.getAttribute('data-celsius'));
            let temp = celsius;
            if (tempDropdown === '°F') {
                temp = (celsius * 9/5) + 32;
            }
            element.textContent = `Low: ${temp.toFixed(1)}${tempDropdown}`;
        });

        highTempElements.forEach(element => {
            let celsius = parseFloat(element.getAttribute('data-celsius'));
            let temp = celsius;
            if (tempDropdown === '°F') {
                temp = (celsius * 9/5) + 32;
            }
            element.textContent = `High: ${temp.toFixed(1)}${tempDropdown}`;
        });
    }

    function removeDiv() {
        const cookieDiv = document.getElementById('cookieTime');
        cookieDiv.remove();
    }
});
