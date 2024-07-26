import { SyntheticEvent } from "react";

const CancelAndDoSomething = ({
    onCancel,
    onDoSomething,
    loading,
    doSomethingText,
    isSecondButtonAble,
}: {
    onCancel: () => void;
    onDoSomething: (e: SyntheticEvent) => Promise<void>;
    loading: boolean;
    doSomethingText: string;
    isSecondButtonAble: boolean;
}) => {
    const execute = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading) {
            var button = e.target as HTMLButtonElement;
            const text = button.innerHTML;
            button.innerHTML = "";
            button.classList.add("loading-section");
            var loader = document.createElement("span");
            loader.classList.add("loader");
            button.appendChild(loader);
    
            if (button.name === "button_1") {
                loader.classList.add("loader-black");
                await onCancel();
            } else {
                await onDoSomething(e);
            }
            if (includeChild(button, loader)) {
                button.removeChild(loader);
            }
            button.innerHTML = text;
            button.classList.remove("loading-section");
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
        <div
            className="row-wrapper | gap-20 | margin-top-15 loading-section"
            data-state={loading ? "loading" : "loaded"}
        >
            <button
                className="icon-wrapper general-button | center touchable gray lb"
                type="button"
                name="button_1"
                onClick={execute}
            >
                Cancelar
            </button>
            <button
                className={`icon-wrapper general-button | center white-icon touchable lb`}
                type="button"
                name="button_2"
                onClick={execute}
                disabled={!isSecondButtonAble}
            >
                {doSomethingText}
            </button>
        </div>
    );
};

export default CancelAndDoSomething;
