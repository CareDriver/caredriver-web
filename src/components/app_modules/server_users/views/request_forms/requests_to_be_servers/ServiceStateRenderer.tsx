"use client";

import { useEffect } from "react";
import { HandleableServiceStatus } from "../../../api/requests_status_handler/HandleableServiceStatus";

interface Props {
    statusHandler: HandleableServiceStatus;
}

const ServiceStateRenderer: React.FC<Props> = ({ statusHandler }) => {
    const feedBack = statusHandler.getStatusFeedback();

    useEffect(() => {
        statusHandler.updateRefuseState();
    }, []);

    return (
        <div className="margin-bottom-25">
            <h1
                className={`text | big bold max-width-90 ${
                    statusHandler.hasSomeRefusedRequest() && "red"
                }`}
            >
                {feedBack.title}
            </h1>
            <p className="text | light">{feedBack.description}</p>
        </div>
    );
};

export default ServiceStateRenderer;
