import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import TimeSlider from "./TimeSlider";
import axios from "axios";
import CollapseSidePanel from "./CollapseSidePanel";
import { TempData } from "./tpyes";

/**
 * A component that displays a map with markers for temperature data.
 * The map is rendered using OpenLayers
 * @returns JSX MapComponent
 */
const MapComponent = () => {
  const {
    mapRef,
    timeArray,
    values,
    tempData,
    dateString,
    setValues,
    setDateString,
  } = useMapState();

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <CollapseSidePanel tempData={tempData} dateString={dateString} />
      <TimeSlider
        timeArray={timeArray}
        values={values}
        dateString={dateString}
        setValues={setValues}
        setDateString={setDateString}
      />
    </div>
  );
};

/**
 * A custom hook that manages state for a map component and temperature data.
 * This hook uses useRef, useState and useEffect hooks to manage the state. It fetches
 * temperature data from an external API and initializes an OpenLayers map. It returns an
 * object containing references to the map component, temperature data, and state variables
 * for the chart.
 * @returns An object containing references to the map component, temperature data, and state variables
 * for the chart.
 */
const useMapState = () => {
  // A reference to the div element containing the map component
  const mapRef = useRef<HTMLDivElement>(null);

  // Array of temperature data
  const [tempData, setTempData] = useState<TempData[]>([]);

  // Array of dates for the x-axis of the chart
  const [timeArray, setTimeArray] = useState<Date[]>([]);

  // Array of temperature values for the y-axis of the chart
  const [values, setValues] = useState<number[]>([0]);

  // String representing the currently selected date in MM/DD/YYYY format
  const [dateString, setDateString] = useState<string>("4/1/1880");

  // Fetches temperature data from an external API and updates state variables
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get(
          "https://global-warming.org/api/temperature-api"
        );
        const { result } = response.data;
        setTempData(result);
        setTimeArray(
          result.map(({ time }: { time: string }) => {
            const [year, month] = time.split("."); // dates are in this format: 2008.21 (year.fractional_month)
            const decimalMonth = Number(month) - 1;
            const date = new Date(parseInt(year), decimalMonth);
            return date;
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchTemperatureData();
  }, []);

  // Initializes the OpenLayers map
  useEffect(() => {
    // If the mapRef is not available, do nothing
    if (!mapRef.current) return;

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Remove the map when the component unmounts
    return () => {
      map.setTarget("");
    };
  }, []);
  return {
    mapRef,
    timeArray,
    values,
    tempData,
    dateString,
    setValues,
    setDateString,
  };
};

export default MapComponent;
