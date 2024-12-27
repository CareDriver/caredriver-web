"use client";

import { DebtHistory } from "@/interfaces/Payment";
import EnterprisePaidDebtCard from "../cards/EnterprisePaidDebtCard";
import "@/styles/components/debt-user.css";
import { useState } from "react";
import Popup from "@/components/modules/Popup";

interface Props {
    history: DebtHistory[] | undefined;
}

const EnterprisePaidDebtHistoryRenderer: React.FC<Props> = ({ history }) => {
    const MAX_NOTE_LENGHT_FOR_CARD = 15;
    const [itemSelected, setItem] = useState<undefined | DebtHistory>(
        undefined,
    );

    if (!history) {
        return;
    }

    return (
        <section className="margin-top-50">
            <h2 className="text | bold gray-darker">
                Historial de deudas pagadas
            </h2>
            <div className="debt-wrapper">
                {history.map((item, i) => (
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
