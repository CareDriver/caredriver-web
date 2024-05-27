import React, { SyntheticEvent } from "react";
import CancelAndDoSomething from "./CancelAndDoSomething";
import "@/styles/modules/popup.css";

const PopupForm = ({
    isOpen,
    close,
    onSummit,
    doSomethingText,
    children,
    loading,
    isSecondButtonAble,
}: {
    isOpen: boolean;
    close: () => void;
    onSummit: (e: SyntheticEvent) => Promise<void>;
    doSomethingText: string;
    children: React.ReactNode;
    loading: boolean;
    isSecondButtonAble: boolean;
}) => {
    return (
        isOpen && (
            <div className="overall | child-center">
                <div className="popup-wrapper">
                    {children}
                    <CancelAndDoSomething
                        onCancel={close}
                        onDoSomething={onSummit}
                        loading={loading}
                        doSomethingText={doSomethingText}
                        isSecondButtonAble={isSecondButtonAble}
                    />
                </div>
            </div>
        )
    );
};

export default PopupForm;
