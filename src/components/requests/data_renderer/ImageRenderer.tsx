import { ImgWithRef } from "@/interfaces/ImageInterface";
import { getUrl } from "@/utils/validator/ImageValidator";
const ImageRenderer = ({
    url,
    placeholder,
    isCircle,
}: {
    url: string | ImgWithRef;
    placeholder: string | undefined;
    isCircle: boolean;
}) => {
    return (
        <div className={`form-section-uploaded ${isCircle && "circle"}`}>
            <img
                src={getUrl(url)}
                alt="preview"
                className="form-section-uploaded-image"
            />
        </div>
    );
};

export default ImageRenderer;
