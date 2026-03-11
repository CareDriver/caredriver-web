"use client";

import { AuthContext } from "@/context/AuthContext";
import CircleCheck from "@/icons/CircleCheck";
import MoneyBillWave from "@/icons/MoneyBillWave";
import Whatsapp from "@/icons/Whatsapp";
import { Enterprise } from "@/interfaces/Enterprise";
import { UserRole } from "@/interfaces/UserInterface";
import { NAME_BUSINESS, PHONE_BUSINESS } from "@/models/Business";
import { greeting } from "@/utils/senders/Greeter";
import { sendWhatsapp } from "@/utils/senders/Sender";
import { useContext } from "react";
import { isTheEnterpriseOwner } from "../../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import DataLoadingWithIcon from "@/components/loaders/DataLoadingWithIcon";

interface Props {
  enterprise: Enterprise;
}

const CurrentEnterpriseDebt: React.FC<Props> = ({ enterprise }) => {
  const { user } = useContext(AuthContext);

  if (!enterprise.currentDebt || enterprise?.currentDebt?.amount <= 0) {
    return (
      <section className="margin-top-25">
        <h2 className="text | big-medium-v3 green-light bold | icon-wrapper lb green-light-icon">
          <CircleCheck /> Deuda pagada
        </h2>
        <p className="text | ligth">No hay deuda pendiente por pagar</p>
      </section>
    );
  }

  const sendRequestWhatsappMessage = (): void => {
    if (!enterprise.currentDebt) {
      return;
    }

    let message = greeting()
      .concat(" Quiero solicitar el pago pendiende de ")
      .concat(
        `${enterprise.currentDebt.amount} ${enterprise.currentDebt.currency}`,
      )
      .concat(`, para mi empresa ${enterprise.name}`);
    sendWhatsapp(PHONE_BUSINESS, message);
  };

  if (!user) {
    return <DataLoadingWithIcon />;
  }

  return (
    <section className="margin-top-25">
      <h2 className="text | big-medium-v3 red bold | icon-wrapper red-icon lb">
        <MoneyBillWave />
        Deuda actual
      </h2>
      <h3 className="text | big-medium-v4 green bold">
        {enterprise.currentDebt.amount} {enterprise.currentDebt.currency}
      </h3>
      {(user?.role === UserRole.User ||
        isTheEnterpriseOwner(user, enterprise)) && (
        <>
          <button
            className="small-general-button icon-wrapper lb | margin-top-25"
            onClick={sendRequestWhatsappMessage}
          >
            <Whatsapp />
            <span className="text">Solicitar Pago</span>
          </button>
          <p className="text | small light | margin-top-5">
            Comunicate con {NAME_BUSINESS} y solicita el pago de la deuda
          </p>
        </>
      )}
    </section>
  );
};

export default CurrentEnterpriseDebt;
