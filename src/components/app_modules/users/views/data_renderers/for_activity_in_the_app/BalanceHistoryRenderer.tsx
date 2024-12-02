"use client";

import Popup from "@/components/modules/Popup";
import { BalanceHistory } from "@/interfaces/Payment";
import { useState } from "react";
import BalanceHistoryCard from "../../cards/BalanceHistoryCard";

const BalanceHistoryRenderer = ({
    balanceHistory,
}: {
    balanceHistory: BalanceHistory[] | undefined;
}) => {
    const MAX_NOTE_LENGHT_FOR_CARD = 17;
    const orderHistory = (): BalanceHistory[] => {
        if (!balanceHistory) {
            return [];
        }

        return balanceHistory.sort(
            (a, b) => b.date.toMillis() - a.date.toMillis(),
        );
    };

    const [itemSelected, setItem] = useState<BalanceHistory | undefined>(
        undefined,
    );

    return (
        balanceHistory &&
        balanceHistory.length > 0 && (
            <div className="margin-top-50">
                <h2 className="text | bold gray-darker">Historial de saldo</h2>
                <div className="debt-wrapper max-width-80">
                    {orderHistory().map((balance, i) => (
                        <BalanceHistoryCard
                            content={{
                                data: balance,
                            }}
                            behaviour={{
                                onClick: () => setItem(balance),
                            }}
                            style={{
                                extraClassStyle: "touchable",
                                maxNoteLenght: MAX_NOTE_LENGHT_FOR_CARD,
                            }}
                            key={`debt-item-history-${i}`}
                        />
                    ))}
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
