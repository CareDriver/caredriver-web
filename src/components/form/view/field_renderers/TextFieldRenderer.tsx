interface Props {
    content: string | undefined | null;
    legend: string;
}

const TextFieldRenderer: React.FC<Props> = ({ content, legend }) => {
    return (
        content && (
            <fieldset className="form-section">
                <span className="form-section-input">{content}</span>
                <legend className="form-section-legend">{legend}</legend>
            </fieldset>
        )
    );
};

export default TextFieldRenderer;
