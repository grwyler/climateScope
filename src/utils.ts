// Importing the scaleLinear function from d3-scale module
import { scaleLinear } from "d3-scale";
import { Leader, Relations } from "./tpyes";

// Function to convert a date object to a value between 0 and 1 based on the min and max values
export const dateToValue = (date, min, max) => {
  return scaleLinear([min, max], [0, 1])(date.getTime());
};

// Function to convert an array of values between 0 and 1 to an array of Date objects based on the min and max values
export const valuesToDates = (values, min, max) => {
  return values.map((value) => {
    const date = new Date(scaleLinear([0, 1], [min, max])(value));
    return date;
  });
};

// Function to get the minimum and maximum dates from an array of date objects
export const getMinMaxDates = (timeArray) => {
  const minDate = timeArray.length > 0 ? timeArray[0].getTime() : null;
  const maxDate =
    timeArray.length > 0 ? timeArray[timeArray.length - 1].getTime() : null;
  return { minDate, maxDate };
};

// Function to get the year with fractional month from a date string in the format "MM/DD/YYYY"
export const getYearWithFractionalMonth = (dateString) => {
  const [month, day, year] = dateString.split("/");
  // Calculate the fractional month by dividing the day by the number of days in the month
  const fractionalMonth = (day - 1) / new Date(year, month, 0).getDate();
  // Combine the year and fractional month into a single value
  const yearWithFractionalMonth = (Number(year) + fractionalMonth)
    .toFixed(2)
    .toString();
  return yearWithFractionalMonth === "NaN" ? "" : yearWithFractionalMonth;
};

// Function to convert a temperature value in celsius to fahrenheit
export const celciusToFernheit = (celsiusString) => {
  const celsius = parseFloat(celsiusString);
  const fahrenheit = (celsius * 9) / 5 + 32;
  return fahrenheit.toFixed(2); // Round to 2 decimal places
};

const unRelations: Relations = {
  "President of the United States": 70,
  "President of China": 20,
  "President of Russia": 5,
  "President of the European Commission": 60,
  "President of the African Union": 20,
  "President of Brazil": 20,
  "Prime Minister of India": 50,
  "Prime Minister of Japan": 60,
  "Secretary-General of the Arab League": 30,
  "Supreme Leader of North Korea": 5,
};
const usRelations: Relations = {
  "United Nations Secretary-General": 70,
  "President of China": 30,
  "President of Russia": 20,
  "President of the European Commission": 80,
  "President of the African Union": 30,
  "President of Brazil": 40,
  "Prime Minister of India": 60,
  "Prime Minister of Japan": 80,
  "Secretary-General of the Arab League": 40,
  "Supreme Leader of North Korea": 5,
};
const cnRelations: Relations = {
  "United Nations Secretary-General": 20,
  "President of the United States": 30,
  "President of Russia": 10,
  "President of the European Commission": 30,
  "President of the African Union": 10,
  "President of Brazil": 10,
  "Prime Minister of India": 40,
  "Prime Minister of Japan": 30,
  "Secretary-General of the Arab League": 20,
  "Supreme Leader of North Korea": 50,
};

const ruRelations: Relations = {
  "United Nations Secretary-General": 5,
  "President of the United States": 20,
  "President of China": 10,
  "President of the European Commission": 20,
  "President of the African Union": 10,
  "President of Brazil": 10,
  "Prime Minister of India": 30,
  "Prime Minister of Japan": 20,
  "Secretary-General of the Arab League": 10,
  "Supreme Leader of North Korea": 30,
};

const euRelations: Relations = {
  "United Nations Secretary-General": 60,
  "President of the United States": 80,
  "President of China": 30,
  "President of Russia": 20,
  "President of the African Union": 40,
  "President of Brazil": 40,
  "Prime Minister of India": 70,
  "Prime Minister of Japan": 80,
  "Secretary-General of the Arab League": 50,
  "Supreme Leader of North Korea": 5,
};

const brRelations: Relations = {
  "United Nations Secretary-General": 20,
  "President of the United States": 10,
  "President of China": 30,
  "President of Russia": 15,
  "President of the European Commission": 10,
  "President of the African Union": 5,
  "Prime Minister of India": 10,
  "Prime Minister of Japan": 5,
  "Secretary-General of the Arab League": 5,
  "Supreme Leader of North Korea": 10,
};

