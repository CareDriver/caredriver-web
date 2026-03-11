import { ButtonFormProps } from "../../models/Buttons";

const ButtonForm: React.FC<ButtonFormProps> = ({ content, behavior }) => {
  const BUTTON_STYLE = content.buttonClassStyle
    ? content.buttonClassStyle
    : "general-button";
  const LOADER_STYLE = content.loaderClassStyle
    ? content.loaderClassStyle
    : "loader-green";

  return (
    <button
      className={`${BUTTON_STYLE} | margin-top-15 touchable ${
        behavior.loading && "loading-section"
      }`}
      disabled={!behavior.isValid}
    >
      {behavior.loading ? (
        <span className={LOADER_STYLE}></span>
      ) : (
        content.legend
      )}
    </button>
  );
};

export default ButtonForm;
