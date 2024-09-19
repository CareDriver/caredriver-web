export enum Locations {
    CochabambaBolivia = "Cochabamba, Bolivia",
    SantaCruzBolivia = "Santa Cruz, Bolivia",
    LaPazBolivia = "La Paz, Bolivia",
    TarijaBolivia = "Tarija, Bolivia",
    ChuquisacaBolivia = "Chuquisaca, Bolivia",
    PotosiBolivia = "Potosí, Bolivia",
    OruroBolivia = "Oruro, Bolivia",
    BeniBolivia = "Beni, Bolivia",
    PandoBolivia = "Pando, Bolivia",
}

export const locationList = [
    Locations.CochabambaBolivia,
    Locations.SantaCruzBolivia,
    Locations.LaPazBolivia,
    Locations.TarijaBolivia,
    Locations.ChuquisacaBolivia,
    Locations.PotosiBolivia,
    Locations.OruroBolivia,
    Locations.BeniBolivia,
    Locations.PandoBolivia,
];

export function abbreviateLocation(location: Locations): string {
    switch (location) {
        case Locations.CochabambaBolivia:
            return "CBB";
        case Locations.SantaCruzBolivia:
            return "SCZ";
        case Locations.LaPazBolivia:
            return "LPB";
        case Locations.TarijaBolivia:
            return "TJA";
        case Locations.ChuquisacaBolivia:
            return "CHU";
        case Locations.PotosiBolivia:
            return "PTS";
        case Locations.OruroBolivia:
            return "ORU";
        case Locations.BeniBolivia:
            return "BEN";
        case Locations.PandoBolivia:
            return "PAN";
        default:
            return "LPB";
    }
}

export function locationFromAbbreviation(
    abbreviation: string,
): Locations | null {
    switch (abbreviation.toUpperCase()) {
        case "CBB":
            return Locations.CochabambaBolivia;
        case "SCZ":
            return Locations.SantaCruzBolivia;
        case "LPB":
            return Locations.LaPazBolivia;
        case "TJA":
            return Locations.TarijaBolivia;
        case "CHU":
            return Locations.ChuquisacaBolivia;
        case "PTS":
            return Locations.PotosiBolivia;
        case "ORU":
            return Locations.OruroBolivia;
        case "BEN":
            return Locations.BeniBolivia;
        case "PAN":
            return Locations.PandoBolivia;
        default:
            return null;
    }
}

export function flagOfLocation(location: Locations): string {
    let path;
    switch (location) {
        case Locations.CochabambaBolivia:
            path = "cochabamba.png";
            break;
        case Locations.BeniBolivia:
            path = "beni.png";
            break;
        case Locations.ChuquisacaBolivia:
            path = "chuquisaca.png";
            break;
        case Locations.LaPazBolivia:
            path = "la-paz.png";
            break;
        case Locations.OruroBolivia:
            path = "oruro.png";
            break;
        case Locations.PandoBolivia:
            path = "pando.png";
            break;
        case Locations.PotosiBolivia:
            path = "potosi.png";
            break;
        case Locations.SantaCruzBolivia:
            path = "santa-cruz.png";
            break;
        case Locations.TarijaBolivia:
            path = "tarija.png";
            break;
        default:
            path = "cochabamba.png";
            break;
    }

    return "/images/".concat(path);
}
