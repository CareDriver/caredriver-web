"use client";

import Popup from "@/components/modules/Popup";
import { BalanceHistory } from "@/interfaces/Payment";
import { useState } from "react";
import BalanceHistoryCard from "../../cards/BalanceHistoryCard";
import Clock from "@/icons/Clock";
import AnglesRight from "@/icons/AnglesRight";
import AnglesLeft from "@/icons/AnglesLeft";

const BalanceHistoryRenderer = ({
    balanceHistory,
}: {
    balanceHistory: BalanceHistory[] | undefined;
}) => {
    const MAX_NOTE_LENGTH_FOR_CARD = 17;
    const ITEMS_PER_PAGE = 8;

    const [currentPage, setCurrentPage] = useState(1);
    const [itemSelected, setItem] = useState<BalanceHistory | undefined>(
        undefined,
    );

    const orderHistory = (): BalanceHistory[] => {
        if (!balanceHistory) {
            return [];
        }
        return balanceHistory.sort(
            (a, b) => b.date.toMillis() - a.date.toMillis(),
        );
    };

    const paginatedHistory = (): BalanceHistory[] => {
        const ordered = orderHistory();
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return ordered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const totalPages = Math.ceil(
        (balanceHistory?.length || 0) / ITEMS_PER_PAGE,
    );

    return (
        balanceHistory &&
        balanceHistory.length > 0 && (
            <div className="margin-top-50">
                <h2 className="text icon-wrapper | bold gray-darker">
                    <Clock /> Historial de saldo
                </h2>
                <div className="debt-wrapper max-width-80">
                    {paginatedHistory().map((balance, i) => (
                        <BalanceHistoryCard
                            content={{
                                data: balance,
                            }}
                            behaviour={{
                                onClick: () => setItem(balance),
                            }}
                            style={{
                                extraClassStyle: "touchable",
                                maxNoteLenght: MAX_NOTE_LENGTH_FOR_CARD,
                            }}
                            key={`debt-item-history-${i}`}
                        />
                    ))}
                </div>
                <div className="row-wrapper">
                    <button
                        className={"circle-button gray icon-wrapper lb"}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
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
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        <AnglesRight />
                    </button>
                </div>
                {itemSelected && (
                    <Popup
                        isOpen={itemSelected !== undefined}
                        close={() => setItem(undefined)}
                    >
                        <BalanceHistoryCard
                            content={{
                                data: itemSelected,
                            }}
                            behaviour={{
                                toGoService: true,
                            }}
                        />
                    </Popup>
                )}
            </div>
        )
    );
};

export default BalanceHistoryRenderer;
