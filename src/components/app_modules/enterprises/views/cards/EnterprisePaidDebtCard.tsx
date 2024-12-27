import { DebtHistory } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { cutTextWithDotsByLength } from "@/utils/text_helpers/TextCutter";
import { isNullOrEmptyText } from "@/validators/TextValidator";

interface Props {
    content: {
        data: DebtHistory;
    };
    style?: {
        maxNoteLenght?: number;
        extraClassStyle?: string;
    };
    behaviour?: {
        onClick?: () => void;
    };
}

const EnterprisePaidDebtCard: React.FC<Props> = ({
    content,
    behaviour,
    style,
}) => {
    const handleClick = () => {
        behaviour?.onClick && behaviour.onClick();
    };

    return (
        <div
            className={`debt-item ${style?.extraClassStyle ?? ""}`}
            onClick={handleClick}
        >
            <h2 className="text">
                <b className="text | bold">Pago hecho:</b> {content.data.amount}{" "}
                {content.data.currency}
            </h2>
            {content.data.newDebt && (
                <h4 className="text">
                    <b className="text | bold">Nueva dueda:</b>
                    {content.data.newDebt.amount}{" "}
                    {content.data.newDebt.currency}
                </h4>
            )}
            {content.data.note && !isNullOrEmptyText(content.data.note) && (
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
            {content.data.transactionNumber}
            <small className="text | light">
                {timestampDateInSpanish(content.data.date)}
            </small>
        </div>
    );
};

export default EnterprisePaidDebtCard;
