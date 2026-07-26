import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';
import { adminOnlyGetServerSideProps } from '@utils';

export const getServerSideProps = adminOnlyGetServerSideProps(store => async ({ query }) => {
    if (query.carMakerId && typeof query.carMakerId === 'string') {
        store.dispatch(carModelsSettingsActions.setFilters({ makerId: query.carMakerId }));
    }

    return { props: {} };
});

export { default } from './car-models';
