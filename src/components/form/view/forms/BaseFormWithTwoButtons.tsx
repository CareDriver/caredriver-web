import { ExecutableButtonProps } from "../../models/Buttons";
import ExecutableButton from "../buttons/ExecutableButton";

interface Props {
  content: {
    firstButton: ExecutableButtonProps;
    secondButton: ExecutableButtonProps;
    styleClasses?: string;
  };
  behavior: {
    loading: boolean;
  };
  children: React.ReactNode;
}

const BaseFormWithTwoButtons: React.FC<Props> = ({
  content,
  behavior,
  children,
}) => {
  return (
    <div
      className={`form-sub-container | margin-top-25 ${
        content.styleClasses && content.styleClasses
      }`}
      data-state={behavior.loading ? "loading" : "loaded"}
    >
      <>{children}</>
      <div
        className="row-wrapper | gap-20 | margin-top-15 loading-section"
        data-state={behavior.loading ? "loading" : "loaded"}
      >
        <ExecutableButton
          content={content.firstButton.content}
          behavior={content.firstButton.behavior}
        />
        <ExecutableButton
          content={content.secondButton.content}
          behavior={content.secondButton.behavior}
        />
      </div>
    </div>
  );
};

export default BaseFormWithTwoButtons;
