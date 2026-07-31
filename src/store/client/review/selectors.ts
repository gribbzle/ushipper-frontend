type AppState = {
    client: {
        review: any;
    };
};

const reviewSelector = (state: AppState) => state.client.review;

export const reviewReplyDrawerPropsSelector = (state: AppState) => {
    const { reviewReplyDrawer } = reviewSelector(state);

    return reviewReplyDrawer;
};

export const orderReviewPopupPropsSelector = (state: AppState) => {
    const { orderReviewPopup } = reviewSelector(state);

    return orderReviewPopup;
};
