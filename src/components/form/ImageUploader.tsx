"use client";
import Trash from "@/icons/Trash";
import React, { useState } from "react";
import { PhotoField } from "@/components/services/FormModels";
import FileImage from "@/icons/FileImage";

interface ImageUploaderProps {
    uploader: UploaderProps;
    content: DragAndDropContent;
}

interface UploaderProps {
    image: PhotoField;
    setImage: ImageSetter;
}

export type ImageSetter = (data: PhotoField) => void;

interface DragAndDropContent {
    id: string,
    indicator: string;
    isCircle: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploader, content }) => {
    const [draggingOver, setDraggingOver] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        uploader.setImage({
            ...uploader.image,
            message: null,
        });
        setDraggingOver(false);
        uploadImage(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOver(true);
    };

    const handleDragLeave = () => {
        setDraggingOver(false);
    };

    const removeImage = () => {
        uploader.setImage({
            value: null,
            message: "Necesitas subir una imagen",
        });
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const uploadImage = (file: File) => {
        uploader.setImage({
            ...uploader.image,
            message: null,
        });
        if (file) {
            if (file.size > 1024 * 1024) {
                uploader.setImage({
                    ...uploader.image,
                    message:
                        "La imagen es demasiado grande. Por favor, sube una imagen menor a 1MB.",
                });
                return;
            }

            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
            if (!allowedExtensions.includes(fileExtension)) {
                uploader.setImage({
                    ...uploader.image,
                    message:
                        "Tipo de archivo no permitido. Por favor, sube una imagen con extensión jpg, jpeg o png.",
                });
                return;
            }

            setUploading(true);

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    uploader.setImage({
                        value: reader.result,
                        message: null,
                    });
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } else {
            uploader.setImage({
                ...uploader.image,
                message: "Por favor, sube solo imágenes.",
            });
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="form-section"
        >
            <input
                type="file"
                id={content.id}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
            />
            {uploading && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    Cargando...
                </div>
            )}
            {uploader.image.value ? (
                <div className={`form-section-uploaded ${content.isCircle && "circle"}`}>
                    <img
                        src={uploader.image.value}
                        alt="preview"
                        className="form-section-uploaded-image"
                    />
                    <button
                        onClick={removeImage}
                        type="button"
                        className="form-section-uploaded-button"
                    >
                        <Trash />
                    </button>
                    <legend className="form-section-legend | focused">{content.indicator}</legend>
                </div>
            ) : (
                <label htmlFor={content.id}>
                    <div
                        className={`form-section-uploader icon-wrapper | column bg center ${
                            draggingOver && "uploading"
                        }`}
                    >
                        <FileImage />
                        <span className="text | normal gray-dark | margin-top-15">
                            Subir Imagen
                        </span>
                        <p className="text | medium-big bold gray-dark">
                            {content.indicator}
                        </p>
                    </div>
                </label>
            )}
            {uploader.image.message && (
                <small className="form-section-message">{uploader.image.message}</small>
            )}
        </div>
    );
};

export default ImageUploader;
