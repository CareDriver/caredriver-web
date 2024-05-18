import CircleCheck from "@/icons/CircleCheck";
import CircleXmark from "@/icons/CircleXmark";
import { SyntheticEvent } from "react";

const ReqButtonRes = ({
    onDecline,
    onApprove,
    loading,
    stateB1,
    stateB2,
    alreadyReviewed,
}: {
    onDecline: () => Promise<void>;
    onApprove: () => Promise<void>;
    loading: boolean;
    stateB1: boolean;
    stateB2: boolean;
    alreadyReviewed: boolean;
}) => {
    const execute = async (e: SyntheticEvent) => {
        e.preventDefault();
        var button = e.target as HTMLButtonElement;
        const icon = button.children[0];
        const text = button.innerHTML;
        if (icon) {
            button.removeChild(icon);
        }
        button.innerHTML = "";
        button.classList.add("loading-section");
        var loader = document.createElement("span");
        loader.classList.add("loader");
        button.appendChild(loader);
        if (button.name === "button_1") {
            loader.classList.add("loader-black");
            await onDecline();
        } else {
            await onApprove();
        }
        button.removeChild(loader);
        if (icon) {
            button.appendChild(icon);
        }
        button.innerHTML = text;
        button.classList.remove("loading-section");
    };

    return (
        <div
            className="row-wrapper | gap-20 | margin-top-15 loading-section"
            data-state={loading || alreadyReviewed ? "loading" : "loaded"}
            title={alreadyReviewed ? "Esta peticion ya fue revisada" : ""}
        >
            <button
                className="icon-wrapper general-button | center touchable yellow lb"
                type="button"
                name="button_1"
                onClick={execute}
                disabled={!stateB1}
            >
                <CircleXmark />
                Rechazar
            </button>
            <button
                className={`icon-wrapper general-button | center white-icon touchable lb`}
                type="button"
                name="button_2"
                onClick={execute}
                disabled={!stateB2}
            >
                <CircleCheck />
                Aceptar
            </button>
        </div>
    );
};

export default ReqButtonRes;
