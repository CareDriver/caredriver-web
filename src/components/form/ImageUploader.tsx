"use client";
import Trash from "@/icons/Trash";
import Upload from "@/icons/Upload";
import React, { useState } from "react";

interface ImageUploaderProps {
    uploader: UploaderProps;
    content: DragAndDropContent;
}

interface UploaderProps {
    image: string | null;
    setImage: ImageSetter;
    isCircle: boolean;
}

type ImageSetter = (image: string | null) => void;

interface DragAndDropContent {
    indicator: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploader, content }) => {
    const [draggingOver, setDraggingOver] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setError(null);
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
        uploader.setImage(null);
        setError("Necesitas subir una imagen");
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const uploadImage = (file: File) => {
        setError(null);
        if (file) {
            if (file.size > 1024 * 1024) {
                setError(
                    "La imagen es demasiado grande. Por favor, sube una imagen menor a 1MB.",
                );
                return;
            }

            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
            if (!allowedExtensions.includes(fileExtension)) {
                setError(
                    "Tipo de archivo no permitido. Por favor, sube una imagen con extensión jpg, jpeg o png.",
                );
                return;
            }

            setUploading(true);

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    uploader.setImage(reader.result);
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setError("Por favor, sube solo imágenes.");
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                id="fileInput"
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
            {uploader.image ? (
                <div className={`form-section-uploaded ${uploader.isCircle && "circle"}`}>
                    <img
                        src={uploader.image}
                        alt="preview"
                        className="form-section-uploaded-image"
                    />
                    <button
                        onClick={removeImage}
                        className="form-section-uploaded-button"
                    >
                        <Trash />
                    </button>
                </div>
            ) : (
                <label htmlFor="fileInput">
                    <div
                        className={`form-section-uploader icon-wrapper | column medium center ${
                            draggingOver && "uploading"
                        }`}
                    >
                        <Upload />
                        <span className="text | bold gray-dark | margin-top-15">
                            Subir Foto
                        </span>
                        <p className="text | medium-big bold gray-dark">
                            {content.indicator}
                        </p>
                    </div>
                </label>
            )}
            {error && <small className="form-section-message">{error}</small>}
        </div>
    );
};

export default ImageUploader;
