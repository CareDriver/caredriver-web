"use client";
import FileArrowUp from "@/icons/FileArrowUp";
import Trash from "@/icons/Trash";
import React, { useState } from "react";

interface PDFUploaderProps {
    uploader: UploaderProps;
    content: DragAndDropContent;
}

interface UploaderProps {
    file: PDFField;
    setFile: FileSetter;
}

export type FileSetter = (data: PDFField) => void;

export interface PDFField {
    value: string | null;
    message: string | null;
}

interface DragAndDropContent {
    id: string;
    indicator: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ uploader, content }) => {
    const [draggingOver, setDraggingOver] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOver(false);
        handleFileUpload(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOver(true);
    };

    const handleDragLeave = () => {
        setDraggingOver(false);
    };

    const removeFile = () => {
        uploader.setFile({
            value: null,
            message: "Necesitas subir un archivo PDF",
        });
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        uploader.setFile({
            ...uploader.file,
            message: null,
        });
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB size limit
                uploader.setFile({
                    ...uploader.file,
                    message:
                        "El archivo es demasiado grande. Por favor, sube un archivo menor a 5MB.",
                });
                return;
            }

            const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
            if (fileExtension !== "pdf") {
                uploader.setFile({
                    ...uploader.file,
                    message:
                        "Tipo de archivo no permitido. Por favor, sube un archivo PDF.",
                });
                return;
            }

            setUploading(true);

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    uploader.setFile({
                        value: reader.result,
                        message: null,
                    });
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } else {
            uploader.setFile({
                ...uploader.file,
                message: "Por favor, sube solo archivos PDF.",
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
                accept="application/pdf"
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
            {uploader.file.value ? (
                <div className="form-section-uploaded">
                    <iframe
                        src={uploader.file.value}
                        className="form-section-uploaded-file-pdf"
                    ></iframe>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="form-section-uploaded-button"
                    >
                        <Trash />
                    </button>
                    <legend className="form-section-legend | focused">
                        {content.indicator}
                    </legend>
                </div>
            ) : (
                <label htmlFor={content.id}>
                    <div
                        className={`form-section-uploader icon-wrapper | column bg center ${
                            draggingOver && "uploading"
                        }`}
                    >
                        <FileArrowUp />
                        <span className="text | normal gray-dark | margin-top-15">
                            Subir PDF
                        </span>
                        <p className="text | medium-big bold gray-dark">
                            {content.indicator}
                        </p>
                    </div>
                </label>
            )}
            {uploader.file.message && (
                <small className="form-section-message">{uploader.file.message}</small>
            )}
        </div>
    );
};

export default PDFUploader;
