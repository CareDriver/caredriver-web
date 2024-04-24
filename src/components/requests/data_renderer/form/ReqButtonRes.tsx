import CircleCheck from "@/icons/CircleCheck";
import CircleXmark from "@/icons/CircleXmark";
import { SyntheticEvent } from "react";

const ReqButtonRes = ({
    onDecline,
    onApprove,
    loading,
}: {
    onDecline: () => Promise<void>;
    onApprove: () => Promise<void>;
    loading: boolean;
}) => {
    const execute = async (e: SyntheticEvent) => {
        e.preventDefault();
        var button = e.target as HTMLButtonElement;
        const content = button.innerHTML;
        button.classList.add("loading-section");
        button.innerHTML = '<span className="loader"></span>';
        if (button.name === "button_1") {
            await onDecline();
        } else {
            await onApprove();
        }
        button.innerHTML = content;
        button.classList.remove("loading-section");
    };

    return (
        <div
            className="row-wrapper | gap-20 | margin-top-25 max-width-60 loading-section"
            data-state={loading ? "loading" : "loaded"}
        >
            <button
                className="icon-wrapper general-button | touchable gray lb"
                type="button"
                name="button_1"
                onClick={execute}
            >
                <CircleXmark />
                Rechazar
            </button>
            <button
                className={`icon-wrapper general-button | green-icon touchable lb`}
                type="button"
                name="button_2"
                onClick={execute}
            >
                <CircleCheck />
                Aceptar
            </button>
        </div>
    );
};

export default ReqButtonRes;
