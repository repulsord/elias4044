const appId = "654921d68417e4376c8bef899e791288";
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${appId}`;

const city = document.querySelector(".name");
const form = document.querySelector("form");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const valueSearch = document.getElementById("name");
const clouds = document.getElementById("clouds");
const humidity = document.getElementById("humidity");getComputedStyle
const pressure = document.getElementById("pressure");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (valueSearch.value.trim() !== "") {
        searchWeather(); // Calls the function
    }
});

const searchWeather = async () => {
    try {
        const resp = await fetch(`${url}&q=${valueSearch.value}`);
        const data = await resp.json();
        console.log(data);

        if (data.cod === 200) {
            city.querySelector("figcaption").innerHTML = data.name;
            city.querySelector("img").src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;

            temperature.querySelector("img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            temperature.querySelector("span").innerText = Math.floor(data.main.temp);
            description.innerText = data.weather[0].description;

            clouds.innerText = data.clouds.all;
            humidity.innerText = data.main.humidity;
            pressure.innerText = data.main.pressure;
        } else {
            console.error("City not found");
        }
    } catch (error) {
        console.error("Failed to fetch weather data", error);
    }
};

// Default search on page load
valueSearch.value = "Tokyo";
searchWeather();
