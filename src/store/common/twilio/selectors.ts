type AppState = {
    common: {
        twilio: any;
    };
};

const twilioSelector = (state: AppState) => state.common.twilio;

export const deviceSelector = (state: AppState) => twilioSelector(state).device;
