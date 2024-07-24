export const getTitleForRender = (type: "mechanical" | "tow" | "laundry") => {
    switch (type) {
        case "tow":
            return "Empresas de Grúa Creadas";
        case "mechanical":
            return "Talleres Mecanicos Creados";
        default:
            return "Lavaderos Creados";
    }
};

export const getRoute = (type: "mechanical" | "tow" | "laundry") => {
    switch (type) {
        case "tow":
            return "cranes";
        case "mechanical":
            return "workshops";
        default:
            return "laundry";
    }
};

export const getNewButtonTitle = (type: "mechanical" | "tow" | "laundry") => {
    switch (type) {
        case "tow":
            return "Nueva Empresa";
        case "mechanical":
            return "Nuevo Taller";
        default:
            return "Nuevo Lavadero";
    }
};

export const getEmptyEnterprise = (type: "mechanical" | "tow" | "laundry") => {
    switch (type) {
        case "tow":
            return "ninguna empresa de grúa registrada";
        case "mechanical":
            return "ningún taller mecánico registrado";
        default:
            return "ningún lavadero registrado";
    }
};
