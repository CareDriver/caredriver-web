import { ComissionHistory } from "@/interfaces/Payment";
import EntepriseComissionHistoryCard from "../cards/EntepriseComissionHistoryCard";
import "@/styles/components/debt-user.css";
import Clock from "@/icons/Clock";
import { useListPagination } from "@/hooks/useListPagination";
import TogglePaginationHandler from "@/components/navigation/pagination/TogglePaginationHandler";

interface Props {
  history: ComissionHistory[] | undefined;
}

const EnterpriseComissionHistoryRenderer: React.FC<Props> = ({ history }) => {
  const { next, back, currentPage, itemsPaginated, totalPages } =
    useListPagination<ComissionHistory>({
      items: history ?? [],
      orderItems: (): ComissionHistory[] => history ?? [],
      pageSize: 8,
    });

  if (!history || history.length == 0) {
    return;
  }

  return (
    <section className="margin-top-25">
      <h2 className="text | bold gray-darker | icon-wrapper">
        <Clock /> Historial de servicios de los trabajadores
      </h2>
      <div className="debt-wrapper | no-border">
        {itemsPaginated.map((item, i) => (
          <EntepriseComissionHistoryCard
            comission={item}
            key={`enterprise-commision-history-item-${i}`}
          />
        ))}
      </div>
      <TogglePaginationHandler
        next={next}
        back={back}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
};

export default EnterpriseComissionHistoryRenderer;
