import { AppState } from '@store';

const twilioSelector = (state: AppState) => state.common.twilio;

export const deviceSelector = (state: AppState) => twilioSelector(state).device;
