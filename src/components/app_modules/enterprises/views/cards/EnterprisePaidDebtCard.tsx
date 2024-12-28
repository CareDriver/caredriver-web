import { DebtHistory } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
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
            className={`debt-item | left ${style?.extraClassStyle ?? ""}`}
            onClick={handleClick}
        >
            <h2 className="text | big-medium-v4">
                Pago de{" "}
                <b className="text | big-medium-v4 bold green-light">
                    {content.data.amount} {content.data.currency}
                </b>
            </h2>
            {content.data.newDebt && (
                <h4 className="text | medium">
                    Deuda pendiente de{" "}
                    <b
                        className={`text | medium bold ${
                            content.data.newDebt.amount > 0 && "red"
                        }`}
                    >
                        {content.data.newDebt.amount}{" "}
                        {content.data.newDebt.currency}
                    </b>
                </h4>
            )}

            <div className="separator-horizontal"></div>
            {!style?.maxNoteLenght &&
                content.data.note &&
                !isNullOrEmptyText(content.data.note) && (
                    <div className="margin-top-25 wrap">
                        <b className="text | bold">Nota: </b>
                        <i className="text | light">{content.data.note}</i>
                    </div>
                )}
            {!style?.maxNoteLenght && (
                <small className="text | light">
                    <b className="text | bold">Numero de transacción:</b>{" "}
                    {content.data.transactionNumber}
                </small>
            )}
            <small className="text | light">
                {timestampDateInSpanish(content.data.date)}
            </small>
        </div>
    );
};

export default EnterprisePaidDebtCard;
