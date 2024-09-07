import { Timestamp } from "firebase/firestore";

export function timestampDateInSpanish(dateTimestamp: Timestamp): string {
    let date = dateTimestamp.toDate();
    const day: number = date.getDate();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();

    const monthsInSpanish: string[] = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    const formatDay: string = day < 10 ? "0" + day : day.toString();
    const formatMonth: string = monthsInSpanish[month];

    return `${formatDay} de ${formatMonth} de ${year}`;
}

export function timestampDateInSpanishWithHour(
    dateTimestamp: Timestamp,
): string {
    let date = dateTimestamp.toDate();
    const day: number = date.getDate();
    const mothn: number = date.getMonth() + 1;
    const year: number = date.getFullYear();

    const formatDay: string = day < 10 ? "0" + day : day.toString();
    const formatMoth: string = mothn < 10 ? "0" + mothn : mothn.toString();

    return `${formatDay}/${formatMoth}/${year}`;
}

export const differenceOnDays = (fecha: Date): number => {
    const fechaActual: Date = new Date();

    const fechaActualTruncada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    const fechaTruncada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const diferenciaEnMilisegundos: number = fechaTruncada.getTime() - fechaActualTruncada.getTime();
    const unDiaEnMilisegundos: number = 1000 * 60 * 60 * 24;
    const diferenciaEnDias: number = Math.round(diferenciaEnMilisegundos / unDiaEnMilisegundos);

    return diferenciaEnDias;
};


export const getOneMonthAhead = (date = new Date()): Date => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    newDate.setDate(Math.min(newDate.getDate(), date.getDate()));
    return newDate;
};

export const getYesterdayInTimestamp = (): Timestamp => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return Timestamp.fromDate(today);
};
