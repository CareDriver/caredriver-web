const ImageRenderer = ({
    url,
    placeholder,
    isCircle,
}: {
    url: string;
    placeholder: string;
    isCircle: boolean;
}) => {
    return (
        <div className={`form-section-uploaded ${isCircle && "circle"}`}>
            <img src={url} alt="preview" className="form-section-uploaded-image" />
        </div>
    );
};

export default ImageRenderer;