const inRelations: Relations = {
  "United Nations Secretary-General": 60,
  "President of the United States": 30,
  "President of China": 50,
  "President of Russia": 40,
  "President of the European Commission": 60,
  "President of the African Union": 50,
  "President of Brazil": 40,
  "Prime Minister of Japan": 70,
  "Secretary-General of the Arab League": 50,
  "Supreme Leader of North Korea": 10,
};

const jpRelations: Relations = {
  "United Nations Secretary-General": 70,
  "President of the United States": 60,
  "President of China": 30,
  "President of Russia": 40,
  "President of the European Commission": 60,
  "President of the African Union": 50,
  "President of Brazil": 40,
  "Prime Minister of India": 60,
  "Secretary-General of the Arab League": 30,
  "Supreme Leader of North Korea": 5,
};

const alRelations: Relations = {
  "United Nations Secretary-General": 60,
  "President of the United States": 20,
  "President of China": 40,
  "President of Russia": 30,
  "President of the European Commission": 50,
  "President of the African Union": 70,
  "President of Brazil": 30,
  "Prime Minister of India": 40,
  "Prime Minister of Japan": 50,
  "Supreme Leader of North Korea": 5,
};
const nkRelations: Relations = {
  "United Nations Secretary-General": 5,
  "President of the United States": 5,
  "President of China": 40,
  "President of Russia": 30,
  "President of the European Commission": 5,
  "President of the African Union": 15,
  "President of Brazil": 5,
  "Prime Minister of India": 10,
  "Prime Minister of Japan": 5,
  "Secretary-General of the Arab League": 20,
};
// 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
export const leaderData: { [key: string]: Leader } = {
  "United Nations Secretary-General": {
    name: "António Guterres",
    flag: "https://flagcdn.com/56x42/un.png",
    power: 10,
    latitude: 40.7489,
    longitude: -73.968,
    relations: unRelations,
  },
  "President of the United States": {
    name: "Joe Biden",
    flag: "https://flagcdn.com/56x42/us.png",
    power: 40,
    latitude: 38.8977,
    longitude: -77.0365,
    relations: usRelations,
  },
  "President of China": {
    name: "Xi Jinping",
    flag: "https://flagcdn.com/56x42/cn.png",
    latitude: 39.9042,
    longitude: 116.4074,
    power: 10,
    relations: cnRelations,
  },
  "President of Russia": {
    name: "Vladimir Putin",
    flag: "https://flagcdn.com/56x42/ru.png",
    power: 5,
    latitude: 55.7504461,
    longitude: 37.6174943,
    relations: ruRelations,
  },
  "President of the European Commission": {
    name: "Ursula von der Leyen",
    flag: "https://flagcdn.com/56x42/eu.png",
    power: 10,
    latitude: 50.838215,
    longitude: 4.383141,
    relations: euRelations,
  },
  "President of Brazil": {
    name: "Jair Bolsonaro",
    flag: "https://flagcdn.com/56x42/br.png",
    power: 5,
    latitude: -15.826691,
    longitude: -47.92182,
    relations: brRelations,
  },
  "Prime Minister of India": {
    name: "Manmohan Singh",
    flag: "https://flagcdn.com/56x42/in.png",
    power: 7,
    latitude: 28.6139,
    longitude: 77.209,
    relations: inRelations,
  },
  "Prime Minister of Japan": {
    name: "Fumio Kishida",
    flag: "https://flagcdn.com/56x42/jp.png",
    power: 5,
    latitude: 35.6895,
    longitude: 139.6917,
    relations: jpRelations,
  },
  "Secretary-General of the Arab League": {
    name: "Ahmed Aboul Gheit",
    flag: "https://flagcdn.com/56x42/al.png",
    power: 5,
    latitude: 30.040846,
    longitude: 31.236183,
    relations: alRelations,
  },
  "Supreme Leader of North Korea": {
    name: "Kim Jong Un",
    flag: "https://flagcdn.com/56x42/kp.png",
    power: 1,
    latitude: 39.019444,
    longitude: 125.738052,
    relations: nkRelations,
  },
};
