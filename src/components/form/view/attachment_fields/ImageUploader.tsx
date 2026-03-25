"use client";
import Trash from "@/icons/Trash";
import React, { useRef, useState } from "react";
import FileImage from "@/icons/FileImage";
import { AttachmentField } from "../../models/FormFields";
import { AttachmentFieldSetter } from "../../models/FieldSetters";
import Image from "next/image";

const cropToSquare = (base64: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64);
        return;
      }
      const ox = (img.width - size) / 2;
      const oy = (img.height - size) / 2;
      ctx.drawImage(img, ox, oy, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });

interface Props {
  uploader: {
    image: AttachmentField;
    setImage: AttachmentFieldSetter;
  };
  content: {
    id: string;
    legend: string;
    imageInCircle: boolean;
  };
}

const ImageUploader: React.FC<Props> = ({ uploader, content }) => {
  const [draggingOver, setDraggingOver] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      value: undefined,
      message: "Necesitas subir una imagen",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      if (file.size > 2048 * 2048) {
        uploader.setImage({
          ...uploader.image,
          message:
            "La imagen es demasiado grande. Por favor, sube una imagen menor a 2MB.",
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
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const imageData = content.imageInCircle
            ? await cropToSquare(reader.result)
            : reader.result;
          uploader.setImage({
            value: imageData,
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
        ref={fileInputRef}
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
        <div
          className={`form-section-uploaded ${
            content.imageInCircle && "circle"
          }`}
        >
          <img
            src={uploader.image.value}
            alt="preview"
            className="form-section-uploaded-image"
            style={
              content.imageInCircle
                ? { objectFit: "cover", borderRadius: "50%" }
                : {}
            }
          />
          <button
            onClick={removeImage}
            type="button"
            className="form-section-uploaded-button"
          >
            <Trash />
          </button>
          <legend className="form-section-legend | focused">
            {content.legend}
          </legend>
        </div>
      ) : (
        <label htmlFor={content.id}>
          <div
            className={`form-section-uploader icon-wrapper | column bg center ${
              draggingOver && "uploading"
            }`}
          >
            <FileImage />
            <span className="text | normal green | margin-top-15">
              Subir Imagen
            </span>
            <p className="text | medium-big bold green">{content.legend}</p>
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
