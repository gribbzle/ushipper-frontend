type PerCentage = number;
type Rating = number;
type ReviewsTotal = number;

type ScoreDetail = {
    rating: Rating;
    count: number;
    percentage: PerCentage;
};

type AverageItem = {
    title: string;
    rating: Rating;
};

export type CompanyTotalRating = {
    rating: Rating;
    reviewsTotal: ReviewsTotal;
    perScore: ScoreDetail[];
    itemsAvg: AverageItem[];
};
