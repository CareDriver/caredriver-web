import MoneyBillWave from "@/icons/MoneyBillWave";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";

const SericeDonePrice = ({ service }: { service: ServiceRequestInterface }) => {
    const getMethod = (method: string) => {
        if (method === "cash") {
            return "Efectivo";
        } else {
            return "QR";
        }
    };

    return (
        service.price &&
        ((service.price.price && service.price.currency) || service.price.method) && (
            <div className="margin-bottom-50 | max-width-80">
                <h2 className="text icon-wrapper | big-medium-v4 bold nb margin-bottom-15">
                    <MoneyBillWave /> Precio
                </h2>

                <div className="column-wrapper">
                    {service.price.price && service.price.currency && (
                        <span className="text | medium-big">
                            {service.price.price} {service.price.currency}
                        </span>
                    )}
                    {service.price.method && (
                        <span className="text | medium-big">
                            <b>Metodo de pago: </b>
                            {getMethod(service.price.method)}
                        </span>
                    )}
                </div>
            </div>
        )
    );
};

export default SericeDonePrice;
