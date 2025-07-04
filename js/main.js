"use strict";

const findInput = document.querySelector("#find-input");
const findBtn = document.querySelector("#find-btn");
const days = document.querySelectorAll(".day");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const temps = document.querySelectorAll(".temp");
const minTempsEl = document.querySelectorAll(".min-temp");
const conditionsImg = document.querySelectorAll(".img-condition");
const conditionsText = document.querySelectorAll(".condition");
const signs = document.querySelectorAll(".sign");
const moreDetails = document.querySelector(".details");

const key = "2824f80bab8e4509bd0172119250307";

let dates = [];
let maxTemps = [];
let minTemps = [];
let conditions = [];

async function getCityWeather(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=3`
    );
    if (!response.ok) throw new Error("Failed to load");
    const data = await response.json();
    getData(data);
  } catch (err) {
    console.error(err);
  }
}

getCityWeather("cairo");

findInput.addEventListener("input", (e) => {
  getCityWeather(e.target.value);
});

findBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getCityWeather(findInput.value);
});

function getData(weatherData) {
  const { name } = weatherData.location;
  const { temp_c, condition } = weatherData.current;
  const current = {
    name: name,
    temp: temp_c,
    text: condition.text,
    img: condition.icon,
  };
  const forecastDay = weatherData.forecast.forecastday;
  for (let i = 0; i < forecastDay.length; i++) {
    const { date, day } = forecastDay[i];
    const { maxtemp_c, mintemp_c, condition } = day;
    dates.push(date);
    maxTemps.push(maxtemp_c);
    minTemps.push(mintemp_c);
    conditions.push(condition);
  }

  changeUi(current);
}

function changeUi(currentData) {
  city.textContent = currentData.name;
  temps[0].textContent = currentData.temp;
  conditionsImg[0].src = currentData.img;
  conditionsImg[0].alt = currentData.text;
  conditionsText[0].textContent = currentData.text;
  moreDetails.classList.remove("d-none");

  for (let i = 0; i < 3; i++) {
    const { dayName, dayMonth } = formatDate(dates[i]);
    days[i].textContent = dayName;
    i === 0 && (date.textContent = dayMonth);

    if (i === 0) continue;
    temps[i].textContent = maxTemps[i];
    minTempsEl[i - 1].textContent = minTemps[i];
    conditionsImg[i].src = conditions[i].icon;
    conditionsImg[i].alt = conditions[i].text;
    conditionsText[i].textContent = conditions[i].text;
  }

  for (let i = 0; i < 5; i++) {
    signs[i].classList.remove("d-none");
  }
}

function formatDate(input) {
  const date = new Date(input);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const dayMonth = `${day} ${month}`;

  return { dayName, dayMonth };
}
