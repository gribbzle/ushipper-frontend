import { isNumber } from '@/shared/type-guards';
import { TrackingDriver, User } from '@store/client';

import { formatDrivingDistance } from '../driving';
import { translateByNamespace } from '../i18n';

const t = translateByNamespace('client:tracking-page');
const counterT = translateByNamespace('client:tracking-page:counters');

export const getTrackingDriverReviewsTotal = (driver: TrackingDriver): number => driver.ratings?.reviewsTotal ?? 0;

export const getTrackingDriverRating = (driver: TrackingDriver): number | null => driver.ratings?.rating ?? driver.rating;

export const getTrackingDriverAverageSpeed = (driver: TrackingDriver | User): number | null => driver.ratings?.averageSpeed ?? null;

export const getLocalizeAverageSpeed = (speed: number): string => counterT('about-speed', { speed: speed.toFixed(1) });

export const getFormattedAverageSpeed = (speed?: number | null): string => (isNumber(speed) ? getLocalizeAverageSpeed(speed) : t('no-details'));

export const getFormattedTrackingDriverAverageSpeed = (driver: TrackingDriver): string => getFormattedAverageSpeed(getTrackingDriverAverageSpeed(driver));

export const getLocalizeAboutDelivery = (time: number): string => counterT('about-delivery', { time });

export const getFormattedDeliveryTime = (time: number | null): string => (isNumber(time) ? getLocalizeAboutDelivery(time) : t('no-details'));

export const getFormattedDrivingDistance = (distance: number | null): string => formatDrivingDistance(distance) || t('no-details');

export const getTrackingDriverTruckLoadPercentage = (driver: TrackingDriver): number | null => {
    const { trailerCapacity, orders } = driver;

    if (!trailerCapacity) {
        return null;
    }

    const totalVehicles = orders.reduce((acc, order) => acc + order.vehiclesCount, 0);

    return (totalVehicles / trailerCapacity) * 100;
};
