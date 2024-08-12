import { FormEvent } from "react";
import { ButtonFormProps } from "../../models/Buttons";
import ButtonForm from "../buttons/ButtonForm";

interface Props {
    content: {
        button: ButtonFormProps;
    };
    behavior: {
        loading: boolean;
        onSummit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    };
    children: React.ReactNode;
}

const BaseForm: React.FC<Props> = ({ content, behavior, children }) => {
    return (
        <form
            className="form-sub-container"
            data-state={behavior.loading ? "loading" : "loaded"}
            onSubmit={behavior.onSummit}
        >
            <>{children}</>
            <ButtonForm
                content={content.button.content}
                behavior={content.button.behavior}
            />
        </form>
    );
};

export default BaseForm;
