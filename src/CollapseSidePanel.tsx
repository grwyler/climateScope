import React, { useState, useCallback, useEffect } from "react";
import { CollapseSidePanelProps } from "./tpyes";
import { celciusToFernheit, getYearWithFractionalMonth } from "./utils";

/**
 * A component that renders a collapsible side panel showing global temperature anomaly and average global land temperature.
 * @param {CollapseSidePanelProps} props - The props that are passed to this component.
 * @returns {JSX.Element} - A JSX element representing the CollapseSidePanel component.
 */
const CollapseSidePanel = (props: CollapseSidePanelProps) => {
  const { station, landTemp, collapsed, toggleCollapse } =
    useCollapseSidePanelState(props);

  return (
    <div style={{ zIndex: 500, position: "absolute", top: 100, left: 10 }}>
      <button className="btn btn-light mb-2" onClick={toggleCollapse}>
        {collapsed ? (
          <i className="fa fa-info text-primary" />
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
  );
};

/**
 * A hook that manages the state for the 'CollapseSidePanel' component.
 * @param {object} props - The props for the component.
 * @param {array} props.tempData - An array of temperature data objects.
 * @param {string} props.dateString - A string representing the selected date in YYYY-MM format.
 * @returns {object} An object containing the state variables and functions to update them.
 */
const useCollapseSidePanelState = ({
  tempData,
  dateString,
}: CollapseSidePanelProps) => {
  // String representing the temperature value at the selected date for the station location
  const [station, setStation] = useState<string>("-0.15");

  // String representing the temperature value at the selected date for the global land average
  const [landTemp, setLandTemp] = useState<string>("0.14");

  // Boolean indicating whether the chart legend is collapsed or expanded
  const [collapsed, setCollapsed] = useState<boolean>(true);

  // This constant variable 'originalFormat' is assigned the value returned by the 'getYearWithFractionalMonth' function,
  // which takes in a dateString parameter and returns the year with fractional month extracted from it (eg. 2008.21 => 05/01/2008).
  // This is used for searching the temperature data record that matches the selected date.
  const originalFormat = getYearWithFractionalMonth(dateString);

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

  /**
   * A function that toggles the value of the 'collapsed' state variable.
   * This is used to control the collapse/expand state of the chart legend.
   */
  const toggleCollapse = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  }, [setCollapsed]);
  return { station, landTemp, collapsed, toggleCollapse };
};

export default CollapseSidePanel;
