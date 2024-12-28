import { BalanceHistory } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";

interface Props {
    content: {
        data: BalanceHistory;
    };
    style?: {
        maxNoteLenght?: number;
        extraClassStyle?: string;
    };
    behaviour?: {
        toGoService?: boolean;
        onClick?: () => void;
    };
}

const BalanceHistoryCard: React.FC<Props> = ({ content, style, behaviour }) => {
    const getDifference = (oldPrice: number, newPrice: number): number => {
        if (oldPrice === newPrice && newPrice > 0) {
            return -1 * newPrice;
        }

        return newPrice - oldPrice;
    };

    const handleClick = () => {
        if (
            behaviour?.toGoService &&
            content.data.serviceType &&
            content.data.serviceFakeId
        ) {
            window.open(
                routeToServicePerformed(
                    content.data.serviceType,
                    content.data.serviceFakeId,
                ),
                "_blank",
            );
        } else {
            const func = behaviour?.onClick ?? (() => {});
            func();
        }
    };

    return (
        <div
            className={`debt-item left ${
                content.data.newBalance
                    ? getDifference(
                          content.data.amount,
                          content.data.newBalance.amount,
                      ) < 0
                        ? "decreased"
                        : "increased"
                    : ""
            } ${style?.extraClassStyle ?? ""}`}
            onClick={handleClick}
        >
            <div>
                <span
                    className={`text | big-medium-v3 bold ${
                        content.data.newBalance
                            ? getDifference(
                                  content.data.amount,
                                  content.data.newBalance.amount,
                              ) < 0
                                ? "red"
                                : "green-light"
                            : ""
                    }`}
                >
                    {content.data.newBalance
                        ? getDifference(
                              content.data.amount,
                              content.data.newBalance.amount,
                          ) > 0
                            ? "+".concat(
                                  getDifference(
                                      content.data.amount,
                                      content.data.newBalance.amount,
                                  ).toString(),
                              )
                            : getDifference(
                                  content.data.amount,
                                  content.data.newBalance.amount,
                              )
                        : content.data.amount}
                    {content.data.currency}
                </span>
                {content.data.newBalance && (
                    <div className={`text | bold`}>
                        {content.data.newBalance.amount}
                        {content.data.newBalance.currency}
                    </div>
                )}
            </div>
            <div className="separator-horizontal"></div>
            <span className="text | light">
                {timestampDateInSpanish(content.data.date)}
            </span>
            {!style?.maxNoteLenght && content.data.note && (
                <div className="margin-top-25 wrap">
                    <b className="text | bold">Nota: </b>
                    <i className="text | light">{content.data.note}</i>
                </div>
            )}
            {behaviour?.toGoService &&
                content.data.serviceType &&
                content.data.serviceFakeId && (
                    <span className="text | light underline">
                        Click para ir al servicio
                    </span>
                )}
        </div>
    );
};

export default BalanceHistoryCard;
