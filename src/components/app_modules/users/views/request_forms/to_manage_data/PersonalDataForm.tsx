"use client";

import { useContext, useEffect, useState } from "react";
import UserIcon from "@/icons/UserIcon";

import { AuthContext } from "@/context/AuthContext";
import { flatPhone, Gender, UserInterface } from "@/interfaces/UserInterface";
import ImageUploader from "../../../../../form/view/attachment_fields/ImageUploader";
import IdentityCardForm from "./IdentityCardForm";
import { PersonalData } from "../../../../server_users/models/PersonalDataFields";
import TextField from "@/components/form/view/fields/TextField";
import {
  isValidAddress,
  isValidName,
} from "../../../validators/for_data/CredentialsValidator";
import PhoneField from "@/components/form/view/fields/PhoneField";
// @ts-ignore - side-effect CSS import without type declarations
import "react-international-phone/style.css";
import Phone from "@/icons/Phone";
import ChevronDown from "@/icons/ChevronDown";
import HomeAddress from "@/icons/HomeAddress";
import BloodTypeField from "@/components/form/view/fields/BloodTypeField";
import { BloodTypes } from "@/interfaces/BloodTypes";
import { generateKeywords } from "@/utils/helpers/StringHelper";

interface Props {
  baseUser?: UserInterface;
  personalData: PersonalData;
  setPersonalData: (p: PersonalData) => void;
}

