export const inputToDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    const [year, month, day] = dateString.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    return selectedDate;
};

export const toformatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};
