import React from "react";
import CancelAndDoSomething from "./CancelAndDoSomething";

const PopupForm = ({
    isOpen,
    close,
    onSummit,
    children,
    loading,
    isSecondButtonAble,
}: {
    isOpen: boolean;
    close: () => void;
    onSummit: () => Promise<void>;
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
                        doSomethingText="Cambiar saldo"
                        isSecondButtonAble={isSecondButtonAble}
                    />
                </div>
            </div>
        )
    );
};

export default PopupForm;
