"use client";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { ImgWithRef } from "@/interfaces/ImageInterface";
import { getUrl } from "@/utils/validator/ImageValidator";
import { useEffect, useState } from "react";
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
            ? "Esta imagen fue eliminada despues de ser revisada por las politicas de la aplicacion"
            : noFoundDescr;
    const imageUrl = getUrl(url);

    const imageExists = imageUrl !== ""

    return imageExists ? (
        <div className={`form-section-uploaded ${isCircle && "circle"}`}>
            <img
                src={imageUrl}
                alt={NO_FOUND_DESCR}
                className="form-section-uploaded-image"
            />
        </div>
    ) : (
        <div className="icon-wrapper | lb">
            <TriangleExclamation />
            <p>{NO_FOUND_DESCR}</p>
        </div>
    );
};

export default ImageRenderer;
