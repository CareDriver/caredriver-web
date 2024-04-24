const InputData = ({
    content,
    placeholder,
}: {
    content: string | undefined;
    placeholder: string | undefined;
}) => {
    return content && <span className="form-section-input">{content}</span>;
};

export default InputData;
