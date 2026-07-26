import accounting from './accounting.json';
import contactsPage from './admin-contact-page.json';
import administratorsPage from './administrators-page.json';
import carMakersPage from './car-makers-page.json';
import carModelsPage from './car-models-page.json';
import companiesPage from './companies-page.json';
import companyPage from './company-page.json';
import fuel from './fuel.json';
import ordersPage from './orders-page.json';
import passwordRecoveryPage from './password-recovery-page.json';
import passwordResetPage from './password-reset-page.json';
import preferencesPage from './preferences-page.json';
import signInPage from './sign-in-page.json';
import usersPage from './users-page.json';

export const admin = {
    'sign-in-page': signInPage,
    'administrators-page': administratorsPage,
    'users-page': usersPage,
    'contacts-page': contactsPage,
    'car-models-page': carModelsPage,
    'preferences-page': preferencesPage,
    'companies-page': companiesPage,
    'company-page': companyPage,
    fuel,
    'car-makers-page': carMakersPage,
    'password-recovery-page': passwordRecoveryPage,
    'password-reset-page': passwordResetPage,
    accounting: accounting,
    'orders-page': ordersPage,
};

export default admin;
