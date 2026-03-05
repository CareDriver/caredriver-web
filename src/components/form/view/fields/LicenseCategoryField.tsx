"use client";
import ChevronDown from "@/icons/ChevronDown";
import { LicenseCategoryFieldSetter } from "../../models/FieldSetters";
import { useState } from "react";
import {
  LicenseCategories,
  licenseCategoriesList,
  getLicenseCategoryLabel,
} from "@/interfaces/LicenseCategories";

interface Props {
  location: LicenseCategories;
  setter: LicenseCategoryFieldSetter;
  style?: {
    abbreviatedLocation?: boolean;
  };
}

const LicenseCategoryField: React.FC<Props> = ({ location, setter, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const selectLocation = (selectedLocation: LicenseCategories) => {
    setter(selectedLocation);
    setIsOpen(false);
  };

  return (
    <fieldset className={`form-section | select-item`}>
      <div className="form-section-input | icon-wrapper" onClick={toggleMenu}>
        <span className="selected-location">
          {getLicenseCategoryLabel(location)}
        </span>
      </div>
      <ChevronDown />
      <legend className="form-section-legend">Categoría de la Licencia</legend>
      {isOpen && (
        <ul className="options-menu">
          {licenseCategoriesList.map((loc, i) => (
            <li
              key={`location-option-${i}`}
              onClick={() => selectLocation(loc)}
              className={`option-item ${loc === location ? "selected" : ""}`}
            >
              {getLicenseCategoryLabel(loc)}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default LicenseCategoryField;
