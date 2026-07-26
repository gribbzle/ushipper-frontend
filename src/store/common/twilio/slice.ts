import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Device } from '@twilio/voice-sdk';

type TwilioState = {
    device: Device | null;
};

const initialState: TwilioState = {
    device: null,
};

const twilioSlice = createSlice({
    name: 'twilio',
    initialState,
    reducers: {
        setDevice: (state, action: PayloadAction<TwilioState['device']>) => {
            state.device = action.payload;
        },
    },
});

export const twilioActions = twilioSlice.actions;

export const twilioReducer = twilioSlice.reducer;
