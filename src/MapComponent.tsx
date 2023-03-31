import React, { useRef, useEffect, useState, useCallback } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import TimeSlider from "./TimeSlider";
import axios from "axios";
import { celciusToFernheit, getYearWithFractionalMonth } from "./utils";

interface TempData {
  land: string;
  station: string;
  time: string;
}

/**
 * A component that displays a map with markers for temperature data.
 * The map is rendered using OpenLayers
 */
const MapComponent = () => {
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

  // String representing the temperature value at the selected date for the station location
  const [station, setStation] = useState<string>("-0.15");

  // String representing the temperature value at the selected date for the global land average
  const [landTemp, setLandTemp] = useState<string>("0.14");

  // Boolean indicating whether the chart legend is collapsed or expanded
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const originalFormat = getYearWithFractionalMonth(dateString);

  /**
   * A function that toggles the value of the 'collapsed' state variable.
   * This is used to control the collapse/expand state of the chart legend.
   */
  const toggleCollapse = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  }, []);

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

  /**
   * A hook that updates the 'station' and 'landTemp' state variables when the selected date changes.
   * This is done by searching for the temperature data record that matches the selected date,
   * and updating the state variables with the corresponding temperature values if a match is found.
   * The hook is triggered whenever either the 'tempData' or 'dateString' state variables change.
   */
  useEffect(() => {
    const record = tempData.find(
      (temp: { time: string }) => temp.time === originalFormat
    );
    if (record) {
      setLandTemp(record.land);
      setStation(record.station);
    }
  }, [tempData, originalFormat]);

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

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <div style={{ zIndex: 500, position: "absolute", top: 100, left: 10 }}>
        <button className="btn btn-light mb-2" onClick={toggleCollapse}>
          {collapsed ? (
            <i className="fa fa-chevron-right" />
          ) : (
            <i className="fa fa-chevron-left" />
          )}
        </button>
        {!collapsed && (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              padding: 5,
            }}
          >
            <div className="m-3">
              <p>
                Global Temperature Anomaly:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: parseFloat(station) <= 0 ? "blue" : "red",
                  }}
                >
                  {`${celciusToFernheit(station)} °F`}
                </span>
              </p>
              <p>
                Average Global Land Temperature:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {`${celciusToFernheit(landTemp)} °F`}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
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

export default MapComponent;
