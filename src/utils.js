// Importing the scaleLinear function from d3-scale module
import { scaleLinear } from "d3-scale";

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
