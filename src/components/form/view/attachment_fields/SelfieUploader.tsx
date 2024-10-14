"use client";
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import Trash from "@/icons/Trash";
import Camera from "@/icons/Camera";
import { AttachmentField } from "../../models/FormFields";
import { AttachmentFieldSetter } from "../../models/FieldSetters";

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

const SelfieUploader: React.FC<Props> = ({ uploader, content }) => {
    const [cameraOpen, setCameraOpen] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                uploader.setImage({
                    value: imageSrc,
                    message: null,
                });
                setCameraOpen(false);
            }
        }
    };

    const removeImage = () => {
        uploader.setImage({
            value: undefined,
            message: "Necesitas subir una imagen",
        });
    };

    return (
        <div className="form-section">
            {uploader.image.value ? (
                <div className={`form-section-uploaded ${content.imageInCircle && "circle"}`}>
                    <img
                        src={uploader.image.value}
                        alt="preview"
                        className="form-section-uploaded-image"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="form-section-uploaded-button"
                    >
                        <Trash />
                    </button>
                    <legend className="form-section-legend | focused">
                        {content.legend}
                    </legend>
                </div>
            ) : (
                <div
                    className={`form-section-camera-uploader icon-wrapper | column bg center ${
                        cameraOpen && "open-camera"
                    }`}
                >
                    {cameraOpen ? (
                        <div>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                className="video-preview"
                            />
                            <button
                                type="button"
                                onClick={capture}
                                className="icon-wrapper lb form-section-camera-capture-button"
                            >
                                <Camera />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="form-section-camera-button"
                            onClick={() => setCameraOpen(true)}
                        >
                            <span className="icon-wrapper | green-icon bg">
                                <Camera />
                            </span>
                            <span className="text | green | margin-top-15">
                                Subir foto
                            </span>
                            <span className="text | bold medium-big green">
                                {content.legend}
                            </span>
                        </div>
                    )}
                </div>
            )}
            {uploader.image.message && (
                <small className="form-section-message">{uploader.image.message}</small>
            )}
        </div>
    );
};

export default SelfieUploader;
