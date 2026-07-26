import { Action, combineReducers } from '@reduxjs/toolkit';

import { blackListReducer } from './black-list';
import { chatsReducer } from './chats';
import { contactsReducer } from './contacts';
import { messagesReducer } from './messages';
import { notificationsReducer } from './notifications';
import { ordersReducer } from './orders';
import { passwordRecoveryReducer } from './password-recovery';
import { paymentTermsReducer } from './payment-terms';
import { rolesSettingsReducer } from './roles-settings';
import { specializationsReducer } from './specialization';
import { staffReducer } from './staff';
import { twilioReducer } from './twilio';
import { viewersReducer } from './viewers';

export * from './staff';
export * from './password-recovery';
export * from './payment-terms';
export * from './contacts';
export * from './roles-settings';
export * from './chats';
export * from './notifications';
export * from './specialization';
export * from './orders';
export * from './black-list';
export * from './messages';

type CommonState = {
    staff: ReturnType<typeof staffReducer>;
    contacts: ReturnType<typeof contactsReducer>;
    messages: ReturnType<typeof messagesReducer>;
    passwordRecovery: ReturnType<typeof passwordRecoveryReducer>;
    paymentTerms: ReturnType<typeof paymentTermsReducer>;
    viewers: ReturnType<typeof viewersReducer>;
    rolesSettings: ReturnType<typeof rolesSettingsReducer>;
    chats: ReturnType<typeof chatsReducer>;
    notifications: ReturnType<typeof notificationsReducer>;
    specializations: ReturnType<typeof specializationsReducer>;
    orders: ReturnType<typeof ordersReducer>;
    blackList: ReturnType<typeof blackListReducer>;
    twilio: ReturnType<typeof twilioReducer>;
};

export const commonReducer = combineReducers<CommonState, Action>({
    staff: staffReducer,
    passwordRecovery: passwordRecoveryReducer,
    paymentTerms: paymentTermsReducer,
    contacts: contactsReducer,
    messages: messagesReducer,
    rolesSettings: rolesSettingsReducer,
    chats: chatsReducer,
    notifications: notificationsReducer,
    specializations: specializationsReducer,
    orders: ordersReducer,
    blackList: blackListReducer,
    twilio: twilioReducer,
    viewers: viewersReducer,
});
