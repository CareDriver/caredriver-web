"use client";
import React, { useState } from "react";

interface ImageUploaderProps {
    uploader: UploaderProps;
    content: DragAndDropContent;
}

interface UploaderProps {
    image: string | null;
    setImage: ImageSetter;
}

type ImageSetter = (image: string | null) => void;

interface DragAndDropContent {
    indicator: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploader, content }) => {
    const [draggingOver, setDraggingOver] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert(
                    "La imagen es demasiado grande. Por favor, sube una imagen menor a 1MB.",
                );
                return;
            }

            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
            if (!allowedExtensions.includes(fileExtension)) {
                alert(
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
            alert("Por favor, sube solo imágenes.");
        }
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
    };

    return (
        <div
            style={{
                border: `2px dashed ${draggingOver ? "blue" : "#ccc"}`,
                position: "relative",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
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
                <div>
                    <img src={uploader.image} alt="preview" />
                    <button onClick={removeImage}>Eliminar</button>
                </div>
            ) : (
                <div>
                    <span>Subir Foto</span>
                    <p>{content.indicator}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
