const appId = "654921d68417e4376c8bef899e791288";
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${appId}`;

const city = document.querySelector(".name");
const form = document.querySelector("form");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const valueSearch = document.getElementById("name");
const clouds = document.getElementById("clouds");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const errorMessage = document.querySelector(".error-message");
const search = document.getElementById("search");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (valueSearch.value.trim() !== "") {
        searchWeather(); // Call the function
    }
});

const searchWeather = async () => {
    try {
        search.innerHTML = "Loading...";
        search.className = "loading"; // Adding loading class
        errorMessage.style.display = "none"; // Hide errors
        const resp = await fetch(`${url}&q=${valueSearch.value}`);
        const data = await resp.json();
        search.innerHTML = "Search";
        search.className = ""; // Remove loading class

        if (data.cod === 200) {
            city.querySelector("figcaption").innerHTML = data.name;
            city.querySelector("img").src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;

            temperature.querySelector("img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            temperature.querySelector("span").innerText = Math.floor(data.main.temp);
            description.innerText = data.weather[0].description;

            clouds.innerText = data.clouds.all;
            humidity.innerText = data.main.humidity;
            pressure.innerText = data.main.pressure;
            wind.innerText = data.wind.speed.toFixed(1);

            valueSearch.value = ""; // Clear input
        } else {
            throw new Error("City not found.");
        }
    } catch (error) {
        search.innerHTML = "Search";
        search.className = "";
        errorMessage.style.display = "block";
        errorMessage.innerText = error.message || "Failed to fetch weather data.";
    }
};

// Default search on page load
valueSearch.value = "Tokyo";
searchWeather();
