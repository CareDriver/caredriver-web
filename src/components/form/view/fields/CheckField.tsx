interface Props {
    marker: {
        isCheck: boolean;
        setCheck: (state: boolean) => void;
    };
    content: {
        checkDescription: string;
    };
}

const CheckField: React.FC<Props> = ({ marker, content }) => {
    return (
        <div
            onClick={() => marker.setCheck(!marker.isCheck)}
            className="form-sub-container | row | margin-top-25 pointer-option"
        >
            <input
                className="form-section-input-checkbox"
                type="checkbox"
                checked={marker.isCheck}
                onChange={() => {}}
            />
            <p>{content.checkDescription}</p>
        </div>
    );
};

export default CheckField;
