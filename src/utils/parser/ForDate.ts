export const inputToDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    return strToDate(dateString);
};

export const toformatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const strToDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    return selectedDate;
};

export const getFormatDate = (fecha: Date): string => {
    const day: number = fecha.getDate();
    const mothn: number = fecha.getMonth() + 1;
    const year: number = fecha.getFullYear();

    const formatDay: string = day < 10 ? "0" + day : day.toString();
    const formatMoth: string = mothn < 10 ? "0" + mothn : mothn.toString();

    return `${formatDay}/${formatMoth}/${year}`;
};

export const differenceOnDays = (fecha: Date): number => {
    const fechaActual: Date = new Date();
    const fechaActualTimestamp: number = fechaActual.getTime();
    const fechaTimestamp: number = fecha.getTime();
    const diferenciaEnMilisegundos: number = fechaTimestamp - fechaActualTimestamp;
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
