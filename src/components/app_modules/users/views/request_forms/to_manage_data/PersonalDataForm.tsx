"use client";

import { useCallback, useContext, useEffect, useState } from "react";
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
import "react-international-phone/style.css";
import Phone from "@/icons/Phone";
import PersonCircleCheck from "@/icons/PersonCircleCheck";
import HomeAddress from "@/icons/HomeAddress";
import ChevronDown from "@/icons/ChevronDown";

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
  const fillInformation = useCallback(() => {
    if (requesterUser) {
      var hasIdCard: boolean =
        requesterUser.identityCard !== null &&
        requesterUser.identityCard !== undefined;
      setPersonalData({
        fullname: {
          value: requesterUser.fullName,
          message: null,
        },
        bloodType: {
          value: requesterUser.bloodType || "",
          message: null,
        },
        gender: {
          value: requesterUser.gender || Gender.Male,
          message: null,
        },
        homeAddress: {
          value: requesterUser.homeAddress,
          message: "Introduce tu dirección de domicilio",
        },
        addressPhoto: {
          value:
            requesterUser.addressPhoto?.url.length > 0
              ? requesterUser.addressPhoto.url
              : undefined,
          message:
            requesterUser.addressPhoto?.url.length > 0
              ? null
              : "Sube una foto de la factura de luz de tu domicilio.",
        },
        photo: {
          value:
            requesterUser.photoUrl.url.length > 0
              ? requesterUser.photoUrl.url
              : undefined,
          message:
            requesterUser.photoUrl.url.length > 0
              ? null
              : "Por favor, sube una foto de perfil",
        },
        alternativePhoneNumber: {
          value: flatPhone(requesterUser.alternativePhoneNumber) ?? "",
          message: null,
        },
        idCard: {
          frontCard: {
            value: requesterUser.identityCard
              ? requesterUser.identityCard.frontCard.url
              : undefined,
            message: hasIdCard
              ? null
              : "Suba una foto mostrando la parte frontal de tu carnet de identidad",
          },
          backCard: {
            value: requesterUser.identityCard
              ? requesterUser.identityCard.backCard.url
              : undefined,
            message: hasIdCard
              ? null
              : "Suba una foto mostrando la parte posterior de tu carnet de identidad",
          },
          location: {
            value: requesterUser.identityCard
              ? requesterUser.identityCard.location
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
          value: "",
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
          message: "Sube una foto de la factura de luz de tu domicilio.",
        },
        alternativePhoneNumber: {
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
  }, [requesterUser, setPersonalData, setLoading]);

  const loadRequesterUserData = useCallback(() => {
    if (!baseUser && user) {
      setRequesterUser(user);
    }

    fillInformation();
  }, [user, baseUser, setRequesterUser]);

  useEffect(() => {
    if (!checkingUserAuth) {
      loadRequesterUserData();
    }
  }, [checkingUserAuth, loadRequesterUserData]);

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
          />
          <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
              key={"form-section-vehicle-types"}
              defaultValue={""}
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
            identifiquen con confianza
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
              <Phone /> Numero de teléfono alternativo (Opcional)
            </h3>
            <p className="text | light" style={{ marginTop: 8 }}>
              Este campo es opcional, puedes agregar un numero alternativo
              (diferente a tu número personal{" "}
              {requesterUser?.phoneNumber.number}) para que nuestros
              administradores puedan contactarte mas rápido.
            </p>
          </div>
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
        legend="Dirección"
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
      <TextField
        field={{
          values: personalData.bloodType,
          setter: (e) =>
            setPersonalData({
              ...personalData,
              bloodType: e,
            }),
          validator: isValidName,
        }}
        legend="Tipo de sangre (en caso de accidentes)"
      />
      <div>
        <div className="separator-horizontal"></div>
      </div>
    </>
  );
};

export default PersonalDataForm;
