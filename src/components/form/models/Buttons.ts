export interface ExecutableButtonProps {
    content: {
        legend: string;
        buttonClassStyle?: string;
        loaderClassStyle?: string;
    };
    behavior: {
        loading: boolean;
        isValid?: boolean;
        action: () => Promise<void>;
        setLoading: (b: boolean) => void;
    };
}

export interface ButtonFormProps {
    content: {
        legend: string;
        buttonClassStyle?: string;
        loaderClassStyle?: string;
    };
    behavior: {
        isValid: boolean;
        loading: boolean;
    };
}
