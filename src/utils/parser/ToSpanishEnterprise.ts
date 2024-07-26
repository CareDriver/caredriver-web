export const getTitleForRender = (type: "mechanical" | "tow" | "laundry" | "driver") => {
    switch (type) {
        case "tow":
            return "Empresas de Grúa Creadas";
        case "mechanical":
            return "Talleres Mecanicos Creados";
        case "driver":
            return "Empresas de Choferes Creadas";
        default:
            return "Lavaderos Creados";
    }
};

export const getRoute = (type: "mechanical" | "tow" | "laundry" | "driver") => {
    switch (type) {
        case "tow":
            return "cranes";
        case "mechanical":
            return "workshops";
        case "driver":
            return "driver";
        default:
            return "laundry";
    }
};

export const getNewButtonTitle = (type: "mechanical" | "tow" | "laundry" | "driver") => {
    switch (type) {
        case "tow":
            return "Nueva Empresa";
        case "mechanical":
            return "Nuevo Taller";
        case "driver":
            return "Nueva Empresa";
        default:
            return "Nuevo Lavadero";
    }
};

export const getEmptyEnterprise = (type: "mechanical" | "tow" | "laundry" | "driver") => {
    switch (type) {
        case "tow":
            return "ninguna empresa de grúa registrada";
        case "mechanical":
            return "ningún taller mecánico registrado";
        case "driver":
            return "ninguna empresa de choferes";
        default:
            return "ningún lavadero registrado";
    }
};
