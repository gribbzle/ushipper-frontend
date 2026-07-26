import carriersCatalogPage from './carriers-catalog.json';
import catalogs from './catalogs.json';
import companyPage from './company-page.json';
import companySetting from './company-settings.json';
import contactsPage from './contacts-page.json';
import dashboardPage from './dashboard-page.json';
import dispatchersCatalogPage from './dispatchers-catalog.json';
import driversCatalogPage from './drivers-catalog.json';
import driversPlanPage from './drivers-plan.json';
import jobOffersPage from './job-offers-page.json';
import loadboard from './loadboard.json';
import loadboardFilters from './loadboard-filters.json';
import Order from './order.json';
import orderActions from './order-actions.json';
import orderBOLPage from './order-BOL-page.json';
import orderOffers from './order-offers.json';
import orderReview from './order-review.json';
import orderSearchSubjects from './order-search-subjects.json';
import ordersPage from './orders-page.json';
import passwordRecoveryPage from './password-recovery-page.json';
import passwordResetPage from './password-reset-page.json';
import Popups from './popups.json';
import profileSettings from './profile-settings.json';
import requestsPage from './requests-page.json';
import sendJobOffer from './send-job-offer.json';
import signInPage from './sign-in-page.json';
import signUpConfirmationPage from './sign-up-confirmation-page.json';
import signUpPage from './sign-up-page.json';
import staffPage from './staff-page.json';
import trackingPage from './tracking-page.json';
import walletPage from './wallet-page.json';

export const client = {
    'carriers-catalog': carriersCatalogPage,
    catalogs,
    'contacts-page': contactsPage,
    'company-page': companyPage,
    'dashboard-page': dashboardPage,
    'dispatchers-catalog': dispatchersCatalogPage,
    'drivers-catalog': driversCatalogPage,
    'drivers-plan': driversPlanPage,
    'job-offers-page': jobOffersPage,
    'sign-in-page': signInPage,
    'staff-page': staffPage,
    'sign-up-page': signUpPage,
    'sign-up-confirmation-page': signUpConfirmationPage,
    'password-recovery-page': passwordRecoveryPage,
    'password-reset-page': passwordResetPage,
    'orders-page': ordersPage,
    order: Order,
    popups: Popups,
    'order-actions': orderActions,
    'order-BOL-page': orderBOLPage,
    'tracking-page': trackingPage,
    'order-search-subjects': orderSearchSubjects,
    'requests-page': requestsPage,
    'order-review': orderReview,
    'order-offers': orderOffers,
    loadboard,
    'loadboard-filters': loadboardFilters,
    'company-settings': companySetting,
    'profile-settings': profileSettings,
    'send-job-offer': sendJobOffer,
    'wallet-page': walletPage,
};

export default client;
