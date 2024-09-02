"use client";

import EnterpriseRendererWithLoader from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererWithLoader";
import Popup from "@/components/modules/Popup";
import { Enterprise } from "@/interfaces/Enterprise";
import { useState } from "react";

interface EnterpriseState {
    data: Enterprise | undefined | null;
    isBeingReviewed: boolean;
}

interface Props {
    enterpriseId: string | undefined;
}

const EnterpriseRendererAsPopup: React.FC<Props> = ({ enterpriseId }) => {
    const [enteprise, setEnterprise] = useState<EnterpriseState>({
        data: null,
        isBeingReviewed: false,
    });

    return (
        <>
            <button
                className="small-general-button text | bold | margin-top-25 margin-bottom-25"
                type="button"
                onClick={() =>
                    setEnterprise((prev) => ({
                        ...prev,
                        isBeingReviewed: true,
                    }))
                }
            >
                Ver empresa asociada
            </button>
            <Popup
                isOpen={enteprise.isBeingReviewed}
                close={() =>
                    setEnterprise((prev) => ({
                        ...prev,
                        isBeingReviewed: false,
                    }))
                }
            >
                <div className="min-width-60">
                    <h2 className="text | bolder big-medium">
                        Empresa asociada
                    </h2>
                    <EnterpriseRendererWithLoader
                        enterprise={enteprise.data}
                        setEnterprise={(d) =>
                            setEnterprise((prev) => ({
                                ...prev,
                                data: d,
                            }))
                        }
                        enterpriseId={enterpriseId}
                        type="driver"
                    />
                </div>
            </Popup>
        </>
    );
};

export default EnterpriseRendererAsPopup;
