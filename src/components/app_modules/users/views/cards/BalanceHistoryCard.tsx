import { BalanceHistory } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { cutTextWithDotsByLength } from "@/utils/text_helpers/TextCutter";

interface Props {
    content: {
        data: BalanceHistory;
    };
    style?: {
        maxNoteLenght?: number;
        extraClassStyle?: string;
    };
    behaviour?: {
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

    return (
        <div
            className={`debt-item ${
                content.data.newBalance
                    ? getDifference(
                          content.data.amount,
                          content.data.newBalance.amount,
                      ) < 0
                        ? "decreased"
                        : "increased"
                    : ""
            } ${style?.extraClassStyle ?? ""}`}
            onClick={behaviour?.onClick ?? (() => {})}
        >
            <div>
                <span
                    className={`text | bold medium ${
                        content.data.newBalance
                            ? getDifference(
                                  content.data.amount,
                                  content.data.newBalance.amount,
                              ) < 0
                                ? "red"
                                : "green"
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
                    <span className={`text | bold medium`}>
                        {" "}
                        | {content.data.newBalance.amount}
                        {content.data.newBalance.currency}
                    </span>
                )}
            </div>
            <span className="text | light">
                {timestampDateInSpanish(content.data.date)}
            </span>
            {content.data.note && (
                <div className="margin-top-25 wrap">
                    <b className="text | bold">Nota: </b>
                    <i className="text | light">
                        {style?.maxNoteLenght
                            ? cutTextWithDotsByLength(
                                  content.data.note,
                                  style?.maxNoteLenght,
                              )
                            : content.data.note}
                    </i>
                </div>
            )}
        </div>
    );
};

export default BalanceHistoryCard;
