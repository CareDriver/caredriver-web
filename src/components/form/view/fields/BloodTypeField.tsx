"use client";
import ChevronDown from "@/icons/ChevronDown";
import { BloodTypeFieldSetter } from "../../models/FieldSetters";
import { useState } from "react";
import { LicenseCategories } from "@/interfaces/LicenseCategories";
import { BloodTypes, bloodTypesList } from "@/interfaces/BloodTypes";

interface Props {
  location: BloodTypes;
  setter: BloodTypeFieldSetter;
}

const BloodTypeField: React.FC<Props> = ({ location, setter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const selectLocation = (selectedLocation: BloodTypes) => {
    setter(selectedLocation);
    setIsOpen(false);
  };

  return (
    <fieldset className={`form-section | select-item`}>
      <div className="form-section-input | icon-wrapper" onClick={toggleMenu}>
        <span className="selected-location">{location}</span>
      </div>
      <ChevronDown />
      <legend className="form-section-legend">
        Tipo de Sangre (en caso de accidentes)
      </legend>
      {isOpen && (
        <ul className="options-menu">
          {bloodTypesList.map((loc, i) => (
            <li
              key={`location-option-${i}`}
              onClick={() => selectLocation(loc)}
              className={`option-item ${loc === location ? "selected" : ""}`}
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default BloodTypeField;
