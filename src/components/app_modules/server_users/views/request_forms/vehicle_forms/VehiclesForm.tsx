import {
  VehicleTransmission,
  VehicleType,
} from "@/interfaces/VehicleInterface";

import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import Plus from "@/icons/Plus";
import {
  isValidLicenseNumber,
  isValidLicenseDate,
  isValidLicenseCategory,
} from "@/components/app_modules/server_users/validators/for_data/DriveValidator";
import ChevronDown from "@/icons/ChevronDown";
import {
  Vehicle,
  VEHICLE_CATEGORY_TO_SPANISH,
  VEHICLE_CATEGORIES,
  TRANSMITION_TO_SPANISH_V2,
} from "@/components/app_modules/server_users/models/VehicleFields";
import TransmissionField from "@/components/form/view/fields/TransmissionField";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import {
  AttachmentField,
  DateField as DateFieldForForm,
  TextField,
} from "@/components/form/models/FormFields";
import DateField from "@/components/form/view/fields/DateField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import { DEFAULT_LICENSE } from "@/components/app_modules/server_users/models/LicenseFields";
import LicenceNumberField from "@/components/form/view/fields/LicenceNumberField";
import Trash from "@/icons/Trash";
import CTextField from "@/components/form/view/fields/TextField";
import CCheckField from "@/components/form/view/fields/CheckField";

