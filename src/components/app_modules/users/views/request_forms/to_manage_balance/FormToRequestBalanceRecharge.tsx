import { PHONE_BUSINESS } from "@/models/Business";
import MoneyBillWave from "@/icons/MoneyBillWave";
import { UserInterface } from "@/interfaces/UserInterface";
import { greeting } from "@/utils/senders/Greeter";
import { sendWhatsapp } from "@/utils/senders/Sender";

interface Props {
    user: UserInterface;
}

const FormToRequestBalanceRecharge: React.FC<Props> = ({ user }) => {
    const sendMessageForBalancerecharge = () => {
        const message = greeting()
            .concat(`Soy ${user?.fullName}, `)
            .concat(", quiero recargar saldo por favor 💰💵");

        sendWhatsapp(PHONE_BUSINESS, message);
    };

    return (
        <section className="profile-info-wrapper | margin-top-25 max-width-60">
            <h2 className="profile-subtitle icon-wrapper">
                <MoneyBillWave />
                Saldo |{" "}
                {user.balance
                    ? user.balance.amount + " " + user.balance.currency
                    : "0"}
            </h2>
            <p className="text | gray-dark">
                {user.balance &&
                user.balance.amount <= user.minimumBalance.amount
                    ? "Tienes que recargar tu salso, sino no podrás seguir usando nuestra aplicación para ofrecer tus servicios. Haz click para enviar un mensaje a nuestro administrador para recargar saldo."
                    : `Recarga saldo cuando lo necesites, tu saldo mínimo no puede ser menos de ${user.minimumBalance.amount
                          .toString()
                          .replace("-", "")} ${user.minimumBalance.currency}`}
            </p>
            {
                <div className="margin-top-5">
                    <button
                        type="button"
                        onClick={sendMessageForBalancerecharge}
                        className="small-general-button text | medium bold touchable 
yellow"
                    >
                        Recargar saldo
                    </button>
                </div>
            }
        </section>
    );
};

export default FormToRequestBalanceRecharge;
