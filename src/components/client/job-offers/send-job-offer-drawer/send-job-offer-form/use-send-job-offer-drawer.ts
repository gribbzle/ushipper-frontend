import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { TimeCondition } from '@/enums/time-condition';
import { UserRoleType } from '@/enums/user-role-type';
import { useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { useMeDispatcher, useMeDriver } from '@/hooks/use-user-role-group';
import { Attachment } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@store';
import { jobOffersApi, useCreateJobOfferMutation, usePartiallyUpdateJobOfferMutation } from '@store/api/job-offers';
import { TermCondition } from '@store/client';
import { sendJobOfferDrawerSelector } from '@store/client/job-offers/selectors';
import { setSendJobOfferDrawerProps } from '@store/client/job-offers/slice';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { SendJobOfferFormValue } from './send-job-offer-form.types';

const t = translateByNamespace('client:send-job-offer');
const translateCompanyType = translateByNamespace('common:company-types');

export const useSendJobOfferDrawer = () => {
    const { id, jobOffer, isDrawerOpened } = useAppSelector(sendJobOfferDrawerSelector);
    const formRef = useRef<FormApi<SendJobOfferFormValue>>();
    const loadedAttachmentsRef = useRef<Attachment[]>([]);

    const [createJobOffer] = useCreateJobOfferMutation();
    const [updateJobOffer] = usePartiallyUpdateJobOfferMutation();
    const dispatch = useAppDispatch();
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();

    useEffect(() => {
        loadedAttachmentsRef.current = jobOffer?.attachments || [];
    }, [jobOffer]);

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleCloseDrawer = useCallback(() => {
        dispatch(setSendJobOfferDrawerProps({ id: null, to: null, isDrawerOpened: false, jobOffer: null }));
    }, [dispatch]);

    const isDriverOwnerPage = useIsDriverOwnerPage();

    const isJobOfferForDriver = isDriverOwnerPage || jobOffer?.receiver.roleName === 'DriverOwner';

    const removeRoleTypeForDispatcher = (values: SendJobOfferFormValue) => {
        if (isMeDispatcher || isMeDriver) {
            delete values.roleType;
        }
        if (isMeDriver || isJobOfferForDriver) {
            delete values.dispatchFee;
        }
    };

    const onSubmit = useCallback(
        async (values: SendJobOfferFormValue) => {
            removeRoleTypeForDispatcher(values);

            try {
                if (jobOffer?.publicId && loadedAttachmentsRef.current) {
                    const { attachments, ...rest } = values;

                    await updateJobOffer({
                        publicOfferId: jobOffer.publicId,
                        jobOfferData: { ...rest, attachments: [...attachments, ...loadedAttachmentsRef.current] },
                    }).unwrap();
                    handleCloseDrawer();
                    dispatch(
                        jobOffersApi.util.invalidateTags([
                            { type: 'JobOffers', id: 'LIST' },
                            { type: 'JobOffers', id: 'Statistic' },
                        ]),
                    );
                } else if (id) {
                    await createJobOffer({
                        ...(isMeDispatcher || isMeDriver ? { offeringCompanyId: id } : { receiverId: id }),
                        ...values,
                    }).unwrap();

                    handleCloseDrawer();

                    toast.success(
                        t<string>('send-offer-success', { companyType: translateCompanyType(isMeDispatcher || isMeDriver ? 'carrier' : 'dispatcher') }),
                    );
                }
            } catch (exception) {
                handleError(exception);
            }
        },
        [removeRoleTypeForDispatcher, jobOffer, id, updateJobOffer, handleCloseDrawer, dispatch, createJobOffer, isMeDispatcher, isMeDriver],
    );

    const initialValues = useMemo<SendJobOfferFormValue>(() => {
        const { businessHours, dispatchFee, term, startDate, description, attachments, offeredRole } = jobOffer || {};

        return {
            roleType: offeredRole || ('' as UserRoleType),
            businessHours: businessHours || TimeCondition.TWENTY_FOUR_HOURS,
            dispatchFee: dispatchFee || 0,
            term: term || ('' as TermCondition),
            startDate: startDate || '',
            description: description || '',
            attachments: attachments || [],
        };
    }, [jobOffer]);

    return {
        initialValues,
        formRef,
        isDrawerOpened,
        loadedAttachmentsRef,
        onSubmit,
        handleSubmitClick,
        handleCloseDrawer,
    };
};
