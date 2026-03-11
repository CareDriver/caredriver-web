import { Enterprise } from "@/interfaces/Enterprise";
import ImageRenderer from "../../../../form/view/field_renderers/ImageRenderer";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";
import Whatsapp from "@/icons/Whatsapp";
import { sendWhatsapp } from "@/utils/senders/Sender";
import { greeting } from "@/utils/senders/Greeter";
import { ServicesRender } from "@/interfaces/Services";
import MapMarkRenderer from "@/components/form/view/field_renderers/MapMarkRenderer";

const EnterpriseRendererForContact = ({
  enterprise,
}: {
  enterprise: Enterprise;
}) => {
  const sendMenssage = (enterprisePhone: string) => {
    let message = "💼"
      .concat(greeting())
      .concat(`, quisiera trabajar como ${ServicesRender[enterprise.type]}`);
    sendWhatsapp(enterprisePhone, message);
  };

  return (
    <div className="form-sub-container">
      <h3 className="text | big bold capitalize">{enterprise.name}</h3>
      {enterprise.phone && (
        <button
          type="button"
          onClick={() => enterprise.phone && sendMenssage(enterprise.phone)}
          className="icon-wrapper text general-button | bold mb"
        >
          <Whatsapp /> Enviar mensaje
        </button>
      )}
      <ImageRenderer
        imageInCircle={true}
        content={{
          image: enterprise.logoImgUrl,
          legend: `Logo ${
            ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[enterprise.type]
          }`,
        }}
      />
      <TextFieldRenderer
        content={enterprise.location}
        legend={`Ubicación ${
          ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[enterprise.type]
        }`}
      />
      {enterprise.coordinates && (
        <fieldset className="form-section">
          <span className="text | bold">
            Ubicación geográfica{" "}
            {
              ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                enterprise.type
              ]
            }
          </span>
          <MapMarkRenderer location={enterprise.coordinates} />
        </fieldset>
      )}
    </div>
  );
};

export default EnterpriseRendererForContact;
