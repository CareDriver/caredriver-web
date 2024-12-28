import AnglesLeft from "@/icons/AnglesLeft";
import AnglesRight from "@/icons/AnglesRight";

interface Props {
    next: () => void;
    back: () => void;
    totalPages: number;
    currentPage: number;
}

const TogglePaginationHandler: React.FC<Props> = ({
    next,
    back,
    totalPages,
    currentPage,
}) => {
    return (
        <div className="row-wrapper">
            <button
                className={"circle-button gray icon-wrapper lb"}
                onClick={back}
                disabled={currentPage === 1}
            >
                <AnglesLeft />
            </button>
            <span className="text">
                Página{" "}
                <b className="text | bold">
                    {currentPage} de {totalPages}
                </b>
            </span>
            <button
                className="circle-button gray icon-wrapper lb"
                onClick={next}
                disabled={currentPage === totalPages}
            >
                <AnglesRight />
            </button>
        </div>
    );
};

export default TogglePaginationHandler;
