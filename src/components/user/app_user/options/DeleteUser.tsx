import TriangleExclamation from "@/icons/TriangleExclamation";
import { ChangeEvent, SyntheticEvent } from "react";

const DeleteUser = ({
    loading,
    onChange,
    onAction,
    validToDelete,
}: {
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAction: () => Promise<void>;
    validToDelete: boolean;
}) => {
    const execute = async (e: SyntheticEvent) => {
        e.preventDefault();
        var button = e.target as HTMLButtonElement;
        const text = button.innerHTML;
        button.innerHTML = "";
        button.classList.add("loading-section");
        var loader = document.createElement("span");
        loader.classList.add("loader");
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
            <h2 className="text icon-wrapper | red red-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>
                Esta accion no se puede revertir, aunque no se afectara los datos que
                estan relacionados con este. Por favor escribe el nombre del usuario para
                confirmar su eliminacion.
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
                className={`general-button | red no-full touchable ${
                    loading && "loading-section"
                }`}
                disabled={!validToDelete}
            >
                Eliminar usuario
            </button>
        </div>
    );
};

export default DeleteUser;
