"use client";

import Popup from "@/components/modules/Popup";
import { BalanceHistory } from "@/interfaces/Payment";
import { useState } from "react";
import BalanceHistoryCard from "../../cards/BalanceHistoryCard";
import Clock from "@/icons/Clock";
import { useListPagination } from "@/hooks/useListPagination";
import TogglePaginationHandler from "@/components/navigation/pagination/TogglePaginationHandler";

const BalanceHistoryRenderer = ({
  balanceHistory,
}: {
  balanceHistory: BalanceHistory[] | undefined;
}) => {
  const MAX_NOTE_LENGTH_FOR_CARD = 17;
  const [itemSelected, setItem] = useState<BalanceHistory | undefined>(
    undefined,
  );
  const { next, back, totalPages, itemsPaginated, currentPage } =
    useListPagination<BalanceHistory>({
      items: balanceHistory ?? [],
      orderItems: (): BalanceHistory[] => {
        if (!balanceHistory) {
          return [];
        }
        return balanceHistory.sort(
          (a, b) => b.date.toMillis() - a.date.toMillis(),
        );
      },
      pageSize: 8,
    });

  return (
    balanceHistory &&
    balanceHistory.length > 0 && (
      <div className="margin-top-50">
        <h2 className="text icon-wrapper | bold gray-darker">
          <Clock /> Historial de saldo
        </h2>
        <div className="debt-wrapper max-width-80">
          {itemsPaginated.map((balance, i) => (
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
