"use client";

// @ts-ignore: No type declarations for this CSS side-effect importF
import "react-international-phone/style.css";
import { auth } from "@/firebase/FirebaseConfig";
import {
  checkEmailExists,
  saveUser,
} from "@/components/app_modules/users/api/UserRequester";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useContext, useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { UserInterface } from "@/interfaces/UserInterface";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import LocationField from "@/components/form/view/fields/LocationField";
// @ts-ignore: No type declarations for this CSS side-effect importF
import Link from "next/link";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { Locations } from "@/interfaces/Locations";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidName } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { EMPTY_USER_DATA } from "../../api/UserAuth";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import { sendVerificationCode } from "../../api/VerificationCodeSender";
import CodeVerifier from "../verifiers/CodeVerifier";
import AuthProviders from "../providers/AuthProviders";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";
import PhoneConfirmationModal from "../modals/PhoneConfirmationModal";

interface Form {
  fullName: TextFieldForm;
  phone: TextFieldForm;
  email: TextFieldForm;
  password: TextFieldForm;
  location: Locations;
  code: string;
  termsChecked: boolean;
}

enum View {
  FILLING_OUT_FORM,
  VERIFYING_CODE,
}

const SignUpForm = () => {
  const [view, setView] = useState(View.FILLING_OUT_FORM);
  const { loading, isValid, setLoading, setValid } =
    useContext(AuthenticatorContext);

  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const signUp = async () => {
    setLoading(true);

    if (!isValidForm(form)) {
      setLoading(false);
      setValid(false);
      toast.error("Formulario invalido");
      return;
    }

    let amountOfUsers = await checkEmailExists(
      form.email.value.trim().toLocaleLowerCase(),
    );
    if (amountOfUsers > 0) {
      setForm((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          message: "El correo ya fue registrado",
        },
      }));
      setLoading(false);
      setValid(false);
      toast.error("El correo ya fue registrado, inicia sesión");
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      form.email.value.toLocaleLowerCase().trim(),
      form.password.value.trim(),
    )
      .then(async (res) => {
        let newUser: UserInterface = formToNewUser(form);
        newUser.id = res.user.uid;

        await acceptTerms(res.user.uid ?? "");

        saveUser(res.user.uid, newUser)
          .then(() => {
            toast.success("Registro exitoso");
            window.location.replace("/redirector");
          })
          .catch(() => {
            setLoading(false);
            toast.error(
              "Error al guardar los datos, inténtalo de nuevo por favor",
            );
          });
      })
      .catch((e) => {
        let errorCode = e.code;
        if (errorCode === "auth/email-already-in-use") {
          toast.error("El correo electrónico ya está en uso");
          setForm({
            ...form,
            email: {
              ...form.email,
              message: "El correo electrónico ya está en uso",
            },
          });
          setLoading(false);
          setValid(false);
        } else {
          toast.error("Algo fallo, inténtalo de nuevo por favor");
          setLoading(false);
          setValid(false);
        }
      });
  };

  const handleSubmit = async (e?: FormEvent): Promise<void> => {
    // Prevent default from form wrappers if any
    if (e && e.preventDefault) e.preventDefault();

    if (!isValidForm(form)) {
      setValid(false);
      toast.error(
        "Por favor completa correctamente el formulario antes de continuar.",
      );
      return;
    }

    // Show confirmation modal about phone number
    setShowConfirmModal(true);
  };

  const handleConfirmPhone = async () => {
    setShowConfirmModal(false);
    await signUp();
  };

  const handleEditPhone = () => {
    setShowConfirmModal(false);
    // Let the user edit the phone field
    // Focus could be added if PhoneField exposes a ref
  };

  /* const sentCode = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);

    if (!isValidForm(form)) {
      setLoading(false);
      setValid(false);
      toast.error("Formulario invalido");
      return;
    }

    try {
      let amountOfUsers = await checkEmailExists(
        form.email.value.trim().toLocaleLowerCase()
      );
      if (amountOfUsers > 0) {
        setForm((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            message: "El correo ya fue registrado",
          },
        }));
        setLoading(false);
        setValid(false);
        toast.error("El correo ya fue registrado, inicia sesión");
        return;
      }

      try {
        let codeSent: string = await sendVerificationCode(form.phone.value);
        setForm((prev) => ({
          ...prev,
          code: codeSent,
        }));

        setLoading(false);
        setView(View.VERIFYING_CODE);
      } catch (e) {
        setLoading(false);
        setValid(false);
        toast.error("Ocurrio un error, inténtalo de nuevo por favor");
      }
    } catch (e) {
      setLoading(false);
      setValid(false);
      toast.error("Ocurrio un error, inténtalo de nuevo por favor");
    }
  }; */

  useEffect(() => {
    setValid(isValidForm(form));
  }, [form, setValid]);

  if (view === View.VERIFYING_CODE) {
    return <CodeVerifier onSummbit={signUp} verificationCode={form.code} />;
  }

  return (
    <>
      <BaseForm
        content={{
          button: {
            content: {
              legend: "Registrarse",
            },
            behavior: {
              isValid: isValid,
              loading: loading,
            },
          },
        }}
        behavior={{
          loading: loading,
          onSummit: handleSubmit,
        }}
      >
        <TextField
          field={{
            values: form.fullName,
            setter: (e) =>
              setForm((prev) => ({
                ...prev,
                fullName: e,
              })),
            validator: isValidName,
          }}
          legend="Nombre completo"
        />
        <EmailField
          values={form.email}
          setter={(e) =>
            setForm((prev) => ({
              ...prev,
              email: {
                value: e.value.toLowerCase().trim(),
                message: e.message,
              },
            }))
          }
        />
        <PasswordField
          values={form.password}
          setter={(e) => setForm((prev) => ({ ...prev, password: e }))}
        />

        <PhoneField
          values={form.phone}
          setter={(e) => setForm((prev) => ({ ...prev, phone: e }))}
        />
        <LocationField
          location={form.location}
          setter={(e) => setForm((prev) => ({ ...prev, location: e }))}
        />
        <PrivacyTermsSection
          isCheck={form.termsChecked}
          setCheck={(checked) =>
            setForm((prev) => ({ ...prev, termsChecked: checked }))
          }
        />
      </BaseForm>

      <PhoneConfirmationModal
        phoneNumber={form.phone.value}
        isOpen={showConfirmModal}
        onConfirm={handleConfirmPhone}
        onEdit={handleEditPhone}
        isLoading={loading}
      />

      <AuthProviders alternativeLegend="O registrate con" />
      <Link href={routeToSingIn()} className="text | normal center">
        ¿Ya tienes cuenta? <b>Inicia sesión</b>
      </Link>
    </>
  );
};

export default SignUpForm;

const DEFAULT_FORM: Form = {
  fullName: DEFAUL_TEXT_FIELD,
  phone: DEFAUL_TEXT_FIELD,
  email: DEFAUL_TEXT_FIELD,
  password: DEFAUL_TEXT_FIELD,
  code: "",
  location: Locations.CochabambaBolivia,
  termsChecked: false,
};

const isValidForm = (form: Form): boolean => {
  return (
    isValidTextField(form.email) &&
    isValidTextField(form.password) &&
    isValidTextField(form.fullName) &&
    isValidTextField(form.phone) &&
    form.termsChecked
  );
};

function formToNewUser(form: Form): UserInterface {
  return {
    ...EMPTY_USER_DATA,
    fullName: form.fullName.value.trimEnd().trimStart(),
    phoneNumber: parseBoliviaPhone(form.phone.value),
    location: form.location,
    email: form.email.value.toLocaleLowerCase().trim(),
  };
}
