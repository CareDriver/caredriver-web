import AngleLeft from "@/icons/AngleLeft";
import AngleRight from "@/icons/AngleRight";
import { Dispatch, SetStateAction } from "react";

const PageChanger = ({
    pages,
    page,
    loading,
    setDirection,
    setPage,
}: {
    pages: number | null;
    page: number;
    loading: boolean;
    setDirection: Dispatch<SetStateAction<"prev" | "next" | undefined>>;
    setPage: Dispatch<SetStateAction<number>>;
}) => {
    const handlePreviousClick = () => {
        if (!loading) {
            if (page === 1) return;
            setDirection("prev");
            setPage((prev) => prev - 1);
        }
    };

    const handleNextClick = () => {
        if (!loading) {
            if (page === pages) return;
            setDirection("next");
            setPage((prev) => prev + 1);
        }
    };

    return (
        pages &&
        pages > 1 && (
            <div
                className="pagination-wrapper"
                data-state={loading ? "loading" : "loaded"}
            >
                <button
                    className="icon-wrapper circle-button touchable green-icon"
                    disabled={page === 1}
                    onClick={handlePreviousClick}
                >
                    <AngleLeft />
                </button>

                <span className="pagination-indicator">
                    Pagina {page} de {pages}
                </span>

                <button
                    className="icon-wrapper circle-button touchable green-icon"
                    disabled={page === pages}
                    onClick={handleNextClick}
                >
                    <AngleRight />
                </button>
            </div>
        )
    );
};

export default PageChanger;
