import { differenceInMinutes } from 'date-fns';

import { isNumber } from '@/shared/type-guards';
import { convertMetersToMiles } from '@/utils/converter';

export const getDestination = (meters = 0, round = false, decimalPlaces = 2): string => {
    const mi = convertMetersToMiles(meters);

    return (round ? Math.round(mi) : parseFloat(mi.toFixed(decimalPlaces))).toLocaleString('en-US', { style: 'unit', unit: 'mile' });
};

/**
 * Rounds hours to the nearest whole hour based on minutes.
 * @param fractionalHours - The time in hours as a decimal (e.g., 2.5 for 2 hours and 30 minutes).
 * @returns The rounded time in whole hours.
 */

const roundHours = (fractionalHours: number): number => {
    const hours = Math.floor(fractionalHours);
    const minutes = Math.round((fractionalHours - hours) * 60);

    return minutes >= 30 ? hours + 1 : hours;
};

/**
 * Calculates delivery time in hours based on driving distance and current speed.
 * @param meters - Distance in meters
 * @param currentSpeed - Speed in miles per hour
 * @returns Estimated delivery time in hours, rounded to the nearest whole hour
 */

export const calculateDeliveryTime = (drivingDistance?: number | null, currentSpeed?: number | null): number | null => {
    if (!drivingDistance || drivingDistance <= 0 || !currentSpeed || currentSpeed <= 0) {
        return null;
    }

    return roundHours(convertMetersToMiles(drivingDistance) / currentSpeed);
};

type CalculateElapsedTimeProps = {
    startTime: string | Date | null;
    endTime: string | Date | null;
};

export const calculateElapsedTime = ({ startTime, endTime }: CalculateElapsedTimeProps): number | null => {
    if (!startTime || !endTime) {
        return null;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return null;
    }

    const totalTime = differenceInMinutes(endDate, startDate) / 60;

    return roundHours(totalTime);
};

/**
 * Formats the distance if it is a valid number.
 * @param distance - The distance value in numeric format.
 * @returns A formatted distance string or null.
 */
export const formatDrivingDistance = (distance: number | null): string | null => {
    return isNumber(distance) ? getDestination(distance, false, 1) : null;
};
