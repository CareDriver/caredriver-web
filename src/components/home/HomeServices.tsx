import CarSide from "@/icons/CarSide";
import Soap from "@/icons/Soap";
import Truck from "@/icons/Truck";
import Wrench from "@/icons/Wrench";
import { DRIVER_PLURAL } from "@/models/Business";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import HomeRedirector from "./HomeRedirector";

const HomeServices = () => {
    return (
        <div className="home-services row-wrapper gap-20 row-responsive | center margin-bottom-25">
            <h3 className="home-service | text | white bold  | icon-wrapper green-light-icon lb">
                <CarSide />
                {toCapitalize(DRIVER_PLURAL)}
            </h3>

            <h3 className="home-service | text | white bold  | icon-wrapper green-light-icon">
                <Soap />
                Lavaderos
            </h3>
            <h3 className="home-service | text | white bold | icon-wrapper green-light-icon">
                <Wrench />
                Mecánicos
            </h3>
            <h3 className="home-service | text | white bold  | icon-wrapper green-light-icon lb">
                <Truck />
                Operadores de Grúa
            </h3>
            <HomeRedirector extraClasses={["home-action-button-responsive"]} />
        </div>
    );
};

export default HomeServices;
