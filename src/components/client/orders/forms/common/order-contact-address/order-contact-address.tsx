import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { debounce } from 'debounce';
import { toKebabCase } from 'js-convert-case';
import { useForm } from 'react-final-form';

import { ContactFooterContext } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import { IconButton } from '@/components/common/icon-button/icon-button';
import AddressInputAutocompleteField from '@/fields/address-field/address-input-autocomplete-field';
import { getCopyToCustomerState } from '@/utils/order';
import { AutocompleteStringInput, FieldPrefixContext, FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { useDisableCarrierChanging } from '@hooks';
import { ContactsIcon } from '@icons';
import { useAppDispatch } from '@store';
import { Contact, useGetContactsByNameQuery, useLazyGetContactByIdQuery } from '@store/api/contacts-api';
import { fetchContactAction, OrderFieldsGroup } from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './order-contact-address.scss';

const t = translateByNamespace('client:order:contact-address-fields');
const cn = classname('order-contact-address');

type Props = {
    contactNameField: 'businessName' | 'customerName';
    contactNameFieldTitle?: string;
    className?: string;
    requiredFields?: string[];
};

export const OrderContactAddress = ({
    className,
    contactNameField,
    contactNameFieldTitle = t(`${toKebabCase(contactNameField)}-label`),
    requiredFields = [],
}: Props) => {
    const dispatch = useAppDispatch();
    const { batch, change, getState, blur } = useForm();
    const { prefix } = useContext(FieldPrefixContext);
    const { toggleSwitchState, toggleCopyBtnState } = useContext(ContactFooterContext);

    const [contactSearchQuery, setContactSearchQuery] = useState<string | null>(null);
    const [foundContact, setFoundContact] = useState<Contact | null>(null);
    const { data: contacts = [] } = useGetContactsByNameQuery(contactSearchQuery);
    const [fetchContact] = useLazyGetContactByIdQuery();

    useEffect(() => {
        if (contactSearchQuery === null) {
            const initialContactName = getState().initialValues?.[prefix]?.[contactNameField];
            const contactInList = contacts.find(contact => contact.name === initialContactName);

            if (contactInList) {
                setFoundContact(contactInList);
            }
        }
    }, [contactNameField, contacts, getState, prefix, contactSearchQuery]);

    const contactNames = useMemo<Array<AutocompleteSuggestion>>(
        () =>
            contacts.map(contact => ({
                value: contact.name,
            })),
        [contacts],
    );

    const toggleCopyToCustomerState = useCallback(
        (val: string, key: string) => {
            const stateValues = getState().values;

            const addressFieldValue = getCopyToCustomerState(stateValues, prefix, val, key);

            toggleCopyBtnState(prefix as OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION, addressFieldValue);
            toggleSwitchState(
                prefix as OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION | OrderFieldsGroup.CUSTOMER_INFORMATION,
                addressFieldValue,
            );
        },
        [toggleCopyBtnState, toggleSwitchState, prefix, getState],
    );

    const debouncedContactNameChange = useMemo(() => {
        return debounce((value: string) => {
            setContactSearchQuery(value);
            setFoundContact(null);
        }, 300);
    }, []);

    const handleSelectedContactName = useCallback(
        (selectedContact: AutocompleteSuggestion) => {
            const contact = contacts.find(contact => contact.name === selectedContact.value);

            if (contact) {
                fetchContact(contact.id)
                    .unwrap()
                    .then(({ address, city, state, zip, phone, name, email }) => {
                        setFoundContact(contact);
                        batch(() => {
                            change(`${prefix}.${contactNameField}`, selectedContact.value);
                            change(`${prefix}.streetAddress`, address);
                            change(`${prefix}.city`, city);
                            change(`${prefix}.state`, state);
                            change(`${prefix}.zip`, zip);
                            change(`${prefix}.phone`, phone);
                            change(`${prefix}.fullName`, name);
                            change(`${prefix}.email`, email);

                            if (requiredFields.length) {
                                blur(`${prefix}.city`);
                                blur(`${prefix}.state`);
                                blur(`${prefix}.zip`);
                            }
                        });
                    })
                    .catch(() => undefined);
            }
        },
        [batch, change, blur, contactNameField, contacts, fetchContact, prefix, requiredFields.length],
    );

    const isDisabled = useDisableCarrierChanging();

    const handleCreateEditContactDrawerOpen = useCallback(() => {
        if (foundContact) {
            dispatch(fetchContactAction(foundContact.id));
            dispatch(contactsActions.setCreateEditModalProps({ isVisible: true, mode: 'edit', contactId: foundContact.id }));
        }
    }, [dispatch, foundContact]);

    const contactNameFieldTitleBlock = useMemo(
        () =>
            foundContact ? (
                <span className={cn('contact-name-title')}>
                    {contactNameFieldTitle}
                    <IconButton Icon={ContactsIcon} onClick={handleCreateEditContactDrawerOpen} />
                </span>
            ) : (
                contactNameFieldTitle
            ),
        [foundContact, contactNameFieldTitle, handleCreateEditContactDrawerOpen],
    );

    const isFieldRequired = useCallback((fieldName: string) => requiredFields.includes(fieldName), [requiredFields]);
    const conditionalValidator = useCallback((fieldName: string) => (isFieldRequired(fieldName) ? required : undefined), [isFieldRequired]);

    return (
        <>
            <div className={cn('', [className])}>
                <PrefixedField
                    disabled={isDisabled}
                    className={cn('name-field')}
                    label={contactNameFieldTitleBlock}
                    name={contactNameField}
                    component={AutocompleteStringInput}
                    suggestions={contactNames}
                    onChangeText={(value: string) => {
                        debouncedContactNameChange(value);
                        toggleCopyToCustomerState(value, contactNameField);
                    }}
                    onSelectSuggestion={handleSelectedContactName}
                    parse={value => value}
                    placeholder=''
                />
                <PrefixedField
                    disabled={isDisabled}
                    className={cn('street-address-field')}
                    name='streetAddress'
                    label={t('street-address-label')}
                    component={AddressInputAutocompleteField}
                    onChangeText={(value: string) => {
                        toggleCopyToCustomerState(value, 'streetAddress');
                    }}
                    parse={value => value}
                    placeholder=''
                />
                <FormControl className={cn('city-field')}>
                    <InputLabel required={isFieldRequired('city')}>{t('city-label')}</InputLabel>
                    <PrefixedField
                        disabled={isDisabled}
                        component={TextField}
                        callback={(value: string) => {
                            toggleCopyToCustomerState(value, 'city');
                        }}
                        name='city'
                        parse={value => value}
                        placeholder=''
                        validate={conditionalValidator('city')}
                    />
                </FormControl>
                <FormControl className={cn('state-field')}>
                    <InputLabel required={isFieldRequired('state')}>{t('state-label')}</InputLabel>
                    <PrefixedField
                        disabled={isDisabled}
                        component={TextField}
                        callback={(value: string) => {
                            toggleCopyToCustomerState(value, 'state');
                        }}
                        name='state'
                        parse={value => value}
                        placeholder=''
                        validate={conditionalValidator('state')}
                    />
                </FormControl>
                <PrefixedField
                    className={cn('zip-field')}
                    disabled={isDisabled}
                    component={AddressInputAutocompleteField}
                    searchType='postcode'
                    onChangeText={(value: string) => {
                        toggleCopyToCustomerState(value, 'zip');
                    }}
                    name='zip'
                    parse={value => value}
                    placeholder=''
                    validate={conditionalValidator('zip')}
                    required={isFieldRequired('zip')}
                    label={t('zip-label')}
                />
            </div>
        </>
    );
};
