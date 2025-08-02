import { VehicleTransmission } from "@/interfaces/VehicleInterface";
import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import {
  isValidLicenseNumber,
  isValidLicenseDate,
} from "@/components/app_modules/server_users/validators/for_data/DriveValidator";
import Plus from "@/icons/Plus";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import {
  TRANSMITION_TO_SPANISH_V2,
  Vehicle,
  VEHICLE_CATEGORY_TO_SPANISH,
} from "@/components/app_modules/server_users/models/VehicleFields";
import {
  AttachmentField,
  DateField as DateFieldForForm,
  TextField,
} from "@/components/form/models/FormFields";
import DateField from "@/components/form/view/fields/DateField";
import TransmissionField from "@/components/form/view/fields/TransmissionField";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import LicenceNumberField from "@/components/form/view/fields/LicenceNumberField";

const VehicleForm = ({
  vehicle,
  setVehicle,
  craneOperator = false,
}: {
  vehicle: Vehicle;
  setVehicle: (v: Vehicle) => void;
  craneOperator?: boolean;
}) => {
  const changeTransmission = (type: VehicleTransmission) => {
    setVehicle({
      ...vehicle,
      type: {
        ...vehicle.type,
        mode: [type],
      },
    });
  };

  const changeNumberLicense = (number: TextField) => {
    setVehicle({
      ...vehicle,
      license: {
        ...vehicle.license,
        number: number,
      },
    });
  };

  const changeDateLicense = (date: DateFieldForForm) => {
    setVehicle({
      ...vehicle,
      license: {
        ...vehicle.license,
        expirationDate: date,
      },
    });
  };

  const changeLicenseImage = (
    image: AttachmentField,
    side: "frontPhoto" | "behindPhoto",
  ) => {
    setVehicle({
      ...vehicle,
      license: {
        ...vehicle.license,
        [side]: image,
      },
    });
  };

  const addMissingTransmission = () => {
    if (vehicle.type.mode.length < 2) {
      var missingTransmission =
        vehicle.type.mode[0] === VehicleTransmission.AUTOMATIC
          ? VehicleTransmission.MECHANICAL
          : VehicleTransmission.AUTOMATIC;

      setVehicle({
        ...vehicle,
        type: {
          ...vehicle.type,
          mode: [...vehicle.type.mode, missingTransmission],
        },
      });
    }
  };

  return (
    <div className="form-sub-container | margin-top-25">
      {
        <div className="form-sub-container">
          {!craneOperator && (
            <>
              <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Caracteristícas del vehículo
              </h2>

              <TextFieldRenderer
                content={VEHICLE_CATEGORY_TO_SPANISH[vehicle.type.type]}
                legend="Categoria"
              />
              {vehicle.type.mode.length === 1 ? (
                <TransmissionField
                  transmission={vehicle.type.mode[0]}
                  setter={changeTransmission}
                />
              ) : (
                <>
                  {vehicle.type.mode.map((mode, i) => (
                    <TextFieldRenderer
                      key={`vehicle-mode-selected-${i}`}
                      content={`Transmisión ${TRANSMITION_TO_SPANISH_V2[mode]}`}
                      legend="Transmisión"
                    />
                  ))}
                </>
              )}

              {vehicle.type.mode.length == 1 && (
                <div>
                  <button
                    type="button"
                    onClick={addMissingTransmission}
                    className="icon-wrapper small-general-button text | gray-icon gray bold touchable"
                  >
                    <Plus />
                    Agregar otra Transmisión
                  </button>
                </div>
              )}
            </>
          )}

          <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
            <AddressCar /> Licencia
          </h2>
          <LicenceNumberField
            field={{
              values: vehicle.license.number,
              setter: changeNumberLicense,
              validator: isValidLicenseNumber,
            }}
          />
          <DateField
            field={{
              values: vehicle.license.expirationDate,
              setter: changeDateLicense,
              validator: isValidLicenseDate,
            }}
            legend="Fecha de expiración"
          />
          <ImageUploader
            uploader={{
              image: vehicle.license.frontPhoto,
              setImage: (i) => changeLicenseImage(i, "frontPhoto"),
            }}
            content={{
              legend: "Parte frontal de la licencia",
              imageInCircle: false,
              id: "vehicle-license-front-photo",
            }}
          />
          <ImageUploader
            uploader={{
              image: vehicle.license.behindPhoto,
              setImage: (image) => {
                changeLicenseImage(image, "behindPhoto");
              },
            }}
            content={{
              legend: "Parte posterior de la licencia",
              imageInCircle: false,
              id: "vehicle-license-behind-photo",
            }}
          />
        </div>
      }
    </div>
  );
};

export default VehicleForm;
