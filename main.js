// DECLARATION
const API_KEY = "26ebec346666c60ecc110306d8460dba";
const formatTemperature = (temp) => `${temp?.toFixed(1)}°`
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
const DAYS_OF_THE_WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// GET API FROM WEATHERMAP
const getCurrentWeatherData = async () => {
    const city = "calamba";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}
const getHourlyForecast = async ({ name: city }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    // console.log(data);

    return data.list.map(forecast => {
        const { main: { temp, temp_max, temp_min }, dt, dt_txt, weather: [{ description, icon }] } = forecast;
        return { temp, temp_max, temp_min, dt, dt_txt, description, icon }
    })
}

// LOAD API and input in HTML using textContent
const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
    const currentForecasatElement = document.querySelector("#current-forecast");
    currentForecasatElement.querySelector(".city").textContent = name;
    currentForecasatElement.querySelector(".temperature").textContent = formatTemperature(temp);
    currentForecasatElement.querySelector(".description").textContent = description;
    currentForecasatElement.querySelector(".min-max-temp").textContent = `H:${formatTemperature(temp_max)} L:${formatTemperature(temp_min)}`;
}
const loadHourlyForecast = ({ main: { temp: tempNow }, weather: [{ icon: iconNow }] }, hourlyForecast) => {
    console.log(hourlyForecast);
    const timeFormatter = Intl.DateTimeFormat("en", {
        hour12:true, hour:"numeric"
    });
    let dataFor12Hours = hourlyForecast.slice(2, 14);
    const hourlyContainer = document.querySelector('.hourly-container');
    let innerHTMLString = `
            <article>
            <h3 class="time">Now</h3>
            <img class="icon"src="${createIconUrl(iconNow)}" alt="">
            <p class="hourly-temp">${formatTemperature(tempNow)}</p>
            </article>
            `;

    for (let { temp, icon, dt_txt } of dataFor12Hours) {
        innerHTMLString +=
            `<article>
            <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
            <img class="icon"src="${createIconUrl(icon)}" alt="">
            <p class="hourly-temp">${formatTemperature(temp)}</p>
            </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString;
}


const calculateDayWiseForeCast = (hourlyForecast) => {
    let dayWiseForeCast = new Map();
    for (let forecast of hourlyForecast) {
        const [date] = forecast.dt_txt.split(" ");
        const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];
        console.log(dayOfTheWeek);
        if (dayWiseForeCast.has(dayOfTheWeek)) {
            let forecastForTheDay = dayWiseForeCast.get(dayOfTheWeek);
            forecastForTheDay.push(forecast);
            dayWiseForeCast.set(dayOfTheWeek, [forecast]);
        } else {
            dayWiseForeCast.set(dayOfTheWeek, [forecast]);
        }
    }
    console.log(dayWiseForeCast);
    for (let [key, value] of dayWiseForeCast) {
        let temp_min = Math.min(...Array.from(value, val => val.temp_min));
        let temp_max = Math.max(...Array.from(value, val => val.temp_max));
        dayWiseForeCast.set(key, { temp_min, temp_max, icon: value.find(v => v.icon).icon })
    }
    console.log(dayWiseForeCast);
    return dayWiseForeCast;
}
const loadFiveDayForecast = (hourlyForecast) => {
    console.log(hourlyForecast)
    const dayWiseForeCast = calculateDayWiseForeCast(hourlyForecast);
    const container = document.querySelector(".five-day-forecast-container");
    let dayWiseInfo = "";
    Array.from(dayWiseForeCast).map(([day, { temp_max, temp_min, icon }], index) => {
        if (index < 5) {
            dayWiseInfo += `
            <article class="day-wise-forecast">
                <h3 class="day">${index === 0 ? "today" : day}</h3>
                <img class="icon" src="${createIconUrl(icon)}" alt="icon for the forecast">
                <p class="min-temp">${temp_min}</p>
                <p class="max-temp">${temp_max}</p>
            </article>`;
        }
    });
    container.innerHTML = dayWiseInfo;
}


const loadsFeelsLike = ({ main: { feels_like } }) => {
    const container = document.querySelector("#feels-like");
    container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}
const loadHumidity = ({ main: { humidity } }) => {
    let container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity} %`;
}

// CALLING function
document.addEventListener("DOMContentLoaded", async () => {
    const currentWeather = await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecast(currentWeather);
    loadHourlyForecast(currentWeather, hourlyForecast);
    loadFiveDayForecast(hourlyForecast)
    loadsFeelsLike(currentWeather)
    loadHumidity(currentWeather)
})