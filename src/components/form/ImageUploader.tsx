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

type ImageSetter = (image : string | null) => void

interface DragAndDropContent {
    indicator: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploader, content }) => {
    const [draggingOver, setDraggingOver] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOver(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    uploader.setImage(reader.result);
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
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
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
