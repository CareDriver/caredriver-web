"use client";

import EnterpriseFetcher from "@/components/app_modules/requests/data_renderer/enterprise/EnterpriseFetcher";
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

const ENTRendererAsPopup: React.FC<Props> = ({ enterpriseId }) => {
    const [enteprise, setEnterprise] = useState<EnterpriseState>({
        data: null,
        isBeingReviewed: false,
    });

    if (!enterpriseId) {
        return (
            <div className="max-width-60">
                <h4 className="text | light">Sin asociacion a una empresa</h4>
                <div className="margin-top-50"></div>
            </div>
        );
    }

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
            <div className="separator-horizontal"></div>
            <Popup
                isOpen={enteprise.isBeingReviewed}
                close={() =>
                    setEnterprise((prev) => ({
                        ...prev,
                        isBeingReviewed: false,
                    }))
                }
            >
                <div>
                    <h2 className="text | bolder big-medium">
                        Empresa asociada
                    </h2>
                    <EnterpriseFetcher
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

export default ENTRendererAsPopup;
