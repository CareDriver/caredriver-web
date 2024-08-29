import PersonQuestion from "@/icons/PersonQuestion";
import ImageRenderer from "./ImageRenderer";
import { RefAttachment } from "@/components/form/models/RefAttachment";

const SelfieRenderer = ({ image }: { image: string | RefAttachment }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | lb medium-big bold">
                    <PersonQuestion /> Confirmación del usuario
                </h2>
            </div>
            <ImageRenderer
                content={{
                    image: image,
                    legend: "Selfie",
                }}
                imageInCircle={true}
            />
        </div>
    );
};

export default SelfieRenderer;
