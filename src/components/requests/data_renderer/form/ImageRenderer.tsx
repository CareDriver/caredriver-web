"use client";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { ImgWithRef } from "@/interfaces/ImageInterface";
import { getUrl } from "@/utils/validator/ImageValidator";
import { useEffect, useState } from "react";
import FieldDeleted from "./FieldDeleted";
import Trash from "@/icons/Trash";
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
    const NO_FOUND_DESCR =
        noFoundDescr === undefined
            ? "Esta imagen fue eliminada despues de ser revisada"
            : noFoundDescr;
    const imageUrl = getUrl(url);

    const imageExists = imageUrl !== "";

    return imageExists ? (
        <div className="form-section">
            <div className={`form-section-uploaded ${isCircle && "circle"}`}>
                <img
                    src={imageUrl}
                    alt={NO_FOUND_DESCR}
                    className="form-section-uploaded-image"
                />
                <legend className="form-section-legend | focused">{placeholder}</legend>
            </div>
        </div>
    ) : (
        <FieldDeleted description={NO_FOUND_DESCR} />
    );
};

export default ImageRenderer;
