/**
 * Represents the structure of the temperature data record.
 * @interface
 * @property {string} land - String representing the temperature value for the global land average.
 * @property {string} station - String representing the temperature value for the station location.
 * @property {string} time - String representing the time of the temperature data record.
 */
export interface TempData {
  land: string;
  station: string;
  time: string;
}

/**
 * Represents the props required by the CollapseSidePanel component.
 * @interface
 * @property {TempData[]} tempData - Array of temperature data records.
 * @property {string} dateString - String representing the selected date.
 */
export interface CollapseSidePanelProps {
  tempData: TempData[];
  dateString: string;
}

export interface Leader {
  name: string;
  flag: string;
  power: number;
  latitude: number;
  longitude: number;
  relations: {};
}

export interface Relations {
  [key: string]: number;
}