const VehiclesForm = ({
  vehicles,
  setVehicles,
}: {
  vehicles: Vehicle[];
  setVehicles: (d: Vehicle[]) => void;
}) => {
  const changeCategory = (i: number, type: string) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            type:
              type === VehicleType.CAR
                ? {
                    type: VehicleType.CAR,
                    mode: [VehicleTransmission.AUTOMATIC],
                  }
                : {
                    type: VehicleType.MOTORCYCLE,
                    mode: [VehicleTransmission.AUTOMATIC],
                  },
          };
        }
        return vehicle;
      }),
    );
  };

  const changeTransmission = (i: number, transmission: VehicleTransmission) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          if (!vehicle.type.mode.includes(transmission)) {
            return {
              ...vehicle,
              type: {
                ...vehicle.type,
                mode: [transmission],
              },
            };
          }
        }
        return vehicle;
      }),
    );
  };

  const changeNumberLicense = (i: number, number: TextField) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              number: number,
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const changeCategoryLicense = (i: number, category: TextField) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              category,
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const changeRequireGlasses = (i: number, requires: boolean) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              requireGlasses: {
                value: requires,
                message: null,
              },
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const changeRequireHeadphones = (i: number, requires: boolean) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              requiredHeadphones: {
                value: requires,
                message: null,
              },
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const changeDateLicense = (i: number, date: DateFieldForForm) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              expirationDate: date,
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const updateImageLicense = (
    i: number,
    image: AttachmentField,
    side: "frontPhoto" | "behindPhoto",
  ) => {
    setVehicles(
      vehicles.map((vehicle, j) => {
        if (j === i) {
          return {
            ...vehicle,
            license: {
              ...vehicle.license,
              [side]: image,
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const addNewVehicle = () => {
    let free = getFreeVehicles(vehicles);
    if (free.length > 0) {
      let availableType = free[0];
      let vehicleType: Vehicle = {
        type: {
          type: availableType,
          mode: [VehicleTransmission.AUTOMATIC],
        },
        license: DEFAULT_LICENSE,
      };
      setVehicles([...vehicles, vehicleType]);
    }
  };

  const removeTransmission = (
    vehicleIndex: number,
    transmissionIndex: number,
  ) => {
    setVehicles(
      vehicles.map((vehicle, i) => {
        if (i === vehicleIndex) {
          return {
            ...vehicle,
            type: {
              ...vehicle.type,
              mode: vehicle.type.mode.filter((_, j) => j !== transmissionIndex),
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const addMissingTransmission = (i: number) => {
    if (vehicles[i].type.mode.length < 2) {
      var missingTransmission =
        vehicles[i].type.mode[0] === VehicleTransmission.AUTOMATIC
          ? VehicleTransmission.MECHANICAL
          : VehicleTransmission.AUTOMATIC;

      setVehicles(
        vehicles.map((vehicle, i) => {
          if (i === i) {
            if (!vehicle.type.mode.includes(missingTransmission)) {
              return {
                ...vehicle,
                type: {
                  ...vehicle.type,
                  mode: [...vehicle.type.mode, missingTransmission],
                },
              };
            }
          }
          return vehicle;
        }),
      );
    }
  };

  // UTILITIES TO CHECK AVAILABLE AND SELECTED VEHICLES
  const getFreeVehicles = (vehicles: Vehicle[]) => {
    let chosen = getChosenVehicles(vehicles);
    let free: VehicleType[] = VEHICLE_CATEGORIES.filter(
      (type) => !chosen.includes(type),
    );

    return free;
  };

  const getChosenVehicles = (vehicles: Vehicle[]) => {
    return vehicles.map((vehicle) => vehicle.type.type);
  };

  return (
    <div className="form-sub-container | margin-top-32">
      {vehicles.map((vehicle, i) => (
        <div className="form-sub-container" key={`vehicle-${i}`}>
          <h2 className="text icon-wrapper | medium-big bold">
            <Car /> Tipo de vehículo que conduces
          </h2>
          {/* THIS FIELDSET IS NECCESARY TO AVOID 
                    VEHICLES WITH THE SAME CATEGORY SELECTED */}
          <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
              key={"form-section-vehicle-types"}
              defaultValue={vehicle.type.type}
              onChange={(option) => {
                changeCategory(i, option.target.value);
              }}
              className="form-section-input"
            >
              <option value={vehicle.type.type}>
                {VEHICLE_CATEGORY_TO_SPANISH[vehicle.type.type]}
              </option>
              {VEHICLE_CATEGORIES.map((vehicleType, i) => {
                if (!getChosenVehicles(vehicles).includes(vehicleType)) {
                  return (
                    <option key={`vehicleType-${i}`} value={vehicleType}>
                      {VEHICLE_CATEGORY_TO_SPANISH[vehicleType]}
                    </option>
                  );
                }
              })}
            </select>
            <legend className="form-section-legend">Categoria</legend>
          </fieldset>
          {vehicle.type.mode.length === 1 ? (
            <TransmissionField
              transmission={vehicle.type.mode[0]}
              setter={(d) => changeTransmission(i, d)}
            />
          ) : (
            <>
              {vehicle.type.mode.map((mode, j) => (
                <div
                  key={`vehicle-mode-selected-${j}`}
                  className="transmission-field-wrapper"
                >
                  <TextFieldRenderer
                    content={`Transmisión ${TRANSMITION_TO_SPANISH_V2[mode]}`}
                    legend="Transmisión"
                  />
                  {vehicle.type.mode.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTransmission(i, j)}
                      className="icon-wrapper small-general-button text | gray-icon gray touchable"
                    >
                      <Trash />
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {vehicle.type.mode.length === 1 && (
            <div>
              <button
                type="button"
                onClick={() => addMissingTransmission(i)}
                className="icon-wrapper small-general-button text | gray-icon gray touchable"
              >
                <Plus />
                Agregar otra transmisión
              </button>
            </div>
          )}

          <div className="">
            <div className="separator-horizontal"></div>
          </div>

          <h2 className="text icon-wrapper | lb medium-big bold ">
            <AddressCar /> Licencia de Conducir
          </h2>

          <LicenceNumberField
            field={{
              values: vehicle.license.number,
              setter: (d) => changeNumberLicense(i, d),
              validator: isValidLicenseNumber,
            }}
          />

          <CTextField
            field={{
              values: vehicle.license.category,
              setter: (d) => changeCategoryLicense(i, d),
              validator: isValidLicenseCategory,
            }}
            legend="Categoría de Licencia"
          />
          <DateField
            field={{
              values: vehicle.license.expirationDate,
              setter: (d) => changeDateLicense(i, d),
              validator: isValidLicenseDate,
            }}
            legend="Fecha de expiración"
          />

          <CCheckField
            marker={{
              isCheck: vehicle.license.requireGlasses.value,
              setCheck: (s) => changeRequireGlasses(i, s),
            }}
            content={{
              checkDescription: (
                <p>Marca si requiere usar lentes para conducir</p>
              ),
            }}
          />

          <CCheckField
            marker={{
              isCheck: vehicle.license.requiredHeadphones.value,
              setCheck: (s) => changeRequireHeadphones(i, s),
            }}
            content={{
              checkDescription: (
                <p>Marca si requiere usar audífonos para conducir</p>
              ),
            }}
          />

          <ImageUploader
            uploader={{
              image: vehicle.license.frontPhoto,
              setImage: (d) => updateImageLicense(i, d, "frontPhoto"),
            }}
            content={{
              legend: "Parte frontal de la licencia",
              imageInCircle: false,
              id: `vehicle-license-front-photo-${i}`,
            }}
          />
          <ImageUploader
            uploader={{
              image: vehicle.license.behindPhoto,
              setImage: (d) => updateImageLicense(i, d, "behindPhoto"),
            }}
            content={{
              legend: "Parte posterior de la licencia",
              imageInCircle: false,
              id: `vehicle-license-behind-photo-${i}`,
            }}
          />
        </div>
      ))}
      {vehicles.length < VEHICLE_CATEGORIES.length && (
        <div>
          <button
            type="button"
            onClick={addNewVehicle}
            className="icon-wrapper small-general-button text | gray-icon gray bold touchable"
          >
            <Plus />
            Agregar otro Vehículo
          </button>
        </div>
      )}
      <div>
        <div className="separator-horizontal"></div>
      </div>
    </div>
  );
};

export default VehiclesForm;
