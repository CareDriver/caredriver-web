import { SyntheticEvent } from "react";
import { ExecutableButtonProps } from "../../models/Buttons";

const ExecutableButton: React.FC<ExecutableButtonProps> = ({
  content,
  behavior,
}) => {
  const BUTTON_STYLE = content.buttonClassStyle
    ? content.buttonClassStyle
    : "general-button";
  const LOADER_STYLE = content.loaderClassStyle
    ? content.loaderClassStyle
    : "loader";

  const execute = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!behavior.loading) {
      behavior.setLoading(true);
      var button = e.target as HTMLButtonElement;
      const text = button.innerHTML;
      button.innerHTML = "";
      button.classList.add("loading-section");
      var loader = document.createElement("span");
      loader.classList.add(LOADER_STYLE);
      button.appendChild(loader);
      await behavior.action();
      button.innerHTML = text;
      button.classList.remove("loading-section");
      behavior.setLoading(false);
    }
  };

  const includeChild = (button: HTMLButtonElement, child: HTMLElement) => {
    for (let i = 0; i < button.children.length; i++) {
      const element = button.children[i];
      if (element === child) {
        return true;
      }
    }

    return false;
  };

  return (
    <button
      className={`icon-wrapper | center touchable lb | ${BUTTON_STYLE}`}
      type="button"
      onClick={execute}
      disabled={behavior.isValid === false}
    >
      {content.legend}
    </button>
  );
};

export default ExecutableButton;
