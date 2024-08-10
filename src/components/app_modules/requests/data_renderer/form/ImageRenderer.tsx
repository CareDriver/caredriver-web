"use client";
import { ImgWithRef } from "@/interfaces/ImageInterface";
import { getUrl } from "@/utils/validator/ImageValidator";
import FieldDeleted from "./FieldDeleted";
import Popup from "@/components/modules/Popup";
import { useState } from "react";
const ImageRenderer = ({
    url,
    placeholder,
    isCircle,
    noFoundDescr,
}: {
    url: string | ImgWithRef;
    placeholder: string | undefined;
    isCircle: boolean;
    noFoundDescr: string | undefined;
}) => {
    const [isOpen, setOpen] = useState(false);
    const NO_FOUND_DESCR =
        noFoundDescr === undefined
            ? "Esta imagen fue eliminada despues de ser revisada"
            : noFoundDescr;
    const imageUrl = getUrl(url);

    const imageExists = imageUrl !== "";

    return imageExists ? (
        <>
            <div className="form-section | zoom-in" onClick={() => setOpen(true)}>
                <div className={`form-section-uploaded ${isCircle && "circle"}`}>
                    <img
                        src={imageUrl}
                        alt={NO_FOUND_DESCR}
                        className="form-section-uploaded-image"
                    />
                    <legend className="form-section-legend | focused">
                        {placeholder}
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
    ) : (
        <FieldDeleted description={NO_FOUND_DESCR} />
    );
};

export default ImageRenderer;
