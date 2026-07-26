import { format, formatDistance, formatDistanceToNowStrict, intervalToDuration } from 'date-fns';

declare global {
    interface Date {
        getMonthName: () => string;
        diffForHumans: () => string;
    }
}

Object.defineProperty(Date.prototype, 'getMonthName', {
    configurable: true,
    writable: false,
    value: function () {
        return format(this, 'LLLL');
    },
});

Object.defineProperty(Date.prototype, 'diffForHumans', {
    configurable: true,
    writable: false,
    value: function () {
        return formatDistance(new Date(), this);
    },
});

const shortUnits: Record<string, string> = {
    years: 'y',
    year: 'y',
    months: 'mo',
    month: 'mo',
    weeks: 'w',
    week: 'w',
    days: 'd',
    day: 'd',
    hours: 'h',
    hour: 'h',
    minutes: 'm',
    minute: 'm',
    seconds: 's',
    second: 's',
};

const shortenUnits = (str: string) => {
    return str.replace(/\b(years?|months?|weeks?|days?|hours?|minutes?|seconds?)\b/g, match => shortUnits[match] || match).replace(/(\d) (\w)/g, '$1$2');
};

export const diffForHumans = (date: Date, short = false) => {
    const formattedDate = formatDistanceToNowStrict(date, {
        addSuffix: true,
    });

    return short ? shortenUnits(formattedDate) : formattedDate;
};

export const formatDate = (date: string) => {
    try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch (ex) {
        return null;
    }
};

export const formatDateOrGetDash = (value: string) => (value ? formatDate(value) ?? '—' : '—');

export const formatLongDate = (value: string | Date) => {
    try {
        const date = typeof value === 'string' ? new Date(value) : value;

        return format(date, 'MMMM d, yyyy');
    } catch (ex) {
        return null;
    }
};

export const formatLongDateOrGetDash = (value: string | Date) => (value ? formatLongDate(value) ?? '—' : '—');

export const formatDateWithMonthInWords = (date: string) => {
    try {
        return format(new Date(date), 'dd MMM yyyy, HH:mm');
    } catch (ex) {
        return null;
    }
};

export const getShortDate = (dateString: string) => {
    try {
        const date = new Date(dateString);

        return format(date, 'MMM d');
    } catch (ex) {
        return null;
    }
};

export const checkIsGPSStatusRecentlyUpdated = (dateString: string) => {
    try {
        const date = new Date(dateString);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - date.getTime();
        const oneHourInMilliseconds = 60 * 60 * 1000;

        return timeDifference < oneHourInMilliseconds;
    } catch (ex) {
        return null;
    }
};

export const CheckIsOutdated = (scheduledDateString: string, actualDateString: null | string) => {
    try {
        const actualDate = actualDateString ? new Date(actualDateString) : new Date();
        const scheduledDate = new Date(scheduledDateString);

        return actualDate > scheduledDate;
    } catch (ex) {
        return null;
    }
};

export const formatLongDateOrNull = (value: string | Date | null) => (value ? formatLongDate(value) ?? null : null);

export const formatDuration = (durationInSeconds: number) => {
    const duration = intervalToDuration({ start: 0, end: durationInSeconds * 1000 });

    return [duration.hours && `${duration.hours} h`, duration.minutes && `${duration.minutes} min`, duration.seconds && `${duration.seconds} sec`]
        .filter(Boolean)
        .join(' ');
};
