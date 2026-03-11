"use client";

import { useContext, useState } from "react";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import Google from "@/icons/Google";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/FirebaseConfig";
import PhoneConfirmationModal from "../modals/PhoneConfirmationModal";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import {
  getUserById,
  saveUser,
} from "@/components/app_modules/users/api/UserRequester";
import { routeToRedirector } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import { toast } from "react-toastify";
import { EMPTY_USER_DATA } from "../../api/UserAuth";
import AppleIcon from "@/icons/AppleIcon";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";

const AuthProviders = ({
  alternativeLegend,
}: {
  alternativeLegend?: string;
}) => {
  const { authWithProvider, setAuthWithProvider } =
    useContext(AuthenticatorContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [providerUser, setProviderUser] = useState<any | null>(null);
  const [tempPhone, setTempPhone] = useState<TextFieldForm>(DEFAUL_TEXT_FIELD);

  const handleProviderSignIn = async (type: "google" | "apple") => {
    if (authWithProvider) return;
    setAuthWithProvider(true);

    try {
      const provider =
        type === "google"
          ? new GoogleAuthProvider()
          : new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider as any);
      const user = result.user;
      // Check if user already exists in Firestore
      const userFound = await getUserById(user.uid);
      if (userFound) {
        // Existing user -> redirect
        window.location.replace(routeToRedirector());
      } else {
        // New user -> ask for phone
        setProviderUser(user);
        // initialize tempPhone if possible
        setTempPhone({ ...DEFAUL_TEXT_FIELD, value: "+591" });
        setShowConfirmModal(true);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al autenticar con el proveedor");
    } finally {
      setAuthWithProvider(false);
    }
  };

  const handleConfirmFromProvider = async (phone?: string) => {
    if (!providerUser) return;
    setAuthWithProvider(true);
    try {
      const newUser = {
        ...EMPTY_USER_DATA,
        id: providerUser.uid,
        fullName: providerUser.displayName ? providerUser.displayName : "",
        photoUrl: { url: providerUser.photoURL ?? "", ref: "" },
        email: providerUser.email
          ? providerUser.email.toLowerCase().trim()
          : "",
        phoneNumber: {
          countryCode: "+591",
          number: (phone || tempPhone.value || "").replace(/\+591/, ""),
        },
      };

      await toast.promise(saveUser(providerUser.uid, newUser), {
        pending: "Creando nueva cuenta",
        success: "Cuenta creada",
        error: "Error al crear la cuenta, inténtalo de nuevo por favor",
      });
      window.location.replace(routeToRedirector());
      await acceptTerms(providerUser.uid ?? "");
    } catch (e) {
      console.error(e);
      toast.error("Error al crear la cuenta");
      setAuthWithProvider(false);
    }
  };

  return (
    <>
      <div className="form-provider-option">
        <div className="form-provider-option-separator"></div>
        <span className="form-provider-option-o">
          {alternativeLegend ? alternativeLegend : "o"}
        </span>
        <div className="form-provider-option-separator"></div>
      </div>

      <div style={{ gap: "0.75rem", alignItems: "center" }}>
        <button
          className="form-section-input | form-provider-auth-button touchable"
          onClick={() => handleProviderSignIn("google")}
          style={{ marginBottom: 20 }}
        >
          {authWithProvider ? (
            <i className="loader-green"></i>
          ) : (
            <span className="form-provider-auth-button-content icon-wrapper white-icon">
              <Google />
              Continuar con Google
            </span>
          )}
        </button>

        <button
          className="form-section-input | form-provider-auth-button touchable"
          onClick={() => handleProviderSignIn("apple")}
        >
          {authWithProvider ? (
            <i className="loader-green"></i>
          ) : (
            <span className="form-provider-auth-button-content icon-wrapper white-icon">
              {/* simple apple glyph */}
              <AppleIcon />
              Continuar con Apple
            </span>
          )}
        </button>
      </div>

      <PhoneConfirmationModal
        phoneNumber={tempPhone.value}
        isOpen={showConfirmModal}
        onConfirm={(phone) => handleConfirmFromProvider(phone)}
        onEdit={() => setShowConfirmModal(false)}
        isLoading={authWithProvider}
        editable={true}
        editableValues={tempPhone}
        editableSetter={(val: TextFieldForm) => setTempPhone(val)}
      />
    </>
  );
};

export default AuthProviders;
