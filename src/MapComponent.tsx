import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import TimeSlider from "./TimeSlider";
import axios from "axios";
import CollapseSidePanel from "./CollapseSidePanel";
import { TempData } from "./tpyes";

interface TileLayers {
  [key: string]: TileLayer<any>;
}

const layers: TileLayers = {
  OSM: new TileLayer({
    source: new OSM(),
  }),
  Topo: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    }),
  }),
  Satellite: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    }),
  }),
  Terrain: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    }),
  }),
};

layers.OSM.setProperties({
  title: "OpenStreetMap",
});

layers.Topo.setProperties({
  title: "ESRI Topographic",
});

layers.Satellite.setProperties({
  title: "ESRI Satellite",
});

layers.Terrain.setProperties({
  title: "ESRI Terrain",
});

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
    currentLayer,
    setValues,
    setDateString,
    setCurrentLayer,
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
      <div
        style={{ position: "fixed", top: "10px", right: " 10px", zIndex: 1000 }}
      >
        <div className="card">
          <div className="card-header">Layer Switcher</div>
          <div className="card-body">
            {Object.keys(layers).map((layerKey) => (
              <div className="form-check" key={layerKey}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="layerSwitcher"
                  id={`layerSwitcher${layerKey}`}
                  value={layerKey}
                  checked={currentLayer === layerKey}
                  onChange={() => setCurrentLayer(layerKey)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`layerSwitcher${layerKey}`}
                >
                  {layers[layerKey].get("title")}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
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

  const [currentLayer, setCurrentLayer] = useState<string>("TOPO");

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
        currentLayer === "OSM"
          ? layers.OSM
          : currentLayer === "Topo"
          ? layers.Topo
          : currentLayer === "Satellite"
          ? layers.Satellite
          : layers.Terrain,
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
  }, [currentLayer]);

  return {
    mapRef,
    timeArray,
    values,
    tempData,
    dateString,
    currentLayer,
    setValues,
    setDateString,
    setCurrentLayer,
  };
};

export default MapComponent;
