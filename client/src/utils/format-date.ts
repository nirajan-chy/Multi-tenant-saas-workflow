export const formatDate = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('year')) {
        options.year = 'numeric';
    }
    if (format.includes('month')) {
        options.month = 'long';
    }
    if (format.includes('day')) {
        options.day = 'numeric';
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
};