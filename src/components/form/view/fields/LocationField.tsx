"use client";
import ChevronDown from "@/icons/ChevronDown";
import {
  abbreviateLocation,
  flagOfLocation,
  locationList,
  Locations,
} from "@/interfaces/Locations";
import { LocationFieldSetter } from "../../models/FieldSetters";
import { useState } from "react";
import Image from "next/image";

interface Props {
  location: Locations;
  setter: LocationFieldSetter;
  style?: {
    abbreviatedLocation?: boolean;
  };
}

const LocationField: React.FC<Props> = ({ location, setter, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const selectLocation = (selectedLocation: Locations) => {
    setter(selectedLocation);
    setIsOpen(false);
  };

  return (
    <fieldset className={`form-section | select-item`}>
      <div className="form-section-input | icon-wrapper" onClick={toggleMenu}>
        <span className="selected-location">
          <img className="flag-icon" src={flagOfLocation(location)} alt="" />
          {style?.abbreviatedLocation ? abbreviateLocation(location) : location}
        </span>
      </div>
      <ChevronDown />
      <legend className="form-section-legend">Ubicación</legend>
      {isOpen && (
        <ul className="options-menu">
          {locationList.map((loc, i) => (
            <li
              key={`location-option-${i}`}
              onClick={() => selectLocation(loc)}
              className={`option-item ${loc === location ? "selected" : ""}`}
            >
              <img src={flagOfLocation(loc)} alt="" className="flag-icon" />
              {style?.abbreviatedLocation ? abbreviateLocation(loc) : loc}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default LocationField;
