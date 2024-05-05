import TriangleExclamation from "@/icons/TriangleExclamation";
import { ChangeEvent, SyntheticEvent } from "react";

const DisableUser = ({
    loading,
    onChange,
    onAction,
    validToDelete,
    isDisable,
}: {
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAction: () => Promise<void>;
    validToDelete: boolean;
    isDisable: boolean;
}) => {
    const execute = async (e: SyntheticEvent) => {
        e.preventDefault();
        var button = e.target as HTMLButtonElement;
        const text = button.innerHTML;
        button.innerHTML = "";
        button.classList.add("loading-section");
        var loader = document.createElement("span");
        loader.classList.add("loader-black");
        button.appendChild(loader);

        await onAction();

        button.removeChild(loader);
        button.innerHTML = text;
        button.classList.remove("loading-section");
    };

    return (
        <div
            className={`form-sub-container | margin-top-50 max-width-60`}
            data-state={loading ? "loading" : "loaded"}
        >
            <h2 className="text icon-wrapper | yellow yellow-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>
                Esta accion si se puede revertir, aunque el usuario no podra usar la
                aplicacion mientras este desabilitado.
            </p>
            <fieldset className="form-section | max-width-60">
                <input
                    type="text"
                    placeholder="Nombre del usuario"
                    className="form-section-input"
                    name="fullname"
                    onChange={onChange}
                    autoComplete="off"
                />
            </fieldset>
            <button
                type="button"
                onClick={execute}
                className={`general-button | yellow no-full touchable ${
                    loading && validToDelete && "loading-section"
                }`}
                disabled={!validToDelete}
            >
                {isDisable ? (
                    "Habilitar usuario"
                ) : (
                    "Deshabilitar usuario"
                )}
            </button>
        </div>
    );
};

export default DisableUser;
