"use client";

import { DebtHistory } from "@/interfaces/Payment";
import EnterprisePaidDebtCard from "../cards/EnterprisePaidDebtCard";
import "@/styles/components/debt-user.css";
import { useState } from "react";
import Popup from "@/components/modules/Popup";
import Clock from "@/icons/Clock";
import { useListPagination } from "@/hooks/useListPagination";
import TogglePaginationHandler from "@/components/navigation/pagination/TogglePaginationHandler";

interface Props {
    history: DebtHistory[] | undefined;
}

const EnterprisePaidDebtHistoryRenderer: React.FC<Props> = ({ history }) => {
    const MAX_NOTE_LENGHT_FOR_CARD = 15;
    const { next, back, currentPage, itemsPaginated, totalPages } =
        useListPagination<DebtHistory>({
            items: history ?? [],
            orderItems: (): DebtHistory[] => {
                if (!history) {
                    return [];
                }

                return history.sort(
                    (a, b) => b.date.toMillis() - a.date.toMillis(),
                );
            },
            pageSize: 9,
        });
    const [itemSelected, setItem] = useState<undefined | DebtHistory>(
        undefined,
    );

    if (!history) {
        return;
    }

    return (
        <section className="margin-top-50">
            <h2 className="text | bold gray-darker | icon-wrapper">
                <Clock /> Historial de deudas pagadas
            </h2>
            <div className="debt-wrapper | no-border">
                {itemsPaginated.map((item, i) => (
                    <EnterprisePaidDebtCard
                        content={{
                            data: item,
                        }}
                        style={{
                            extraClassStyle: "touchable",
                            maxNoteLenght: MAX_NOTE_LENGHT_FOR_CARD,
                        }}
                        behaviour={{
                            onClick: () => setItem(item),
                        }}
                        key={`key-paid-history-${i}`}
                    />
                ))}
            </div>
            <TogglePaginationHandler
                next={next}
                back={back}
                currentPage={currentPage}
                totalPages={totalPages}
            />
            {itemSelected && (
                <Popup
                    isOpen={itemSelected !== undefined}
                    close={() => setItem(undefined)}
                >
                    <EnterprisePaidDebtCard
                        content={{
                            data: itemSelected,
                        }}
                    />
                </Popup>
            )}
        </section>
    );
};

export default EnterprisePaidDebtHistoryRenderer;
