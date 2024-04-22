import CircleCheck from "@/icons/CircleCheck";
import CircleXmark from "@/icons/CircleXmark";

const ReqButtonRes = ({
    onDecline,
    onApprove,
    loading,
}: {
    onDecline: () => void;
    onApprove: () => void;
    loading: boolean;
}) => {
    return (
        <div
            className="row-wrapper | gap-20 | margin-top-25 max-width-60 loading-section"
            data-state={loading ? "loading" : "loaded"}
        >
            <button
                className="icon-wrapper general-button touchable | gray lb"
                type="button"
                onClick={onDecline}
            >
                {loading ? (
                    <span className="loader"></span>
                ) : (
                    <>
                        <CircleXmark />
                        Rechazar
                    </>
                )}
            </button>
            <button
                className={`icon-wrapper general-button touchable lb ${
                    loading && "loading-section"
                }`}
                onClick={onApprove}
            >
                {loading ? (
                    <span className="loader"></span>
                ) : (
                    <>
                        <CircleCheck />
                        Aceptar
                    </>
                )}
            </button>
        </div>
    );
};

export default ReqButtonRes;
