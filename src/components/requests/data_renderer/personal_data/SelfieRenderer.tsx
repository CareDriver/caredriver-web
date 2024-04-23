import PersonQuestion from "@/icons/PersonQuestion";
import ImageRenderer from "../ImageRenderer";
import { ImgWithRef } from "@/interfaces/ImageInterface";

const SelfieRenderer = ({ image }: { image: string | ImgWithRef }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <PersonQuestion /> Confirmacion del Usuario
                </h2>
            </div>
            <ImageRenderer url={image} placeholder="Selfie" isCircle={true} />
        </div>
    );
};

export default SelfieRenderer;
