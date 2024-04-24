import AddressCar from "@/icons/AddressCar";
import { LicenseInterface } from "@/interfaces/PersonalDocumentsInterface";
import InputData from "../InputData";
import InpurDate from "../InpurDate";
import ImageRenderer from "../ImageRenderer";
import { getUrl } from "@/utils/validator/ImageValidator";

const LicenseRenderer = ({ license }: { license: LicenseInterface }) => {
    return (
        <div>
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                    <AddressCar /> Licencia
                </h2>
                <p>
                    Verifica que las fotos de la licencia de conducir sean correctas,
                    porque se eliminaran cuando se acepte o rechaze la solicitud.
                </p>
                <InputData
                    content={license.licenseNumber}
                    placeholder="Numero de la licencia"
                />
                <InpurDate date={license.expiredDateLicense.toDate()} />
                {license.frontImgUrl && (
                    <ImageRenderer
                        url={getUrl(license.frontImgUrl.url)}
                        isCircle={false}
                        placeholder={undefined}
                        noFoundDescr={undefined}
                    />
                )}
                {license.backImgUrl && (
                    <ImageRenderer
                        url={getUrl(license.backImgUrl.url)}
                        isCircle={false}
                        placeholder={undefined}
                        noFoundDescr={undefined}
                    />
                )}
            </div>
        </div>
    );
};

export default LicenseRenderer;
