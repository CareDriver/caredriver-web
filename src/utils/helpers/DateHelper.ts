import { Timestamp } from "firebase/firestore";

export function timestampDateInSpanish(dateTimestamp: Timestamp): string {
    let date = dateTimestamp.toDate();
    const day: number = date.getDate();
    const month: number = date.getMonth(); // getMonth ya devuelve el mes correcto para indexar
    const year: number = date.getFullYear();

    // Array con los nombres de los meses en español
    const monthsInSpanish: string[] = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const formatDay: string = day < 10 ? "0" + day : day.toString();
    const formatMonth: string = monthsInSpanish[month]; // Obtener el mes en español

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
    const fechaActualTimestamp: number = fechaActual.getTime();
    const fechaTimestamp: number = fecha.getTime();
    const diferenciaEnMilisegundos: number =
        fechaTimestamp - fechaActualTimestamp;
    const unDiaEnMilisegundos: number = 1000 * 60 * 60 * 24;
    const diferenciaEnDias: number = Math.round(
        diferenciaEnMilisegundos / unDiaEnMilisegundos,
    );

    return diferenciaEnDias;
};

export const getOneMonthAhead = (date = new Date()): Date => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    newDate.setDate(Math.min(newDate.getDate(), date.getDate()));
    return newDate;
};
