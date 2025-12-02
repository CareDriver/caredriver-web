import { ExecutableButtonProps } from "../../models/Buttons";
import ExecutableButton from "../buttons/ExecutableButton";

interface Props {
  content: {
    button: ExecutableButtonProps;
    styleClasses?: string;
  };
  behavior: {
    loading: boolean;
  };
  children: React.ReactNode;
}

const BaseSubForm: React.FC<Props> = ({ content, behavior, children }) => {
  return (
    <div
      className={`form-sub-container | margin-top-25 ${
        content.styleClasses && content.styleClasses
      }`}
      data-state={behavior.loading ? "loading" : "loaded"}
    >
      <>{children}</>
      <ExecutableButton
        content={content.button.content}
        behavior={content.button.behavior}
      />
    </div>
  );
};

export default BaseSubForm;
