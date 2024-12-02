import Xmark from "@/icons/Xmark";

const Popup = ({
    isOpen,
    close,
    children,
}: {
    isOpen: boolean;
    close: () => void;
    children: React.ReactNode;
}) => {
    return (
        isOpen && (
            <div className="overall | child-center">
                <div className="popup-wrapper">
                    <button
                        onClick={close}
                        className="popup-close-button text circle red | icon-wrapper red-icon margin-bottom-15"
                    >
                        Cerrar <Xmark />
                    </button>
                    {children}
                </div>
            </div>
        )
    );
};

export default Popup;
