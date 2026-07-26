import React, { useCallback, useEffect, useMemo, useState } from 'react';
import randomColor from 'randomcolor';
import { Field, FieldRenderProps, Form } from 'react-final-form';

import { SelectOption } from '@/shared';
import { Button, ChartData, Paper, StackedAreaChart } from '@components';
import { SelectField } from '@fields';
import { useAppSelector } from '@store';
import { GetStatisticParams, StatisticInformation, useLazyGetStatisticsQuery } from '@store/api/users-api';
import { accountsUsersSelector, AccountUser } from '@store/client/accounts';
import { authorizedUserPublicIdSelector } from '@store/global';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { DashboardEmptyBlock } from '../empty-block';

import './dashboard-statistics-block.scss';

const cn = classname('dashboard-statistics-block');
const t = translateByNamespace('client:dashboard-page:statictics-block');

type CompanyFilterFormState = {
    accounts: SelectOption<string>[];
};

const PERIODS = ['last-month', 'six-months', 'one-year'];

type Props = {
    type: GetStatisticParams['type'];
};

const COLORS = ['#409EFF', '#58B72F', '#E6A23C', '#909399'];

export const DashboardStatisticsBlock = (props: Props) => {
    const { type } = props;
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
    const [selectedAccounts, setSelectedAccounts] = useState<AccountUser[]>([]);

    const userPublicId = useAppSelector(authorizedUserPublicIdSelector) as string;
    const accounts = useAppSelector(accountsUsersSelector);
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const options = useMemo(
        () =>
            fetchedAccounts
                ?.filter(({ publicId }) => userPublicId !== publicId)
                ?.map(account => ({
                    value: account.publicId,
                    label: account.company?.name as string,
                })),
        [fetchedAccounts, userPublicId],
    );

    const initialValues = useMemo(() => ({ accounts: options?.[0] ? [options?.[0]] : [] }), [options]);

    const accountFilterSubmit = useCallback(
        ({ accounts: selectedAccountsOptions }: CompanyFilterFormState) => {
            if (!accounts) {
                return;
            }

            setSelectedAccounts(selectedAccountsOptions.map(({ value }) => accounts.find(({ publicId }) => publicId === value) as AccountUser));
        },
        [accounts],
    );

    const [getStatistics] = useLazyGetStatisticsQuery();
    const [companiesStatistics, setCompaniesStatistics] = useState<StatisticInformation[]>();

    useEffect(() => {
        if (!selectedAccounts.length) return;

        (async () => {
            const statictics = await getStatistics({
                publicIds: selectedAccounts.map(({ publicId }) => publicId),
                statistics_period: selectedPeriod,
                type,
            }).unwrap();

            setCompaniesStatistics(statictics);
        })();
    }, [getStatistics, selectedAccounts, selectedPeriod, type]);

    const chartData = useMemo(() => {
        const result: { [key: string]: ChartData } = {};

        if (selectedAccounts && companiesStatistics) {
            companiesStatistics?.forEach((companyStatistics, index) => {
                const account = selectedAccounts[index];

                if (!account) {
                    return;
                }

                companyStatistics.forEach(({ date, value }) => {
                    let point = result[date];

                    if (!point) {
                        result[date] = { name: date };
                        point = result[date];

                        selectedAccounts.forEach(({ company }) => {
                            if (company) {
                                point[company.name] = 0;
                            }
                        });
                    }
                    const name = account.company?.name;

                    if (name) {
                        point[name] = value ? parseInt(value) : 0;
                    }
                });
            });
        }

        return Object.values(result).sort((a, b) => {
            return new Date(a.name) > new Date(b.name) ? 1 : -1;
        });
    }, [companiesStatistics, selectedAccounts]);

    const chartAreas = useMemo(() => {
        if (!selectedAccounts) {
            return [];
        }

        return selectedAccounts.map(({ company }, index) => ({
            dataKey: company?.name as string,
            color: index < COLORS.length ? COLORS[index] : randomColor({ luminosity: 'bright' }),
        }));
    }, [selectedAccounts]);

    const body = useMemo(() => {
        if (options?.length && chartData?.length) {
            return (
                <StackedAreaChart
                    labelXAxis={t('axis-labels:x')}
                    labelYAxis={t('axis-labels:y')}
                    height={344}
                    margins={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                    areas={chartAreas}
                    data={chartData}
                />
            );
        }

        return <DashboardEmptyBlock />;
    }, [chartAreas, chartData, options?.length]);

    const actions = useMemo(() => {
        return (
            <div className={cn('filters')}>
                <div className={cn('period-filter')}>
                    {PERIODS.map(period => (
                        <Button key={period} view={period === selectedPeriod ? 'primary' : 'default'} size='small' onClick={() => setSelectedPeriod(period)}>
                            {t(`period-filter-options:${period}`)}
                        </Button>
                    ))}
                </div>
                <Form<CompanyFilterFormState>
                    onSubmit={accountFilterSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <FormValuesSpy onChange={handleSubmit} debounceTime={300} />
                            <Field
                                name='accounts'
                                component={(props: FieldRenderProps<string>) => (
                                    <SelectField
                                        {...props}
                                        options={options}
                                        isisSearchable={false}
                                        isClearable={false}
                                        isMulti={true}
                                        minLimit={1}
                                        maxLimit={2}
                                        chipsMaxToShow={1}
                                    />
                                )}
                            />
                        </form>
                    )}
                />
            </div>
        );
    }, [accountFilterSubmit, initialValues, options, selectedPeriod]);

    return <Paper title={t(`titles:${type}`)} actions={actions} body={body} className={cn()} />;
};
