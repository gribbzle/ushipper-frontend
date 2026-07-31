type AppState = {
    client: {
        jobOffers: any;
    };
};

const jobOffersSelectors = (state: AppState) => state.client.jobOffers;

export const sendJobOfferDrawerSelector = (state: AppState) => jobOffersSelectors(state).sendJobOfferDrawerProps;
