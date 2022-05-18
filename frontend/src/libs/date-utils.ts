export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function convertToLocalDate(date: Date): Date {
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
    return localDate;
}
