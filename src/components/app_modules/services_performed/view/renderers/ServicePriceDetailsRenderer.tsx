import MoneyBillWave from "@/icons/MoneyBillWave";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";

const ServicePriceDetailsRenderer = ({
  service,
}: {
  service: ServiceRequestInterface;
}) => {
  const getMethod = (method: string) => {
    if (method === "cash") {
      return "Efectivo";
    } else {
      return "QR";
    }
  };

  return (
    service.price &&
    ((service.price.price && service.price.currency) ||
      service.price.amount) && (
      <>
        <div className="max-width-50 margin-bottom-15">
          <div className="separator-horizontal"></div>
        </div>
        <div className="max-width-80">
          <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
            <MoneyBillWave /> Detalles del pago
          </h2>

          <div className="column-wrapper">
            {service.price.amount && service.price.currency && (
              <span className="text">
                <b>Cantidad: </b>
                {service.price.amount} {service.price.currency}
              </span>
            )}
            {service.price.method && (
              <span className="text">
                <b>Método de pago: </b>
                {getMethod(service.price.method)}
              </span>
            )}
          </div>
        </div>
        <div className="max-width-50 margin-top-15 margin-bottom-15">
          <div className="separator-horizontal"></div>
        </div>
      </>
    )
  );
};

export default ServicePriceDetailsRenderer;