const PersonalDataForm: React.FC<Props> = ({
  baseUser,
  personalData,
  setPersonalData,
}) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const fillInformation = (sourceUser: UserInterface | undefined) => {
    if (sourceUser) {
      var hasIdCard: boolean =
        sourceUser.identityCard !== null &&
        sourceUser.identityCard !== undefined;
      setPersonalData({
        fullname: {
          value: sourceUser.fullName,
          message: null,
        },
        fullNameArrayLower: {
          value: generateKeywords(sourceUser.fullName),
          message: null,
        },
        bloodType: {
          value: sourceUser.bloodType || BloodTypes.OPositive,
          message: null,
        },
        gender: {
          value: sourceUser.gender || Gender.Male,
          message: null,
        },
        homeAddress: {
          value: sourceUser.homeAddress,
          message: "Introduce tu dirección de domicilio",
        },
        addressPhoto: {
          value:
            sourceUser.addressPhoto?.url.length > 0
              ? sourceUser.addressPhoto.url
              : undefined,
          message:
            sourceUser.addressPhoto?.url.length > 0
              ? null
              : "Sube una foto de la factura de luz de tu domicilio.",
        },
        photo: {
          value:
            sourceUser.photoUrl.url.length > 0
              ? sourceUser.photoUrl.url
              : undefined,
          message:
            sourceUser.photoUrl.url.length > 0
              ? null
              : "Por favor, sube una foto de perfil",
        },
        alternativePhoneNumber: {
          value: flatPhone(sourceUser.alternativePhoneNumber) ?? "",
          message: null,
        },
        alternativePhoneNumberName: {
          value: sourceUser.alternativePhoneNumberName ?? "",
          message: null,
        },
        idCard: {
          frontCard: {
            value: sourceUser.identityCard
              ? sourceUser.identityCard.frontCard.url
              : undefined,
            message: hasIdCard
              ? null
              : "Suba una foto mostrando la parte frontal de tu carnet de identidad",
          },
          backCard: {
            value: sourceUser.identityCard
              ? sourceUser.identityCard.backCard.url
              : undefined,
            message: hasIdCard
              ? null
              : "Suba una foto mostrando la parte posterior de tu carnet de identidad",
          },
          location: {
            value: sourceUser.identityCard
              ? sourceUser.identityCard.location
              : "Cochabamba, Bolivia",
            message: hasIdCard ? null : "",
          },
        },
      });
      setLoading(false);
    } else {
      setPersonalData({
        fullname: {
          value: "",
          message: "Completa este campo por favor",
        },
        bloodType: {
          value: BloodTypes.OPositive,
          message: "Completa est campo por favor",
        },
        gender: {
          value: "",
          message: "Completa este campo por favor",
        },
        photo: {
          value: undefined,
          message: "Sube una foto de perfil",
        },
        homeAddress: {
          value: "",
          message: "Completa este campo por favor",
        },
        addressPhoto: {
          value: undefined,
          message:
            "Sube una foto de la factura de luz de tu domicilio por favor.",
        },
        alternativePhoneNumber: {
          value: "",
          message: null,
        },
        alternativePhoneNumberName: {
          value: "",
          message: null,
        },
        idCard: {
          frontCard: {
            value: undefined,
            message:
              "Suba una foto mostrando la parte frontal de tu carnet de identidad",
          },
          backCard: {
            value: undefined,
            message:
              "Suba una foto mostrando la parte posterior de tu carnet de identidad",
          },
          location: {
            value: "",
            message: "Agrega el lugar de emisión de tu carnet de identidad",
          },
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkingUserAuth) {
      return;
    }

    const sourceUser = baseUser ?? user;
    setRequesterUser(sourceUser);
    fillInformation(sourceUser);
  }, [checkingUserAuth, baseUser, user]);

  return (
    <>
      <div className="form-sub-container | margin-top-25">
        <h2 className="text icon-wrapper | medium-big bold">
          <UserIcon />
          Datos Personales
        </h2>

        {loading && (
          <span className="row-wrapper">
            <span className="loader | loader-gray small-loader"></span>
            <span className="text | bold gray-dark">Cargando datos</span>
          </span>
        )}
        <div
          className="form-sub-container"
          data-state={loading ? "loading" : "loaded"}
        >
          <p className="text | light">
            Por favor introduce tu nombre completo, nombre/s y apellidos
          </p>
          <TextField
            field={{
              values: personalData.fullname,
              setter: (e) =>
                setPersonalData({
                  ...personalData,
                  fullname: e,
                }),
              validator: isValidName,
            }}
            legend="Nombre completo"
            placeholder="Ej: Juan Pérez Gómez"
          />
          <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
              key={"form-section-vehicle-types"}
              value={personalData.gender.value as string}
              onChange={(e) => {
                setPersonalData({
                  ...personalData,
                  gender: {
                    value: e.target.value as Gender,
                    message: "",
                  },
                });
              }}
              className="form-section-input"
            >
              <option value={Gender.Male}>Masculino</option>
              <option value={Gender.Female}>Femenino</option>
              <option value={Gender.Other}>Otro</option>
            </select>
            <legend className="form-section-legend">Género</legend>
          </fieldset>

          <h3 className="text | bold icon-wrapper">Foto de Perfil</h3>

          <p className="text | light">
            Sube una foto donde se vea claramente tu rostro. Evita imágenes
            oscuras, borrosas o con gafas de sol. Esto ayuda a que los demás te
            identifiquen con confianza. Recomendamos que la foto tenga fondo
            blanco o claro.
          </p>

          <ImageUploader
            uploader={{
              image: personalData.photo,
              setImage: (i) => {
                setPersonalData({
                  ...personalData,
                  photo: i,
                });
              },
            }}
            content={{
              id: "personal-data-photo-uploader",
              legend: "Foto de Perfil",
              imageInCircle: true,
            }}
          />
          <div>
            <div className="separator-horizontal"></div>
          </div>
          <div>
            <h3 className="text | bold icon-wrapper">
              <Phone /> Número de teléfono alternativo
            </h3>
            <p className="text | light" style={{ marginTop: 8 }}>
              Agrega un numero alternativo de un familiar o persona cercana a
              tí, (diferente a tu número personal{" "}
              {requesterUser?.phoneNumber.number}) para que nuestros
              administradores puedan contactarte mas rápido en caso de cualquier
              inconveniente.
            </p>
          </div>
          <TextField
            field={{
              values: personalData.alternativePhoneNumberName,
              setter: (e) =>
                setPersonalData({
                  ...personalData,
                  alternativePhoneNumberName: e,
                }),
              validator: isValidName,
            }}
            legend="Nombre del contacto"
            placeholder="Ej: Juan Pérez Gómez"
          />
          <PhoneField
            values={personalData.alternativePhoneNumber}
            setter={(e) =>
              setPersonalData({
                ...personalData,
                alternativePhoneNumber: e,
              })
            }
          />
        </div>
      </div>
      <div>
        <div className="separator-horizontal"></div>
      </div>
      <IdentityCardForm
        idCardForm={personalData.idCard}
        setIdCardForm={(i) =>
          setPersonalData({
            ...personalData,
            idCard: i,
          })
        }
      />
      <div>
        <div className="separator-horizontal"></div>
      </div>
      <div>
        <h3 className="text | bold icon-wrapper">
          <HomeAddress /> Dirección de Domicilio
        </h3>
        <p className="text | light" style={{ marginTop: 8 }}>
          Introduce la dirección de tu domicilio.
        </p>
      </div>
      <TextField
        field={{
          values: personalData.homeAddress,
          setter: (e) =>
            setPersonalData({
              ...personalData,
              homeAddress: e,
            }),
          validator: isValidAddress,
        }}
        legend="Dirección de Domicilio"
        placeholder="Ej: Av. América entre Calle A y Calle B No. 123"
      />

      <h3 className="text | bold icon-wrapper">Foto de Factura de Luz</h3>

      <p className="text | light">
        Sube una foto de una factura de luz de su domicilio de los últimos 3
        meses para comprobar que tu domicilio corresponde al introducido.
        Asegúrate de que en la foto se puedan leer las letras de la factura.
      </p>

      <ImageUploader
        uploader={{
          image: personalData.addressPhoto,
          setImage: (i) => {
            setPersonalData({
              ...personalData,
              addressPhoto: i,
            });
          },
        }}
        content={{
          id: "address-data-photo-uploader",
          legend: "Foto de Factura de Luz",
          imageInCircle: false,
        }}
      />

      <BloodTypeField
        location={personalData.bloodType.value}
        setter={(d) =>
          setPersonalData({
            ...personalData,
            bloodType: {
              value: d,
              message: "",
            },
          })
        }
      />
      <div>
        <div className="separator-horizontal"></div>
      </div>
    </>
  );
};

export default PersonalDataForm;
