"use client";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import { getUrl } from "@/validators/ImageValidator";
import FieldDeleted from "./FieldDeleted";
import Popup from "@/components/modules/Popup";
import { useState } from "react";
import { isNullOrEmptyText } from "@/validators/TextValidator";

interface Props {
    content: {
        image: string | RefAttachment | undefined;
        legend?: string;
        noFoundReason?: string;
        defaultImage?: string;
    };
    imageInCircle: boolean;
}

const ImageRenderer: React.FC<Props> = ({ content, imageInCircle }) => {
    const [isOpen, setOpen] = useState(false);
    const NO_FOUND_DESCR =
        content.noFoundReason === undefined
            ? "No se encontró la imagen, es probable que haya sido eliminada"
            : content.noFoundReason;
    var imageUrl = content.image ? getUrl(content.image) : undefined;

    if (!content.defaultImage && (!imageUrl || isNullOrEmptyText(imageUrl))) {
        return <FieldDeleted description={NO_FOUND_DESCR} />;
    }

    if (content.defaultImage && (!imageUrl || isNullOrEmptyText(imageUrl))) {
        imageUrl = content.defaultImage;
    }

    return (
        <>
            <div
                className="form-section | zoom-in"
                onClick={() => setOpen(true)}
            >
                <div
                    className={`form-section-uploaded ${
                        imageInCircle && "circle"
                    }`}
                >
                    <img
                        src={imageUrl}
                        alt={NO_FOUND_DESCR}
                        className="form-section-uploaded-image"
                    />
                    <legend className="form-section-legend | focused">
                        {content.legend}
                    </legend>
                </div>
            </div>
            <Popup close={() => setOpen(false)} isOpen={isOpen}>
                <img
                    src={imageUrl}
                    alt={NO_FOUND_DESCR}
                    className="form-section-uploaded-image | margin-top-25 popup-image"
                />
            </Popup>
        </>
    );
};

export default ImageRenderer;
