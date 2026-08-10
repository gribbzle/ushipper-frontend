import React, { useContext } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { useForm } from 'react-final-form';

import { ContactFooterContext } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { Button } from '@/components/common/button/button';
import { NativeSwitch, NativeSwitchProps } from '@/fields/switch-input/native-switch';
import {FieldPrefixContext, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './contact-info-footer.scss';

const t = translateByNamespace('client:order');
const cn = classname('contact-info-footer');

type Props = {
    hideCopyBtn?: boolean;
};

export default function ContactInfoFooter({ hideCopyBtn }: Props) {
    const { prefix } = useContext(FieldPrefixContext);
    const { contactInfoFooterSwitchActiveState, contactInfoFooterCopyBtnActiveState } = useContext(ContactFooterContext);
    const { batch, change, getState } = useForm();
    const onCopy = () => {
        batch(() => {
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.customerName`, getState().values[prefix].businessName);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.phone`, getState().values[prefix].phone);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.streetAddress`, getState().values[prefix].streetAddress);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.city`, getState().values[prefix].city);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.state`, getState().values[prefix].state);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.zip`, getState().values[prefix].zip);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.email`, getState().values[prefix].email);
            change(`${OrderFieldsGroup.CUSTOMER_INFORMATION}.fullName`, getState().values[prefix].fullName);
        });
    };

    return (
        <div className={cn()}>
            <FormControl>
                <PrefixedField
                    render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                        return (
                            <NativeSwitch
                                disabled={!contactInfoFooterSwitchActiveState[prefix]}
                                checked={props.input.value}
                                onChange={props.input.onChange}
                                {...props}
                            />
                        );
                    }}
                    name='createNewContact'
                    label={t('save-as-new')}
                />
            </FormControl>
            {!hideCopyBtn && (
                <Button size='medium' onClick={onCopy} view='default' disabled={!contactInfoFooterCopyBtnActiveState[prefix]}>
                    {t('copy-to-customer')}
                </Button>
            )}
        </div>
    );
}
