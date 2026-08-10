import React from 'react';

import { Link } from '@/components/common/link/link';
import { SignUpStep } from '@/enums/sign-up-step';
import CheckIcon from '@/pages/client/sign-up/check.svg';
import logos from '@logo';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:sign-up-page');
const cn = classname('sign-up-page');

type Props = {
    currentStep: SignUpStep;
    getStepIndex: (name: SignUpStep) => number;
    steps: SignUpStep[];
};

export type SidebarSteps = {
    description: string;
    title: string;
    name: SignUpStep;
}[];

const { LogoWhiteDefaultAll } = logos;

export const Sidebar = (props: Props) => {
    const sidebarSteps = t<SidebarSteps>('sidebar.steps');
    const { currentStep, steps, getStepIndex } = props;

    return (
        <div className={cn('sidebar')}>
            <div className={cn('geometry-1')} />
            <div className={cn('geometry-2')} />
            <div className={cn('logo-container')}>
                <LogoWhiteDefaultAll />
            </div>
            <div className={cn('steps')}>
                {sidebarSteps
                    .filter(step => steps.indexOf(step.name) > -1)
                    .map(({ title, description, name }, index) => (
                        <div className={cn('step', { current: name === currentStep, completed: getStepIndex(currentStep) > getStepIndex(name) })} key={index}>
                            <span className={cn('step-bullet')}>{getStepIndex(currentStep) <= index ? index + 1 : <CheckIcon />}</span>
                            <span className={cn('step-info')}>
                                <h4>{title}</h4>
                                <p>{description}</p>
                            </span>
                        </div>
                    ))}
            </div>
            <div className={cn('footer-links')}>
                <Link href='/client/sign-in' as='/sign-in'>
                    Terms
                </Link>
                <Link href='/client/sign-in' as='/sign-in'>
                    Plans
                </Link>
                <Link href='/client/sign-in' as='/sign-in'>
                    Contact Us
                </Link>
            </div>
        </div>
    );
};
