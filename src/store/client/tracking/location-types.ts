import { NullableFields } from '@/shared/nullable';

export type LatestLocation = {
    geoLatitude: number;
    geoLongitude: number;
    createdAt: string;
};

export type TrackingDriverRatings = NullableFields<{
    averageSpeed: number;
    dispatcherRating: number;
    dispatcherReviewsTotal: number;
    driverRating: number;
    driverReviewsTotal: number;
    rating: number;
    reviewsTotal: number;
}> | null;
