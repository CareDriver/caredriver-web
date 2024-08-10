"use client";
import Popup from "@/components/modules/Popup";
import PageLoader from "@/components/PageLoader";
import EnterpriseFetcher from "@/components/requests/data_renderer/enterprise/EnterpriseFetcher";
import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";
import { AuthContext } from "@/context/AuthContext";
import SackDollar from "@/icons/SackDollar";
import { Enterprise } from "@/interfaces/Enterprise";
import { useContext, useState } from "react";
import "@/styles/modules/popup.css";

const MechanicPanel = () => {
    const { user, loadingUser } = useContext(AuthContext);

    const [enteprise, setEnterprise] = useState<Enterprise | undefined | null>(null);
    const [isLookingEnterprise, setLookingEnterprise] = useState(false);

    const renderButtonEnterprise = () => {
        if (
            user.data !== null &&
            user.data.mechanicalWorkShopId !== undefined &&
            user.data.mechanicalWorkShopId.trim().length > 0
        ) {
            var entepriseId: string = user.data.mechanicalWorkShopId;
            return (
                <>
                    <button
                        className="small-general-button text | bold | margin-top-25 margin-bottom-25"
                        type="button"
                        onClick={() => setLookingEnterprise(true)}
                    >
                        Ver taller mecanico asociada
                    </button>
                    <div className="separator-horizontal"></div>
                    <Popup
                        isOpen={isLookingEnterprise}
                        close={() => setLookingEnterprise(false)}
                    >
                        <div>
                            <h2 className="text | bolder big-medium">
                                Taller mecanico donde trabajas
                            </h2>
                            <EnterpriseFetcher
                                enterprise={enteprise}
                                setEnterprise={setEnterprise}
                                enterpriseId={entepriseId}
                                type="mechanic"
                            />
                        </div>
                    </Popup>
                </>
            );
        } else {
            return (
                <div className="margin-top-25">
                    <div className="max-width-60">
                        <FieldDeleted description="No estas asociado a ningun taller mecanico." />
                        <div className="margin-top-50"></div>
                    </div>
                </div>
            );
        }
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <div className="service-form-wrapper | max-height-100">
            <h1 className="text | big bolder green">Tu solicitud fue aprobada!</h1>
            <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                <SackDollar />
                Ve a nuestra Aplicación Móvil y empieza a Ofrecer tu servicio!
            </p>
            {renderButtonEnterprise()}
            <span className="circles-right-bottomv2 green"></span>
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default MechanicPanel;
