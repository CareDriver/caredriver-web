import AddressCar from "@/icons/AddressCar";
import {
    LicenseInterface,
    LicenseUpdateReq,
} from "@/interfaces/PersonalDocumentsInterface";
import InputData from "../form/InputData";
import InpurDate from "../form/InpurDate";
import ImageRenderer from "../form/ImageRenderer";
import { getUrl } from "@/utils/validator/ImageValidator";

const LicenseRenderer = ({
    license,
}: {
    license: LicenseInterface | LicenseUpdateReq;
}) => {
    return (
        <div className="form-sub-container">
            <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                <AddressCar /> Licencia
            </h2>
            <fieldset className="form-section">
                <InputData
                    content={license.licenseNumber}
                    placeholder="número de la licencia"
                />
                <legend className="form-section-legend">Número</legend>
            </fieldset>
            <fieldset className="form-section">
                <InpurDate date={license.expiredDateLicense.toDate()} />
                <legend className="form-section-legend">Fecha de expiración</legend>
            </fieldset>
            {license.frontImgUrl && (
                <fieldset className="form-section">
                    <ImageRenderer
                        url={getUrl(license.frontImgUrl.url)}
                        isCircle={false}
                        placeholder={undefined}
                        noFoundDescr={undefined}
                    />
                    <legend className="form-section-legend | focused">
                        Parte frontal de la licencia
                    </legend>
                </fieldset>
            )}
            {license.backImgUrl && (
                <fieldset className="form-section">
                    <ImageRenderer
                        url={getUrl(license.backImgUrl.url)}
                        isCircle={false}
                        placeholder={undefined}
                        noFoundDescr={undefined}
                    />
                    <legend className="form-section-legend | focused">
                        Parte posteror de la licencia
                    </legend>
                </fieldset>
            )}
        </div>
    );
};

export default LicenseRenderer;
