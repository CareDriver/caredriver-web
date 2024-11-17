"use client";

import EnterpriseRendererWithLoader from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererWithLoader";
import Popup from "@/components/modules/Popup";
import { Enterprise } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";
import { useState } from "react";

interface EnterpriseState {
    data: Enterprise | undefined | null;
    isBeingReviewed: boolean;
}

interface Props {
    button?: {
        styleClass?: string;
        legend?: string;
    };
    enterprise: {
        id: string | undefined;
        type: ServiceType;
    };
}

const EnterpriseRendererAsPopup: React.FC<Props> = ({ enterprise, button }) => {
    const [entepriseAsPopup, setEnterpriseAsPopup] = useState<EnterpriseState>({
        data: null,
        isBeingReviewed: false,
    });

    const BUTTON_STYLE =
        button?.styleClass ??
        "small-general-button text | bold | margin-top-25 margin-bottom-25";
    const BUTTON_LEGEND = button?.legend ?? "Ver empresa asociada";

    return (
        <>
            <button
                className={BUTTON_STYLE}
                type="button"
                onClick={() =>
                    setEnterpriseAsPopup((prev) => ({
                        ...prev,
                        isBeingReviewed: true,
                    }))
                }
            >
                {BUTTON_LEGEND}
            </button>
            <Popup
                isOpen={entepriseAsPopup.isBeingReviewed}
                close={() =>
                    setEnterpriseAsPopup((prev) => ({
                        ...prev,
                        isBeingReviewed: false,
                    }))
                }
            >
                <div className="min-width-60">
                    <h2 className="text | bold big">
                        Empresa asociada
                    </h2>
                    <EnterpriseRendererWithLoader
                        enterprise={entepriseAsPopup.data}
                        setEnterprise={(d) =>
                            setEnterpriseAsPopup((prev) => ({
                                ...prev,
                                data: d,
                            }))
                        }
                        enterpriseId={enterprise.id}
                        type={enterprise.type}
                    />
                </div>
            </Popup>
        </>
    );
};

export default EnterpriseRendererAsPopup;
