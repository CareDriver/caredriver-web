import AndroidIcon from "@/icons/AndroidIcon";
import AppleIcon from "@/icons/AppleIcon";
import SackDollar from "@/icons/SackDollar";
import { ServicesRender, ServiceType } from "@/interfaces/Services";
import {
  isAndroid,
  isMac,
  openAppAsAndroid,
  openAppAsMac,
} from "@/utils/redirectors/MobileAppRedirector";

interface Props {
  serviceType: ServiceType;
}

const RedirectorToTheAppAsServerUser: React.FC<Props> = ({ serviceType }) => {
  const renderAndroidButton = () => (
    <button
      className="small-general-button | icon-wrapper lb"
      onClick={openAppAsAndroid}
    >
      <AndroidIcon />
      <span className="text | bold">Ir a la Aplicación</span>
    </button>
  );

  const renderMacButton = () => (
    <button
      className="small-general-button | icon-wrapper lb"
      onClick={openAppAsMac}
    >
      <AppleIcon />
      <span className="text | bold">Ir a la Aplicación</span>
    </button>
  );

  return (
    <div>
      <p className="text icon-wrapper | green-icon green bold lb medium margin-top-15 margin-bottom-15">
        <SackDollar />
        Ya eres {ServicesRender[serviceType]}
        {", "}
        Ve a nuestra Aplicación Móvil y empieza a Ofrecer tu servicio!
      </p>
      {isAndroid() && renderAndroidButton()}
      {isMac() && renderMacButton()}
    </div>
  );
};

export default RedirectorToTheAppAsServerUser;
